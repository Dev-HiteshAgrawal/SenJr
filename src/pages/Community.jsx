import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, limit, startAfter, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, where, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
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
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit State
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState('');
  
  // Comment State
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }

    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handlePost = async () => {
    if (!currentUser) {
      alert("Please login to post!");
      return;
    }
    if (!content.trim() && !mediaFile) {
      alert("Please enter content or upload media.");
      return;
    }
    if (!selectedTopic) {
      alert("Please select a topic.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      let mediaUrl = null;
      let mediaType = null;

      if (mediaFile) {
        const fileRef = ref(storage, `feed/${currentUser.uid}/${Date.now()}_${mediaFile.name}`);
        await uploadBytes(fileRef, mediaFile);
        mediaUrl = await getDownloadURL(fileRef);
        mediaType = mediaFile.type.startsWith('image/') ? 'image' : 'video';
      }

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
        mediaUrl,
        mediaType,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'feed'), newPost);
      
      setContent('');
      setSelectedTopic(null);
      setMediaFile(null);
      setMediaPreview(null);
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to post. Try again.");
    }
    setIsSubmitting(false);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deleteDoc(doc(db, 'feed', postId));
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleUpdatePost = async () => {
    if (!editContent.trim()) return;
    try {
      await updateDoc(doc(db, 'feed', editingPostId), { content: editContent.trim() });
      setPosts(prev => prev.map(p => p.id === editingPostId ? { ...p, content: editContent.trim() } : p));
      setEditingPostId(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
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
        
        {mediaPreview && (
          <div className="media-preview-container">
            {mediaFile?.type.startsWith('image/') ? (
              <img src={mediaPreview} alt="Preview" />
            ) : (
              <video src={mediaPreview} controls />
            )}
            <button className="remove-media-btn" onClick={() => { setMediaFile(null); setMediaPreview(null); }}>✕</button>
          </div>
        )}

        <div className="create-post-footer">
          <div className={`char-counter ${content.length >= 300 ? 'limit' : ''}`}>
            {content.length}/300
          </div>
          
          <div className="post-actions">
            <div className="media-upload-btn">
              <label htmlFor="media-input">
                📁 Photo/Video
              </label>
              <input 
                id="media-input" 
                type="file" 
                accept="image/*,video/*" 
                onChange={handleFileChange} 
                hidden 
              />
            </div>

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
              disabled={isSubmitting || (!content.trim() && !mediaFile) || !selectedTopic}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
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
                <div className="post-header-right">
                  <div className="post-time">{timeAgo(post.createdAt)}</div>
                  {currentUser?.uid === post.userId && (
                    <div className="post-menu">
                      <button className="menu-dot-btn" onClick={() => {
                        setEditingPostId(post.id);
                        setEditContent(post.content);
                      }}>✏️</button>
                      <button className="menu-dot-btn delete" onClick={() => handleDeletePost(post.id)}>🗑️</button>
                    </div>
                  )}
                </div>
              </div>

              <span className={`topic-pill ${post.topicClass}`}>
                {post.topicLabel}
              </span>

              {editingPostId === post.id ? (
                <div className="edit-post-form">
                  <textarea 
                    className="post-textarea"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className="edit-actions">
                    <button className="btn-secondary" onClick={() => setEditingPostId(null)}>Cancel</button>
                    <button className="btn-primary" onClick={handleUpdatePost}>Save</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="post-content">{post.content}</p>
                  {post.mediaUrl && (
                    <div className="post-media">
                      {post.mediaType === 'video' ? (
                        <video src={post.mediaUrl} controls />
                      ) : (
                        <img src={post.mediaUrl} alt="Post content" onClick={() => window.open(post.mediaUrl)} />
                      )}
                    </div>
                  )}
                </>
              )}

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
                <button 
                  className={`reaction-btn comment-trigger ${activeCommentPostId === post.id ? 'active' : ''}`}
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                >
                  💬 Comment
                </button>
              </div>

              {activeCommentPostId === post.id && (
                <CommentSection postId={post.id} currentUser={currentUser} userProfile={userProfile} />
              )}
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

function CommentSection({ postId, currentUser, userProfile }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null); // { id, userName }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'feed', postId, 'comments'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setComments(docs);
      setLoading(false);
    });
    return unsub;
  }, [postId]);

  const handleSendComment = async () => {
    if (!newComment.trim() || !currentUser) return;
    
    try {
      const data = {
        userId: currentUser.uid,
        userName: userProfile?.displayName || currentUser.displayName || 'User',
        userRole: userProfile?.role || 'student',
        content: newComment.trim(),
        likes: [],
        parentId: replyTo?.id || null,
        replyToName: replyTo?.userName || null,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'feed', postId, 'comments'), data);
      setNewComment('');
      setReplyTo(null);
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  const handleLikeComment = async (commentId, currentLikes) => {
    if (!currentUser) return;
    const hasLiked = currentLikes.includes(currentUser.uid);
    const commentRef = doc(db, 'feed', postId, 'comments', commentId);
    try {
      await updateDoc(commentRef, {
        likes: hasLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
      });
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  // Organize comments into threads
  const rootComments = comments.filter(c => !c.parentId);
  const replies = comments.filter(c => c.parentId);

  return (
    <div className="comment-section-container">
      <div className="comment-list">
        {rootComments.map(comment => (
          <div key={comment.id} className="comment-item">
            <div className="comment-bubble">
              <div className="comment-author">
                {comment.userName}
                {comment.userRole === 'mentor' && <span className="comment-mentor-tag">Mentor</span>}
              </div>
              <p className="comment-text">{comment.content}</p>
              <div className="comment-footer">
                <span>{timeAgo(comment.createdAt)}</span>
                <button onClick={() => handleLikeComment(comment.id, comment.likes || [])}>
                  ❤️ {comment.likes?.length || 0}
                </button>
                <button onClick={() => setReplyTo({ id: comment.id, userName: comment.userName })}>Reply</button>
              </div>
            </div>
            
            {/* Threaded Replies */}
            <div className="reply-list">
              {replies.filter(r => r.parentId === comment.id).map(reply => (
                <div key={reply.id} className="reply-item">
                  <div className="comment-bubble reply">
                    <div className="comment-author">{reply.userName}</div>
                    <p className="comment-text">{reply.content}</p>
                    <div className="comment-footer">
                      <span>{timeAgo(reply.createdAt)}</span>
                      <button onClick={() => handleLikeComment(reply.id, reply.likes || [])}>
                        ❤️ {reply.likes?.length || 0}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {loading && <p className="comment-loading">Loading comments...</p>}
      </div>

      <div className="comment-input-area">
        {replyTo && (
          <div className="reply-indicator">
            Replying to {replyTo.userName}
            <button onClick={() => setReplyTo(null)}>✕</button>
          </div>
        )}
        <div className="comment-input-flex">
          <input 
            type="text" 
            placeholder="Write a comment..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
          />
          <button className="send-comment-btn" onClick={handleSendComment}>Send</button>
        </div>
      </div>
    </div>
  );
}
