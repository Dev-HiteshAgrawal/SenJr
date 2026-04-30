import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, limit, startAfter, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNotification } from '../contexts/NotificationContext';
import VideoCall from '../components/VideoCall';
import './Community.css';

const CLOUDINARY_CLOUD_NAME = 'dxyr3qvdd';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';

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
        console.error('Cloudinary upload failed:', xhr.responseText);
        notifyError("Failed to upload media. Please try again.");
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
        reactions: { helpful: [], inspiring: [], interesting: [], loving: [], writing: [] },
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
            
            {userProfile?.role === 'mentor' && (
              <label className="live-toggle">
                <input 
                  type="checkbox" 
                  checked={isLiveSession} 
                  onChange={(e) => setIsLiveSession(e.target.checked)} 
                />
                <span className="live-toggle-text">🔴 Go Live</span>
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
          const isLoving = post.reactions?.loving?.includes(currentUser?.uid);
          const isWriting = post.reactions?.writing?.includes(currentUser?.uid);

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
                    Join Session
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
                  📝 Note
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
