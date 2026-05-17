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
      await updateDoc(postRef, {
        likes: increment(userLiked ? -1 : 1)
      });
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const toggleSave = async (postId) => {
    if (!user) return alert('Please login to save posts');
    console.log('Save toggled for', postId);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">

      {/* Header */}
      <header className="bg-white px-5 py-4 sticky top-0 z-50 border-b border-gray-100 shadow-sm rounded-b-3xl">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900 flex-1">Community</h1>
          <button className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center shadow-md shadow-primary-500/20 active:scale-95 transition-all">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      <main className="pb-4">
        
        {/* Trending Tags */}
        <div className="px-5 pt-6 pb-2">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Trending</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar">
            {trending.map((tag) => (
              <button
                key={tag}
                className="shrink-0 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Create Post */}
        <div className="px-5 py-3">
          <div className="bg-white border border-gray-100 rounded-3xl px-5 py-4 flex items-center gap-4 shadow-sm hover:border-primary-100 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-lg font-bold text-primary-600 border-2 border-white shadow-sm shrink-0">
              {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 text-left text-sm text-gray-400 font-medium">
              Share something with the community...
            </div>
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors shrink-0 border border-primary-100">
              <Plus className="w-5 h-5 text-primary-500" />
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="px-5 space-y-4 mt-2">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600 text-sm font-bold shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Failed to load posts: {error}</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center text-primary-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="font-bold text-sm">Loading community posts...</p>
            </div>
          )}

          {!loading && !error && posts.map((post) => (
            <div key={post.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              
              {/* Post Header */}
              <div className="px-5 pt-5 pb-3 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                  <img src={post.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author || 'U')}&background=random`} alt={post.author} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-base text-gray-900">{post.author || 'Anonymous'}</span>
                    {post.role && (
                      <span
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white uppercase tracking-wider"
                        style={{ backgroundColor: post.role === 'mentor' ? '#f97316' : '#10b981' }}
                      >
                        {post.role}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-gray-400">
                    {post.createdAt ? new Date(post.createdAt?.toDate?.() || post.createdAt).toLocaleString() : 'Just now'}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-2 -mr-2 rounded-full hover:bg-gray-50 transition-colors">•••</button>
              </div>

              {/* Post Content */}
              <div className="px-5 pb-4">
                <p className="text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-line">{post.content}</p>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="px-5 pb-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-[11px] font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-gray-100 mx-5"></div>

              {/* Actions */}
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => toggleLike(post.id, post.likes || 0, false)} 
                    className="flex items-center gap-2 active:scale-90 transition-transform group"
                  >
                    <Heart
                      className="w-5 h-5 group-hover:text-red-500 transition-colors"
                      fill={'none'} 
                      stroke={'#9CA3AF'}
                    />
                    <span className={`text-sm font-bold text-gray-500 group-hover:text-red-500 transition-colors`}>
                      {post.likes || 0}
                    </span>
                  </button>

                  <button className="flex items-center gap-2 active:scale-90 transition-transform group">
                    <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    <span className="text-sm font-bold text-gray-500 group-hover:text-primary-500 transition-colors">{post.comments || 0}</span>
                  </button>

                  <button className="flex items-center gap-2 active:scale-90 transition-transform group">
                    <Share2 className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    <span className="text-sm font-bold text-gray-500 group-hover:text-primary-500 transition-colors">{post.shares || 0}</span>
                  </button>
                </div>

                <button
                  onClick={() => toggleSave(post.id)}
                  className="active:scale-90 transition-transform hover:bg-gray-50 p-2 -mr-2 rounded-full"
                >
                  <BookmarkPlus
                    className="w-5 h-5 text-gray-400"
                    fill={'none'}
                  />
                </button>
              </div>
            </div>
          ))}

          {!loading && !error && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm px-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
                <MessageCircle className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-xl font-bold text-gray-900 mb-2">No posts yet</p>
              <p className="text-sm font-medium text-gray-500">Be the first to share something with the community!</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Community;
