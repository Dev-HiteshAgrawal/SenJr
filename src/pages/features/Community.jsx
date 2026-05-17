import React, { useState } from 'react';
import { ArrowLeft, Users, Heart, MessageCircle, Share2, BookmarkPlus, Plus, TrendingUp, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const posts = [
  {
    id: 1,
    author: 'Rahul Sharma',
    authorAvatar: 'https://i.pravatar.cc/100?img=11',
    role: 'Mentor',
    roleColor: '#f97316',
    time: '2 min ago',
    content: 'Just cleared my 45th session this week! 🎉 If you\'re preparing for UP Police, the key is consistency. Practice 20 GK questions daily. Drop your doubts below 👇',
    likes: 48,
    comments: 12,
    shares: 6,
    tags: ['UP Police', 'GK', 'Motivation'],
    liked: false,
    saved: false,
  },
  {
    id: 2,
    author: 'Hitesh Agrawal',
    authorAvatar: 'https://i.pravatar.cc/100?img=11',
    role: 'Student',
    roleColor: '#10b981',
    time: '1 hr ago',
    content: 'Got my first session with Rahul Sir today ✅ He explained Calculus in such a simple way. Highly recommend for anyone stuck with Maths! 🔥\n\n#Senjr #PeerLearning',
    likes: 34,
    comments: 8,
    shares: 3,
    tags: ['Review', 'Maths'],
    liked: true,
    saved: false,
  },
  {
    id: 3,
    author: 'Priya Verma',
    authorAvatar: 'https://i.pravatar.cc/100?img=47',
    role: 'Mentor',
    roleColor: '#f97316',
    time: '3 hrs ago',
    content: '📌 FREE RESOURCE: My complete SSC CGL vocabulary sheet (1000 words) is now available. Comment "SSC" below and I\'ll DM it to you!',
    likes: 127,
    comments: 89,
    shares: 45,
    tags: ['SSC CGL', 'Free Resource', 'English'],
    liked: false,
    saved: true,
  },
];

const trending = ['#UPPolice2025', '#SSCPrep', '#CAT25', '#BankingExam', '#Motivation'];

const Community = () => {
  const navigate = useNavigate();
  const [postsState, setPostsState] = useState(posts);

  const toggleLike = (id) => {
    setPostsState(prev => prev.map(p =>
      p.id === id
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const toggleSave = (id) => {
    setPostsState(prev => prev.map(p =>
      p.id === id ? { ...p, saved: !p.saved } : p
    ));
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
            <div className="w-9 h-9 rounded-full bg-[#ECFDF5] flex items-center justify-center text-sm font-bold text-[#10b981]">H</div>
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
          {postsState.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              
              {/* Post Header */}
              <div className="px-4 pt-4 pb-3 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-sm text-gray-900">{post.author}</span>
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: post.roleColor }}
                    >
                      {post.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">{post.time}</span>
                </div>
                <button className="text-gray-400 p-1">•••</button>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{post.content}</p>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
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
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Heart
                    className="w-4 h-4"
                    fill={post.liked ? '#ef4444' : 'none'}
                    stroke={post.liked ? '#ef4444' : '#9CA3AF'}
                  />
                  <span className={`text-xs font-bold ${post.liked ? 'text-red-500' : 'text-gray-500'}`}>
                    {post.likes}
                  </span>
                </button>

                <button className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-500">{post.comments}</span>
                </button>

                <button className="flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-500">{post.shares}</span>
                </button>

                <button
                  onClick={() => toggleSave(post.id)}
                  className="ml-auto active:scale-95 transition-transform"
                >
                  <BookmarkPlus
                    className="w-4 h-4"
                    fill={post.saved ? '#10b981' : 'none'}
                    stroke={post.saved ? '#10b981' : '#9CA3AF'}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Community;
