import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, limit, startAfter, getDocs, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import './Community.css';

const TOPICS = [
  { id: 'tip', label: 'Tip 💡', class: 'tip' },
  { id: 'motivation', label: 'Motivation 🔥', class: 'motivation' },
  { id: 'resource', label: 'Resource 📚', class: 'resource' },
  { id: 'success', label: 'Success Story 🎉', class: 'success' },
  { id: 'question', label: 'Question ❓', class: 'question' }
];

const FILTERS = ['All Posts', 'Tip 💡', 'Success Story 🎉', 'Question ❓', 'Motivation 🔥'];

function timeAgo(dateInput) {
  if (!dateInput) return 'just now';
  const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function Community() {
  const { currentUser, userProfile } = useAuth();
  
  // Post Creation State
  const [content, setContent] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Feed State
  const [posts, setPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All Posts');
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (isLoadMore = false) => {
    setLoading(true);
    try {
      const feedRef = collection(db, 'feed');
      let q;
      
      const queryConstraints = [orderBy('createdAt', 'desc'), limit(10)];
      
      if (activeFilter !== 'All Posts') {
        queryConstraints.unshift(where('topicLabel', '==', activeFilter));
      }

      if (isLoadMore && lastVisible) {
        q = query(feedRef, ...queryConstraints, startAfter(lastVisible));
      } else {
        q = query(feedRef, ...queryConstraints);
      }

      const snapshot = await getDocs(q);
      const newPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (snapshot.docs.length > 0) {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }
      
      if (snapshot.docs.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (isLoadMore) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [activeFilter]);

  const handlePost = async () => {
    if (!currentUser) {
      alert("Please login to post!");
      return;
    }
    if (!content.trim() || !selectedTopic) {
      alert("Please enter content and select a topic.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newPost = {
        userId: currentUser.uid,
        userName: userProfile?.displayName || currentUser.displayName || 'Student',
        userRole: userProfile?.role || 'student',
        userCollege: userProfile?.college || '',
        content: content.trim(),
        topicId: selectedTopic.id,
        topicLabel: selectedTopic.label,
        topicClass: selectedTopic.class,
        reactions: { helpful: [], inspiring: [], interesting: [] },
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'feed'), newPost);
      
      setContent('');
      setSelectedTopic(null);
      // Fetch fresh posts
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to post. Try again.");
    }
    setIsSubmitting(false);
  };

  const handleReaction = async (postId, reactionType, currentReactions) => {
    if (!currentUser) {
      alert("Please login to react!");
      return;
    }

    const postRef = doc(db, 'feed', postId);
    const hasReacted = currentReactions[reactionType]?.includes(currentUser.uid);
    
    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newArr = hasReacted 
          ? p.reactions[reactionType].filter(uid => uid !== currentUser.uid)
          : [...(p.reactions[reactionType] || []), currentUser.uid];
        
        return {
          ...p,
          reactions: {
            ...p.reactions,
            [reactionType]: newArr
          }
        };
      }
      return p;
    }));

    try {
      await updateDoc(postRef, {
        [`reactions.${reactionType}`]: hasReacted ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
      });
    } catch (err) {
      console.error("Error updating reaction:", err);
      // Revert optimism by refetching would be ideal, but keeping it simple
    }
  };

  return (
    <div className="page-container community-container animate-fade-in-up">
      <h1 className="page-title">Community Feed</h1>
      <p className="page-subtitle mb-4">Connect with fellow learners, share knowledge, and grow together.</p>

      {/* Create Post Card */}
      <div className="create-post-card">
        <textarea 
          className="post-textarea"
          placeholder="Share something with the community..."
          maxLength={300}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className={`char-counter ${content.length >= 300 ? 'limit' : ''}`}>
          {content.length}/300
        </div>
        
        <div className="post-actions">
          <div className="topic-selector">
            {TOPICS.map(topic => (
              <button 
                key={topic.id}
                className={`topic-btn ${selectedTopic?.id === topic.id ? 'selected' : ''}`}
                onClick={() => setSelectedTopic(topic)}
              >
                {topic.label}
              </button>
            ))}
          </div>
          <button 
            className="btn-primary" 
            onClick={handlePost}
            disabled={isSubmitting || !content.trim() || !selectedTopic}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="feed-filter-bar">
        {FILTERS.map(filter => (
          <button 
            key={filter}
            className={`feed-filter-btn ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="feed-list">
        {posts.map(post => {
          const isHelpful = post.reactions?.helpful?.includes(currentUser?.uid);
          const isInspiring = post.reactions?.inspiring?.includes(currentUser?.uid);
          const isInteresting = post.reactions?.interesting?.includes(currentUser?.uid);

          return (
            <div key={post.id} className="post-card animate-slide-up">
              <div className="post-header">
                <div className="post-author-info">
                  <div className="post-avatar">
                    {getInitials(post.userName)}
                  </div>
                  <div>
                    <h4 className="post-author-name">
                      {post.userName}
                      <span className={`role-badge ${post.userRole === 'mentor' ? 'mentor' : ''}`}>
                        {post.userRole}
                      </span>
                    </h4>
                    {post.userCollege && <p className="post-college">{post.userCollege}</p>}
                  </div>
                </div>
                <div className="post-time">
                  {timeAgo(post.createdAt)}
                </div>
              </div>

              <span className={`topic-pill ${post.topicClass}`}>
                {post.topicLabel}
              </span>

              <p className="post-content">
                {post.content}
              </p>

              <div className="post-reactions">
                <button 
                  className={`reaction-btn ${isHelpful ? 'active' : ''}`}
                  onClick={() => handleReaction(post.id, 'helpful', post.reactions)}
                >
                  👍 Helpful {(post.reactions?.helpful?.length || 0) > 0 && <span>{post.reactions.helpful.length}</span>}
                </button>
                <button 
                  className={`reaction-btn ${isInspiring ? 'active' : ''}`}
                  onClick={() => handleReaction(post.id, 'inspiring', post.reactions)}
                >
                  🔥 Inspiring {(post.reactions?.inspiring?.length || 0) > 0 && <span>{post.reactions.inspiring.length}</span>}
                </button>
                <button 
                  className={`reaction-btn ${isInteresting ? 'active' : ''}`}
                  onClick={() => handleReaction(post.id, 'interesting', post.reactions)}
                >
                  🤔 Interesting {(post.reactions?.interesting?.length || 0) > 0 && <span>{post.reactions.interesting.length}</span>}
                </button>
              </div>
            </div>
          );
        })}
        
        {loading && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>}
        
        {!loading && posts.length === 0 && (
          <div className="empty-state-card card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="empty-state-icon" style={{ fontSize: '3rem' }}>🌱</div>
            <h3>No posts yet</h3>
            <p>Be the first to share something with the community!</p>
          </div>
        )}

        {hasMore && posts.length > 0 && !loading && (
          <button className="load-more-btn" onClick={() => fetchPosts(true)}>
            Load more posts
          </button>
        )}
      </div>
    </div>
  );
}
