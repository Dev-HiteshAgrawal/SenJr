import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../lib/firebase';
import { useNotification } from '../contexts/NotificationContext';
import './Community.css';

const PAGE_SIZE = 8;
const MAX_POST_LENGTH = 1000;
const MAX_MEDIA_COUNT = 6;
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const TOPICS = [
  { id: 'tip', label: 'Tip', icon: '💡', className: 'tip' },
  { id: 'question', label: 'Question', icon: '❓', className: 'question' },
  { id: 'resource', label: 'Resource', icon: '📚', className: 'resource' },
  { id: 'success', label: 'Success Story', icon: '🎉', className: 'success' },
  { id: 'motivation', label: 'Motivation', icon: '🔥', className: 'motivation' },
];

const EMOJI_SHORTCUTS = ['✨', '🔥', '🎯', '💡', '👏', '📚', '🚀', '❤️'];

function timeAgo(dateInput) {
  if (!dateInput) return 'just now';
  const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
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
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function safeFileName(name) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-');
}

function getMediaKind(file) {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  return null;
}

function validateFile(file) {
  const kind = getMediaKind(file);
  if (!kind) return 'Only image and video uploads are supported.';
  if (kind === 'image' && !IMAGE_TYPES.includes(file.type)) return 'Use JPG, PNG, WEBP, or GIF images.';
  if (kind === 'video' && !VIDEO_TYPES.includes(file.type)) return 'Use MP4, WEBM, or MOV videos.';
  if (file.size > MAX_FILE_SIZE) return 'Files must be under 100MB.';
  return null;
}

function compressImage(file) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return Promise.resolve(file);

  return new Promise((resolve) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      const maxSide = 1800;
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' }));
        },
        'image/webp',
        0.82
      );
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    image.src = url;
  });
}

function normalizeMedia(item) {
  return {
    url: item.url,
    type: item.type,
    path: item.path,
    name: item.name,
    width: item.width || null,
    height: item.height || null,
  };
}

