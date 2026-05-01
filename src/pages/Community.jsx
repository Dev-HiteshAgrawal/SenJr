import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, limit, startAfter, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNotification } from '../contexts/NotificationContext';
import VideoCall from '../components/VideoCall';
import './Community.css';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dxyr3qvdd';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

const TOPICS = [
  { id: 'tip', label: 'Tip 💡', class: 'tip' },
  { id: 'motivation', label: 'Motivation 🔥', class: 'motivation' },
  { id: 'resource', label: 'Resource 📚', class: 'resource' },
  { id: 'success', label: 'Success Story 🎉', class: 'success' },
  { id: 'question', label: 'Question ❓', class: 'question' }
];

const FILTERS = ['All Posts', 'Tip 💡', 'Success Story 🎉', 'Question ❓', 'Motivation 🔥'];
const STORY_GRADIENTS = [
  'linear-gradient(135deg,#ff7a18,#ff2d55)',
  'linear-gradient(135deg,#f7971e,#ffd200)',
  'linear-gradient(135deg,#00c6ff,#0072ff)',
  'linear-gradient(135deg,#7f00ff,#e100ff)',
  'linear-gradient(135deg,#11998e,#38ef7d)',
];

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
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  
  // Post Creation State
  const [content, setContent] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiveSession, setIsLiveSession] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [activeLiveRoom, setActiveLiveRoom] = useState(null);
  
  // Edit State
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState('');
  
  // Comment State
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [stories, setStories] = useState([]);
  
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

  useEffect(() => {
    const q = query(collection(db, 'feed'), orderBy('createdAt', 'desc'), limit(25));
    const unsub = onSnapshot(q, (snap) => {
      const map = new Map();
      snap.docs.forEach((d, idx) => {
        const post = d.data();
        if (!post.userId || map.has(post.userId)) return;
        map.set(post.userId, {
          userId: post.userId,
          userName: post.userName || 'Student',
          userRole: post.userRole || 'student',
          createdAt: post.createdAt,
          style: STORY_GRADIENTS[idx % STORY_GRADIENTS.length],
        });
      });
      setStories(Array.from(map.values()).slice(0, 12));
    });
    return () => unsub();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!currentUser) {
      notifyInfo("Please login first to upload media!");
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) {
      notifyError("File size must be under 100MB");
      return;
    }

    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setUploadProgress(1);
    setMediaUrl(null);
    setMediaType(file.type.startsWith('image/') ? 'image' : 'video');

    // Upload to Cloudinary (free, no Blaze plan needed)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `senjr_feed/${currentUser.uid}`);

    const resourceType = file.type.startsWith('image/') ? 'image' : 'video';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setUploadProgress(Math.max(progress, 1));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        setMediaUrl(data.secure_url);
        setUploadProgress(100);
        notifySuccess("Media uploaded successfully!");
      } else {
        const errData = JSON.parse(xhr.responseText || '{}');
        const errMsg = errData.error?.message || "Unknown error";
        console.error('Cloudinary upload failed:', xhr.responseText);
        notifyError(`Cloudinary rejected upload: ${errMsg}`);
        setMediaFile(null);
        setMediaPreview(null);
        setUploadProgress(0);
      }
    };

    xhr.onerror = () => {
      notifyError("Upload failed. Check your internet connection.");
      setMediaFile(null);
      setMediaPreview(null);
      setUploadProgress(0);
    };

    xhr.send(formData);
  };

  const handlePost = async () => {
    if (!currentUser) {
      notifyInfo("Please login to share a post!");
      return;
    }
    
    const isUploading = mediaFile && !mediaUrl;
    if (isUploading) {
      notifyInfo("Please wait for the media to finish uploading...");
      return;
    }

    if (!content.trim() && !mediaUrl) {
      notifyError("Please enter some content or upload media.");
      return;
    }
    if (!selectedTopic) {
      notifyError("Please select a topic before posting.");
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
        reactions: { loving: [] },
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        isLive: isLiveSession,
        liveRoomId: isLiveSession ? `live-${currentUser.uid}` : null,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'feed'), newPost);
      
      setContent('');
      setSelectedTopic(null);
      setIsLiveSession(false);
      setMediaFile(null);
      setMediaPreview(null);
      setMediaUrl(null);
      setMediaType(null);
      setUploadProgress(0);
      fetchPosts();
      notifySuccess("Your post is live!");
    } catch (err) {
      console.error("Error creating post:", err);
      notifyError("Failed to publish your post. Try again.");
    }
    setIsSubmitting(false);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, 'feed', postId));
      setPosts(prev => prev.filter(p => p.id !== postId));
      notifySuccess("Post deleted.");
    } catch (err) {
      console.error("Delete failed:", err);
      notifyError("Failed to delete post.");
    }
  };

  const handleUpdatePost = async () => {
    if (!editContent.trim()) return;
    try {
      await updateDoc(doc(db, 'feed', editingPostId), { content: editContent.trim() });
      setPosts(prev => prev.map(p => p.id === editingPostId ? { ...p, content: editContent.trim() } : p));
      setEditingPostId(null);
      notifySuccess("Post updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      notifyError("Failed to update the post.");
    }
  };

  const handleReaction = async (postId, reactionType, currentReactions) => {
    if (!currentUser) {
      notifyInfo("Please login to react to posts!");
      return;
    }

    const postRef = doc(db, 'feed', postId);
    const safeReactions = currentReactions || {};
    const hasReacted = safeReactions[reactionType]?.includes(currentUser.uid);
    
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
      <h1 className="page-title">Community</h1>
      <p className="page-subtitle mb-4">A space to learn, share, and grow together.</p>

      <section className="stories-strip" aria-label="Community stories">
        <div className="story-item your-story" onClick={() => document.querySelector('.post-textarea')?.focus()}>
          <div className="story-ring">
            <div className="story-avatar">+</div>
          </div>
          <span>Share Story</span>
        </div>
        {stories.map((story) => (
          <div className="story-item" key={story.userId}>
            <div className="story-ring" style={{ background: story.style }}>
              <div className="story-avatar">{getInitials(story.userName)}</div>
            </div>
            <span>{story.userName.split(' ')[0]}</span>
          </div>
        ))}
      </section>

      {/* Create Post Card */}
      <div className="create-post-card">
        <textarea 
          className="post-textarea"
          placeholder="What's on your mind?"
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

        {uploadProgress > 0 && (
          <div className="upload-progress-bar">
            <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }}></div>
            <span className="upload-progress-text">
              {uploadProgress === 100 ? '✅ Ready to post' : `${Math.round(uploadProgress)}% uploading...`}
            </span>
          </div>
        )}

        <div className="create-post-footer">
          <div className={`char-counter ${content.length >= 300 ? 'limit' : ''}`}>
            {content.length}/300
          </div>
          
          <div className="post-actions">
            <div className="media-upload-btn">
              <label htmlFor="media-input">
                📁 Add Media
              </label>
              <input 
                id="media-input" 
                type="file" 
                accept="image/*,video/*" 
                onChange={handleFileChange} 
                hidden 
              />
            </div>
            
            {userProfile?.role === 'mentor' && (
              <label className="live-toggle">
                <input 
                  type="checkbox" 
                  checked={isLiveSession} 
                  onChange={(e) => setIsLiveSession(e.target.checked)} 
                />
                <span className="live-toggle-text">🔴 Start Room</span>
              </label>
            )}

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
              {isSubmitting ? 'Sharing...' : 'Share'}
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
          const isLoving = post.reactions?.loving?.includes(currentUser?.uid);

          return (
            <div key={post.id} className="post-card animate-slide-up">
              <div className="post-header">
                <div className="post-author-info">
                  <div className="post-avatar">
                    {getInitials(post.userName)}
                  </div>
                  <div>
                    <Link 
                      to={post.userRole === 'mentor' ? `/mentor/${post.userId}` : `/student/${post.userId}`} 
                      className="post-author-name"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {post.userName}
                      <span className={`role-badge ${post.userRole === 'mentor' ? 'mentor' : ''}`}>
                        {post.userRole}
                      </span>
                    </Link>
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

              {post.isLive && (
                <div className="live-banner animate-pulse">
                  <span className="live-dot"></span>
                  <span className="live-text">LIVE NOW</span>
                  <button 
                    className="join-live-btn"
                    onClick={() => {
                      setActiveLiveRoom({
                        id: post.liveRoomId,
                        name: post.userName
                      });
                      setShowVideo(true);
                    }}
                  >
                    Join Room
                  </button>
                </div>
              )}

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
                  className={`reaction-btn ${isLoving ? 'active' : ''}`}
                  onClick={() => handleReaction(post.id, 'loving', post.reactions)}
                >
                  ❤️ Love {(post.reactions?.loving?.length || 0) > 0 && <span>{post.reactions.loving.length}</span>}
                </button>
                <button 
                  className={`reaction-btn comment-trigger ${activeCommentPostId === post.id ? 'active' : ''}`}
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                >
                  💬 Discuss
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
            <h3>It's quiet here.</h3>
            <p>Start the conversation by sharing a thought or a question.</p>
          </div>
        )}

        {hasMore && posts.length > 0 && !loading && (
          <button className="load-more-btn" onClick={() => fetchPosts(true)}>
            Load more posts
          </button>
        )}
      </div>

      {showVideo && activeLiveRoom && (
        <VideoCall
          roomName={activeLiveRoom.id}
          participantName={currentUser?.displayName || currentUser?.email || 'User'}
          participantIdentity={currentUser?.uid || `user-${Date.now()}`}
          onSessionEnd={() => {
            setShowVideo(false);
            setActiveLiveRoom(null);
          }}
        />
      )}
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
        {loading && <p className="comment-loading">Loading discussion...</p>}
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
            placeholder="Add to the discussion..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
          />
          <button className="send-comment-btn" onClick={handleSendComment}>Post</button>
        </div>
      </div>
    </div>
  );
}
