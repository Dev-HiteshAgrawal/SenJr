import React, { useState, useMemo } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, BookmarkPlus, Plus, Flame, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery';
import { useAuthContext } from '../../context/AuthContext';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase/config';

const trending = ['#UPPolice2025', '#SSCPrep', '#CAT25', '#BankingExam', '#Motivation'];

const Community = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  // Realtime listener for posts
  const queryOptions = useMemo(() => ({ sort: ['createdAt', 'desc'], realtime: true, limitCount: 50 }), []);
  const { data: posts, loading, error } = useFirestoreQuery('posts', queryOptions);

  const toggleLike = async (postId, currentLikes, userLiked) => {
    if (!user) return alert('Please login to like posts');
    try {
      const postRef = doc(db, 'posts', postId);
      // In a real prod app, we'd also maintain a 'likes' subcollection to track WHO liked it
      // For now, atomic increment/decrement
      await updateDoc(postRef, {
        likes: increment(userLiked ? -1 : 1)
      });
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const toggleSave = async (postId) => {
    if (!user) return alert('Please login to save posts');
    // Implement bookmarking logic (usually saving postId to user's savedPosts array)
    console.log('Save toggled for', postId);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 pb-24">

      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1">Community</h1>
          <button className="w-9 h-9 bg-[#10b981] rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      <main className="pb-4">
        
        {/* Trending Tags */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-[#f97316]" />
            <span className="text-xs font-bold text-gray-800">Trending</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
            {trending.map((tag) => (
              <button
                key={tag}
                className="shrink-0 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 active:bg-gray-50"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Create Post */}
        <div className="px-4 py-3">
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-[#ECFDF5] flex items-center justify-center text-sm font-bold text-[#10b981]">
              {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
            </div>
            <button className="flex-1 text-left text-sm text-gray-400 font-medium">
              Share something with the community...
            </button>
            <div className="w-9 h-9 bg-[#10b981] rounded-xl flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="px-4 space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-600 text-sm font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Failed to load posts: {error}</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center text-[#10b981]">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="font-bold text-sm">Loading community posts...</p>
            </div>
          )}

          {!loading && !error && posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              
              {/* Post Header */}
              <div className="px-4 pt-4 pb-3 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-200">
                  <img src={post.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author || 'U')}&background=random`} alt={post.author} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-sm text-gray-900">{post.author || 'Anonymous'}</span>
                    {post.role && (
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: post.role === 'mentor' ? '#f97316' : '#10b981' }}
                      >
                        {post.role}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {post.createdAt ? new Date(post.createdAt?.toDate?.() || post.createdAt).toLocaleString() : 'Just now'}
                  </span>
                </div>
                <button className="text-gray-400 p-1">•••</button>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{post.content}</p>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-bold text-[#10b981] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-gray-100 mx-4"></div>

              {/* Actions */}
              <div className="px-4 py-3 flex items-center gap-5">
                <button
                  onClick={() => toggleLike(post.id, post.likes || 0, false)} // false for now until we track user likes
                  className="flex items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Heart
                    className="w-4 h-4"
                    fill={'none'} // Update this when like tracking is built
                    stroke={'#9CA3AF'}
                  />
                  <span className={`text-xs font-bold text-gray-500`}>
                    {post.likes || 0}
                  </span>
                </button>

                <button className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-500">{post.comments || 0}</span>
                </button>

                <button className="flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-500">{post.shares || 0}</span>
                </button>

                <button
                  onClick={() => toggleSave(post.id)}
                  className="ml-auto active:scale-95 transition-transform"
                >
                  <BookmarkPlus
                    className="w-4 h-4"
                    fill={'none'}
                    stroke={'#9CA3AF'}
                  />
                </button>
              </div>
            </div>
          ))}

          {!loading && !error && posts.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-gray-300" />
              </div>
              <p className="font-bold text-gray-800">No posts yet</p>
              <p className="text-sm text-gray-500 mt-1">Be the first to share something!</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Community;