export default function Community() {
  const { currentUser, userProfile } = useAuth();
  const { notifySuccess, notifyError, notifyInfo } = useNotification();

  const [content, setContent] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [mediaItems, setMediaItems] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [posts, setPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [stories, setStories] = useState([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [storyCaption, setStoryCaption] = useState('');
  const [seenStories, setSeenStories] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('senjr_seen_stories') || '[]');
    } catch {
      return [];
    }
  });

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const storyInputRef = useRef(null);
  const uploadTasksRef = useRef(new Map());
  const touchStartRef = useRef(null);
  const draftKey = `senjr_community_draft_${currentUser?.uid || 'guest'}`;

  const displayName = userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Student';
  const avatarUrl = userProfile?.photoURL || currentUser?.photoURL || '';
  const userRole = userProfile?.role || 'student';

  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem(draftKey) || 'null');
      if (draft) {
        setContent(draft.content || '');
        setSelectedTopic(TOPICS.find((topic) => topic.id === draft.topicId) || TOPICS[0]);
        setIsExpanded(Boolean(draft.content));
      }
    } catch {
      localStorage.removeItem(draftKey);
    }
  }, [draftKey]);

  useEffect(() => {
    const draft = {
      content,
      topicId: selectedTopic?.id || TOPICS[0].id,
      updatedAt: Date.now(),
    };
    localStorage.setItem(draftKey, JSON.stringify(draft));
  }, [content, draftKey, selectedTopic]);

  async function loadPosts({ append = false } = {}) {
    if (!currentUser) {
      setPosts([]);
      setLastVisible(null);
      setHasMore(false);
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    append ? setLoadingMore(true) : setLoading(true);
    try {
      const constraints = [orderBy('createdAt', 'desc'), limit(PAGE_SIZE)];
      if (activeFilter !== 'all') {
        constraints.unshift(where('topicId', '==', activeFilter));
      }
      if (append && lastVisible) {
        constraints.push(startAfter(lastVisible));
      }

      const snapshot = await getDocs(query(collection(db, 'feed'), ...constraints));
      const nextPosts = snapshot.docs.map((postDoc) => ({ id: postDoc.id, ...postDoc.data() }));
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
      setPosts((prev) => (append ? [...prev, ...nextPosts] : nextPosts));
    } catch (error) {
      console.error('Community feed load failed:', error);
      notifyError('Could not load the community feed.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    setLastVisible(null);
    setHasMore(true);
    loadPosts({ append: false });
  }, [activeFilter, currentUser]);

  useEffect(() => {
    async function loadStories() {
      if (!currentUser) {
        setStories([]);
        return;
      }

      try {
        const snapshot = await getDocs(
          query(
            collection(db, 'stories'),
            where('expiresAt', '>', new Date()),
            orderBy('expiresAt', 'desc'),
            limit(30)
          )
        );
        setStories(snapshot.docs.map((storyDoc) => ({ id: storyDoc.id, ...storyDoc.data() })));
      } catch (error) {
        console.error('Story load failed:', error);
      }
    }

    loadStories();
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('senjr_seen_stories', JSON.stringify(seenStories.slice(-100)));
  }, [seenStories]);

  useEffect(() => {
    const currentStory = activeStoryIndex === null ? null : stories[activeStoryIndex];
    if (!currentStory || seenStories.includes(currentStory.id)) return;

    setSeenStories((prev) => [...prev, currentStory.id]);
    updateDoc(doc(db, 'stories', currentStory.id), { viewCount: increment(1), view_count: increment(1) }).catch((error) => {
      console.warn('Could not mark story viewed:', error);
    });
  }, [activeStoryIndex, seenStories, stories]);

  async function uploadFile(file, folder, itemId, attempt = 1) {
    const validationError = validateFile(file);
    if (validationError) {
      throw new Error(validationError);
    }
    if (!currentUser) {
      throw new Error('Please log in to upload media.');
    }

    const preparedFile = await compressImage(file);
    const type = getMediaKind(preparedFile);
    const filePath = `${folder}/${currentUser.uid}/${Date.now()}-${safeFileName(preparedFile.name)}`;
    const storageRef = ref(storage, filePath);

    return new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, preparedFile, {
        contentType: preparedFile.type,
        customMetadata: {
          ownerId: currentUser.uid,
          originalName: file.name,
        },
      });

      uploadTasksRef.current.set(itemId, task);
      task.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setMediaItems((prev) =>
            prev.map((item) => (item.id === itemId ? { ...item, progress, status: 'uploading' } : item))
          );
        },
        async (error) => {
          uploadTasksRef.current.delete(itemId);
          if (attempt < 3 && error.code !== 'storage/canceled') {
            try {
              const retried = await uploadFile(file, folder, itemId, attempt + 1);
              resolve(retried);
            } catch (retryError) {
              reject(retryError);
            }
            return;
          }
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            uploadTasksRef.current.delete(itemId);
            resolve({
              url,
              path: filePath,
              type,
              name: file.name,
              size: preparedFile.size,
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  async function enqueueFiles(files) {
    if (!currentUser) {
      notifyInfo('Please log in to upload media.');
      return;
    }

    const incomingFiles = Array.from(files).slice(0, MAX_MEDIA_COUNT - mediaItems.length);
    if (incomingFiles.length === 0) return;

    const nextItems = incomingFiles.map((file) => {
      const validationError = validateFile(file);
      return {
        id: crypto.randomUUID(),
        file,
        name: file.name,
        type: getMediaKind(file),
        previewUrl: URL.createObjectURL(file),
        progress: validationError ? 0 : 1,
        status: validationError ? 'failed' : 'queued',
        error: validationError || '',
      };
    });

    setMediaItems((prev) => [...prev, ...nextItems]);

    for (const item of nextItems) {
      if (item.status === 'failed') {
        notifyError(item.error);
        continue;
      }

      try {
        const uploaded = await uploadFile(item.file, 'feed', item.id);
        setMediaItems((prev) =>
          prev.map((mediaItem) =>
            mediaItem.id === item.id
              ? { ...mediaItem, ...uploaded, progress: 100, status: 'ready' }
              : mediaItem
          )
        );
      } catch (error) {
        if (error.code === 'storage/canceled') {
          return;
        }
        console.error('Upload failed:', error);
        notifyError(error.message || 'Upload failed.');
        setMediaItems((prev) =>
          prev.map((mediaItem) =>
            mediaItem.id === item.id ? { ...mediaItem, status: 'failed', error: error.message || 'Upload failed' } : mediaItem
          )
        );
      }
    }
  }

  async function cancelMedia(item) {
    uploadTasksRef.current.get(item.id)?.cancel();
    uploadTasksRef.current.delete(item.id);
    if (item.path && item.status === 'ready') {
      deleteObject(ref(storage, item.path)).catch(() => {});
    }
    URL.revokeObjectURL(item.previewUrl);
    setMediaItems((prev) => prev.filter((mediaItem) => mediaItem.id !== item.id));
  }

  async function createStory(file) {
    if (!currentUser) {
      notifyInfo('Please log in to share a story.');
      return;
    }
    const itemId = crypto.randomUUID();
    try {
      notifyInfo('Uploading story...');
      const uploaded = await uploadFile(file, 'stories', itemId);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const storyDoc = {
        userId: currentUser.uid,
        user_id: currentUser.uid,
        userName: displayName,
        authorPhotoURL: avatarUrl,
        mediaUrl: uploaded.url,
        media_url: uploaded.url,
        mediaType: uploaded.type,
        media_type: uploaded.type,
        storagePath: uploaded.path,
        caption: storyCaption.trim(),
        createdAt: serverTimestamp(),
        created_at: serverTimestamp(),
        expiresAt,
        expires_at: expiresAt,
        viewCount: 0,
        view_count: 0,
      };
      const refDoc = await addDoc(collection(db, 'stories'), storyDoc);
      setStories((prev) => [{ id: refDoc.id, ...storyDoc, createdAt: new Date() }, ...prev]);
      setStoryCaption('');
      notifySuccess('Story shared for 24 hours.');
    } catch (error) {
      console.error('Story upload failed:', error);
      notifyError(error.message || 'Could not upload story.');
    }
  }

  async function createPost() {
    if (!currentUser) {
      notifyInfo('Please log in to share with the community.');
      return;
    }
    const readyMedia = mediaItems.filter((item) => item.status === 'ready');
    const stillUploading = mediaItems.some((item) => item.status === 'queued' || item.status === 'uploading');
    if (stillUploading) {
      notifyInfo('Please wait for uploads to finish.');
      return;
    }
    if (!content.trim() && readyMedia.length === 0) {
      notifyError('Write something or attach media first.');
      return;
    }

    const tempId = `optimistic-${Date.now()}`;
    const postData = {
      authorId: currentUser.uid,
      userId: currentUser.uid,
      user_id: currentUser.uid,
      userName: displayName,
      authorName: displayName,
      authorPhotoURL: avatarUrl,
      userRole,
      userCollege: userProfile?.college || '',
      content: content.trim(),
      topicId: selectedTopic.id,
      topicLabel: `${selectedTopic.icon} ${selectedTopic.label}`,
      topicClass: selectedTopic.className,
      media: readyMedia.map(normalizeMedia),
      mediaUrl: readyMedia[0]?.url || null,
      mediaType: readyMedia[0]?.type || null,
      reactions: { loving: [] },
      savedBy: [],
      shareCount: 0,
      commentCount: 0,
      createdAt: serverTimestamp(),
    };

    setIsSubmitting(true);
    setPosts((prev) => [{ id: tempId, ...postData, createdAt: new Date(), optimistic: true }, ...prev]);

    try {
      const postRef = await addDoc(collection(db, 'feed'), postData);
      setPosts((prev) => prev.map((post) => (post.id === tempId ? { ...post, id: postRef.id, optimistic: false } : post)));
      setContent('');
      setMediaItems([]);
      setSelectedTopic(TOPICS[0]);
      setIsExpanded(false);
      localStorage.removeItem(draftKey);
      notifySuccess('Your post is live.');
    } catch (error) {
      console.error('Post create failed:', error);
      setPosts((prev) => prev.filter((post) => post.id !== tempId));
      notifyError(error.message || 'Could not publish the post.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deletePost(post) {
    if (!currentUser || currentUser.uid !== post.userId) return;
    if (!window.confirm('Delete this post?')) return;
    try {
      await deleteDoc(doc(db, 'feed', post.id));
      await Promise.all((post.media || []).map((item) => (item.path ? deleteObject(ref(storage, item.path)).catch(() => {}) : null)));
      setPosts((prev) => prev.filter((item) => item.id !== post.id));
      notifySuccess('Post deleted.');
    } catch (error) {
      console.error('Delete failed:', error);
      notifyError('Could not delete the post.');
    }
  }

  async function toggleArrayField(postId, field, hasValue) {
    if (!currentUser) {
      notifyInfo('Please log in first.');
      return;
    }
    const value = currentUser.uid;
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const currentValues = field === 'reactions.loving' ? post.reactions?.loving || [] : post[field] || [];
        const nextValues = hasValue ? currentValues.filter((uid) => uid !== value) : [...currentValues, value];
        if (field === 'reactions.loving') {
          return { ...post, reactions: { ...(post.reactions || {}), loving: nextValues } };
        }
        return { ...post, [field]: nextValues };
      })
    );

    try {
      await updateDoc(doc(db, 'feed', postId), {
        [field]: hasValue ? arrayRemove(value) : arrayUnion(value),
      });
    } catch (error) {
      console.error('Feed reaction failed:', error);
      notifyError('Could not update that action.');
      loadPosts({ append: false });
    }
  }

  function sharePost(post) {
    const shareUrl = `${window.location.origin}/community?post=${post.id}`;
    navigator.clipboard?.writeText(shareUrl).then(
      () => notifySuccess('Post link copied.'),
      () => notifyInfo(shareUrl)
    );
    updateDoc(doc(db, 'feed', post.id), { shareCount: increment(1) }).catch(() => {});
  }

  function openStory(index) {
    setActiveStoryIndex(index);
  }

  function closeStory() {
    setActiveStoryIndex(null);
  }

  function showNextStory() {
    setActiveStoryIndex((index) => {
      if (index === null) return null;
      return index >= stories.length - 1 ? null : index + 1;
    });
  }

  function showPreviousStory() {
    setActiveStoryIndex((index) => {
      if (index === null) return null;
      return Math.max(0, index - 1);
    });
  }

  const trendingPosts = useMemo(
    () =>
      [...posts]
        .sort((a, b) => ((b.reactions?.loving?.length || 0) + (b.commentCount || 0)) - ((a.reactions?.loving?.length || 0) + (a.commentCount || 0)))
        .slice(0, 3),
    [posts]
  );

  const suggestedCreators = useMemo(() => {
    const map = new Map();
    posts.forEach((post) => {
      if (!map.has(post.userId)) {
        map.set(post.userId, post);
      }
    });
    return [...map.values()].slice(0, 4);
  }, [posts]);

  const activeStory = activeStoryIndex === null ? null : stories[activeStoryIndex];

  return (
    <main className="page-container community-shell animate-fade-in-up">
      <section className="community-hero">
        <div>
          <h1 className="page-title">Community</h1>
          <p className="page-subtitle">Share wins, questions, resources, and study momentum with Senjr learners.</p>
        </div>
      </section>

      <div className="community-layout">
        <div className="community-main">
          <section className="stories-bar" aria-label="Community stories">
            <button className="story-card story-create" type="button" onClick={() => storyInputRef.current?.click()}>
              <span className="story-plus">+</span>
              <span>Story</span>
            </button>
            <input
              ref={storyInputRef}
              type="file"
              accept="image/*,video/*"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) createStory(file);
                event.target.value = '';
              }}
            />
            {stories.map((story, index) => (
              <button
                key={story.id}
                className={`story-card ${seenStories.includes(story.id) ? 'seen' : 'unseen'}`}
                type="button"
                onClick={() => openStory(index)}
              >
                <span className="story-thumb">
                  {story.mediaType === 'video' ? (
                    <video src={story.mediaUrl} muted playsInline />
                  ) : (
                    <img src={story.mediaUrl} alt="" loading="lazy" />
                  )}
                </span>
                <span>{(story.userName || 'User').split(' ')[0]}</span>
              </button>
            ))}
          </section>

          <section
            className={`composer-card ${isDragging ? 'dragging' : ''}`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              enqueueFiles(event.dataTransfer.files);
            }}
          >
            <div className="composer-topline">
              <div className="composer-avatar">{avatarUrl ? <img src={avatarUrl} alt="" /> : getInitials(displayName)}</div>
              <button className="composer-faux-input" type="button" onClick={() => setIsExpanded(true)}>
                What's on your mind?
              </button>
            </div>

            {(isExpanded || content || mediaItems.length > 0) && (
              <div className="composer-body">
                <textarea
                  value={content}
                  maxLength={MAX_POST_LENGTH}
                  placeholder={`Share a question, win, or resource, ${displayName.split(' ')[0]}...`}
                  onChange={(event) => setContent(event.target.value)}
                  autoFocus
                />

                {mediaItems.length > 0 && (
                  <div className="composer-preview-grid">
                    {mediaItems.map((item) => (
                      <div key={item.id} className={`media-preview ${item.status}`}>
                        {item.type === 'video' ? (
                          <video src={item.previewUrl || item.url} controls muted playsInline />
                        ) : (
                          <img src={item.previewUrl || item.url} alt={item.name} />
                        )}
                        <button type="button" className="media-cancel" onClick={() => cancelMedia(item)}>
                          ×
                        </button>
                        {item.status !== 'ready' && (
                          <div className="media-progress">
                            <span style={{ width: `${item.progress || 0}%` }} />
                            <strong>{item.status === 'failed' ? item.error : `${item.progress || 0}%`}</strong>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="composer-tools">
                  <div className="topic-row" role="list" aria-label="Post topics">
                    {TOPICS.map((topic) => (
                      <button
                        type="button"
                        key={topic.id}
                        className={`topic-btn ${selectedTopic?.id === topic.id ? 'selected' : ''}`}
                        onClick={() => setSelectedTopic(topic)}
                      >
                        <span>{topic.icon}</span>
                        {topic.label}
                      </button>
                    ))}
                  </div>

                  <div className="composer-actions">
                    <button type="button" className="tool-btn" onClick={() => imageInputRef.current?.click()}>
                      🖼 Image
                    </button>
                    <button type="button" className="tool-btn" onClick={() => videoInputRef.current?.click()}>
                      🎬 Video
                    </button>
                    <button type="button" className="tool-btn" onClick={() => storyInputRef.current?.click()}>
                      ⚡ Story
                    </button>
                    <button type="button" className="tool-btn" onClick={() => setShowEmoji((value) => !value)}>
                      😊
                    </button>
                    <input ref={imageInputRef} type="file" accept="image/*" multiple hidden onChange={(event) => enqueueFiles(event.target.files)} />
                    <input ref={videoInputRef} type="file" accept="video/*" multiple hidden onChange={(event) => enqueueFiles(event.target.files)} />
                  </div>

                  {showEmoji && (
                    <div className="emoji-row">
                      {EMOJI_SHORTCUTS.map((emoji) => (
                        <button type="button" key={emoji} onClick={() => setContent((value) => `${value}${emoji}`)}>
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="composer-submit-row">
                    <span className={content.length > MAX_POST_LENGTH * 0.9 ? 'char-counter limit' : 'char-counter'}>
                      {content.length}/{MAX_POST_LENGTH}
                    </span>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setContent('');
                        setMediaItems([]);
                        setIsExpanded(false);
                        localStorage.removeItem(draftKey);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={isSubmitting || mediaItems.some((item) => item.status === 'queued' || item.status === 'uploading')}
                      onClick={createPost}
                    >
                      {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          <nav className="feed-tabs" aria-label="Community feed filters">
            <button className={activeFilter === 'all' ? 'active' : ''} type="button" onClick={() => setActiveFilter('all')}>
              All
            </button>
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                className={activeFilter === topic.id ? 'active' : ''}
                type="button"
                onClick={() => setActiveFilter(topic.id)}
              >
                {topic.icon} {topic.label}
              </button>
            ))}
          </nav>

          <section className="feed-list" aria-label="Community feed">
            {loading &&
              Array.from({ length: 3 }).map((_, index) => (
                <article className="post-card skeleton-post" key={index}>
                  <span />
                  <span />
                  <span />
                </article>
              ))}

            {!loading &&
              posts.map((post) => {
                const liked = post.reactions?.loving?.includes(currentUser?.uid);
                const saved = post.savedBy?.includes(currentUser?.uid);
                const media = post.media?.length ? post.media : post.mediaUrl ? [{ url: post.mediaUrl, type: post.mediaType }] : [];

                return (
                  <article className={`post-card ${post.optimistic ? 'optimistic' : ''}`} key={post.id}>
                    <header className="post-header">
                      <div className="post-author">
                        <div className="post-avatar">{post.authorPhotoURL ? <img src={post.authorPhotoURL} alt="" /> : getInitials(post.userName)}</div>
                        <div>
                          <Link to={post.userRole === 'mentor' ? `/mentor/${post.userId}` : `/student/${post.userId}`} className="post-author-name">
                            {post.userName || post.authorName || 'Student'}
                          </Link>
                          <p>{post.userRole || 'student'} · {timeAgo(post.createdAt)}</p>
                        </div>
                      </div>
                      {currentUser?.uid === post.userId && (
                        <button className="post-delete" type="button" onClick={() => deletePost(post)}>
                          Delete
                        </button>
                      )}
                    </header>

                    <span className={`topic-pill ${post.topicClass || ''}`}>{post.topicLabel || '💡 Tip'}</span>
                    {post.content && <p className="post-content">{post.content}</p>}

                    {media.length > 0 && (
                      <div className={`post-media-grid count-${Math.min(media.length, 4)}`}>
                        {media.slice(0, 4).map((item, index) => (
                          <div className="post-media" key={`${item.url}-${index}`}>
                            {item.type === 'video' ? (
                              <video src={item.url} controls playsInline preload="metadata" />
                            ) : (
                              <img src={item.url} alt="Post media" loading="lazy" onClick={() => window.open(item.url, '_blank')} />
                            )}
                            {index === 3 && media.length > 4 && <span className="media-more">+{media.length - 4}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    <footer className="post-actions-bar">
                      <button className={liked ? 'active' : ''} type="button" onClick={() => toggleArrayField(post.id, 'reactions.loving', liked)}>
                        ❤️ {post.reactions?.loving?.length || 0}
                      </button>
                      <button type="button" onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}>
                        💬 Discuss
                      </button>
                      <button className={saved ? 'active' : ''} type="button" onClick={() => toggleArrayField(post.id, 'savedBy', saved)}>
                        🔖 Save
                      </button>
                      <button type="button" onClick={() => sharePost(post)}>
                        ↗ Share
                      </button>
                    </footer>

                    {activeCommentPostId === post.id && <CommentSection postId={post.id} currentUser={currentUser} userProfile={userProfile} />}
                  </article>
                );
              })}

            {!loading && posts.length === 0 && (
              <section className="community-empty">
                <div>🌱</div>
                <h2>Start the first discussion</h2>
                <p>Ask a doubt, share a study resource, or post a small win.</p>
              </section>
            )}

            {!loading && hasMore && posts.length > 0 && (
              <button className="load-more-btn" type="button" disabled={loadingMore} onClick={() => loadPosts({ append: true })}>
                {loadingMore ? 'Loading...' : 'Load more posts'}
              </button>
            )}
          </section>
        </div>

        <aside className="community-sidebar">
          <section>
            <h2>Trending</h2>
            {trendingPosts.length === 0 ? (
              <p>No trends yet.</p>
            ) : (
              trendingPosts.map((post) => (
                <button key={post.id} type="button" onClick={() => setActiveCommentPostId(post.id)}>
                  <span>{post.topicLabel || 'Discussion'}</span>
                  <strong>{(post.content || 'Media post').slice(0, 72)}</strong>
                </button>
              ))
            )}
          </section>
          <section>
            <h2>Suggested creators</h2>
            {suggestedCreators.length === 0 ? (
              <p>Creators appear as the feed grows.</p>
            ) : (
              suggestedCreators.map((creator) => (
                <Link key={creator.userId} to={creator.userRole === 'mentor' ? `/mentor/${creator.userId}` : `/student/${creator.userId}`}>
                  <span>{getInitials(creator.userName)}</span>
                  {creator.userName}
                </Link>
              ))
            )}
          </section>
        </aside>
      </div>

      {activeStory && (
        <div
          className="story-viewer-overlay"
          onClick={closeStory}
          onTouchStart={(event) => {
            touchStartRef.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStartRef.current === null) return;
            const delta = event.changedTouches[0].clientX - touchStartRef.current;
            if (delta > 40) showPreviousStory();
            if (delta < -40) showNextStory();
            touchStartRef.current = null;
          }}
        >
          <div className="story-viewer" onClick={(event) => event.stopPropagation()}>
            <div className="story-progress-bar">
              <span key={activeStory.id} onAnimationEnd={showNextStory} />
            </div>
            <header>
              <div className="post-avatar">{activeStory.authorPhotoURL ? <img src={activeStory.authorPhotoURL} alt="" /> : getInitials(activeStory.userName)}</div>
              <div>
                <strong>{activeStory.userName}</strong>
                <p>{timeAgo(activeStory.createdAt)} · {activeStory.viewCount || 0} views</p>
              </div>
              <button type="button" onClick={closeStory}>×</button>
            </header>
            <button className="story-nav prev" type="button" onClick={showPreviousStory}>‹</button>
            <div className="story-media">
              {activeStory.mediaType === 'video' ? (
                <video src={activeStory.mediaUrl} autoPlay controls playsInline onEnded={showNextStory} />
              ) : (
                <img src={activeStory.mediaUrl} alt={activeStory.caption || 'Story'} />
              )}
            </div>
            <button className="story-nav next" type="button" onClick={showNextStory}>›</button>
            {activeStory.caption && <p className="story-caption">{activeStory.caption}</p>}
          </div>
        </div>
      )}
    </main>
  );
}

function CommentSection({ postId, currentUser, userProfile }) {
  const { notifyError, notifyInfo } = useNotification();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadComments() {
      try {
        const snapshot = await getDocs(query(collection(db, 'feed', postId, 'comments'), orderBy('createdAt', 'asc'), limit(50)));
        if (isMounted) {
          setComments(snapshot.docs.map((commentDoc) => ({ id: commentDoc.id, ...commentDoc.data() })));
        }
      } catch (error) {
        console.error('Comment load failed:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadComments();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  async function addComment() {
    if (!currentUser) {
      notifyInfo('Please log in to comment.');
      return;
    }
    if (!newComment.trim()) return;

    const comment = {
      userId: currentUser.uid,
      userName: userProfile?.displayName || currentUser.displayName || 'Student',
      userRole: userProfile?.role || 'student',
      content: newComment.trim(),
      likes: [],
      createdAt: serverTimestamp(),
    };

    setNewComment('');
    setComments((prev) => [...prev, { id: `local-${Date.now()}`, ...comment, createdAt: new Date() }]);

    try {
      await addDoc(collection(db, 'feed', postId, 'comments'), comment);
      await updateDoc(doc(db, 'feed', postId), { commentCount: increment(1) });
    } catch (error) {
      console.error('Comment failed:', error);
      notifyError('Could not post that comment.');
    }
  }

  async function toggleCommentLike(comment) {
    if (!currentUser) return;
    const liked = comment.likes?.includes(currentUser.uid);
    setComments((prev) =>
      prev.map((item) =>
        item.id === comment.id
          ? { ...item, likes: liked ? item.likes.filter((uid) => uid !== currentUser.uid) : [...(item.likes || []), currentUser.uid] }
          : item
      )
    );
    if (comment.id.startsWith('local-')) return;
    await updateDoc(doc(db, 'feed', postId, 'comments', comment.id), {
      likes: liked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
    }).catch(() => {});
  }

  return (
    <section className="comment-panel">
      {loading && <p>Loading discussion...</p>}
      {!loading &&
        comments.map((comment) => (
          <article className="comment-item" key={comment.id}>
            <div className="comment-avatar">{getInitials(comment.userName)}</div>
            <div>
              <strong>{comment.userName}</strong>
              <p>{comment.content}</p>
              <button type="button" onClick={() => toggleCommentLike(comment)}>
                ❤️ {comment.likes?.length || 0}
              </button>
            </div>
          </article>
        ))}
      <div className="comment-input-row">
        <input
          value={newComment}
          placeholder="Add to the discussion..."
          onChange={(event) => setNewComment(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') addComment();
          }}
        />
        <button type="button" onClick={addComment}>Post</button>
      </div>
    </section>
  );
}
