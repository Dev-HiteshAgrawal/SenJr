import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageCircle, MoreVertical } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuthContext } from '../../context/AuthContext';
import { awardXP, XP_REWARDS } from '../../utils/gamification';

const VideoCall = () => {
  const navigate = useNavigate();
  const { roomName } = useParams(); // Using roomName as sessionId for this prototype
  const { user, userData } = useAuthContext();

  const [sessionData, setSessionData] = useState(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const localVideoRef = useRef(null);
  const timerRef = useRef(null);

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const snap = await getDoc(doc(db, 'sessions', roomName));
        if (snap.exists()) {
          setSessionData(snap.data());
        }
      } catch (err) {
        console.error('Failed to fetch session', err);
      }
    };
    fetchSession();
  }, [roomName]);

  // Simulate connection and get camera preview
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 2000);

    // Request camera access for local preview
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(console.warn);

    return () => {
      clearTimeout(connectTimer);
      // Cleanup camera stream
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Session timer
  useEffect(() => {
    if (connected) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [connected]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const endCall = async () => {
    // Cleanup media
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }

    try {
      if (sessionData && sessionData.status !== 'completed') {
        // Mark session as completed
        await updateDoc(doc(db, 'sessions', roomName), {
          status: 'completed',
          completedAt: new Date().toISOString(),
          durationPlayed: elapsed,
        });

        // Award XP to student if current user is the student
        if (userData?.role === 'student') {
          await awardXP(user.uid, XP_REWARDS.SESSION_COMPLETED, 'Completed a mentoring session');
        }
        
        // Note: For mentors, you could track total sessions completed or add earnings to their totalEarnings here
      }
    } catch (err) {
      console.error('Error completing session', err);
    }

    navigate('/sessions');
  };

  const getOtherParticipantName = () => {
    if (!sessionData || !userData) return 'Participant';
    if (userData.role === 'mentor') return sessionData.studentName || 'Student';
    return sessionData.mentorName || 'Mentor';
  };

  return (
    <div className="fixed inset-0 bg-gray-950 font-sans flex flex-col">

      {/* Remote Video (full screen bg) */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
        {connected ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center">
            {/* Placeholder for remote video — replace with LiveKit <VideoTrack /> */}
            <div className="text-center">
              <div className="w-28 h-28 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center mb-5 mx-auto shadow-2xl">
                <span className="text-5xl font-black text-white">{getOtherParticipantName()[0]?.toUpperCase() || 'U'}</span>
              </div>
              <p className="text-white font-extrabold text-xl mb-1">{getOtherParticipantName()}</p>
              <div className="flex items-center justify-center gap-2 bg-primary-500/20 px-4 py-1.5 rounded-full mx-auto w-max">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                <p className="text-primary-400 text-sm font-bold">Connected</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-white font-bold text-lg mb-1">Connecting to session...</p>
            <p className="text-gray-500 text-sm font-medium">Room: {roomName}</p>
          </div>
        )}
      </div>

      {/* Session Info Overlay — Top */}
      {connected && (
        <div className="relative z-10 flex items-center justify-between px-5 pt-12">
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/10">
            <p className="text-white font-bold text-sm truncate max-w-[200px]">{sessionData?.subject || 'Session'}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-gray-300 text-xs font-bold">Live · {formatTime(elapsed)}</p>
            </div>
          </div>
          <button className="w-12 h-12 bg-black/50 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 active:scale-95 transition-transform">
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* Participants count */}
      {connected && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black/50 backdrop-blur-xl rounded-full px-4 py-2 flex items-center gap-2 border border-white/10">
            <Users className="w-3.5 h-3.5 text-white" />
            <span className="text-xs text-white font-bold">2 participants</span>
          </div>
        </div>
      )}

      {/* Local Video PiP — Bottom Right */}
      <div className="absolute bottom-32 right-5 z-20 w-32 h-44 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-gray-900">
        {!cameraOff ? (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <span className="text-4xl font-black text-white">{userData?.displayName?.[0]?.toUpperCase() || 'Y'}</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] text-white font-bold bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">You</span>
        </div>
      </div>

      {/* Control Bar — Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-10 pt-6 px-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="flex items-center justify-center gap-6">

          {/* Mute */}
          <button
            onClick={() => setMuted(!muted)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              muted ? 'bg-red-500 shadow-lg shadow-red-500/30' : 'bg-white/15 backdrop-blur-xl border border-white/20 hover:bg-white/25'
            }`}
          >
            {muted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>

          {/* End Call */}
          <button
            onClick={endCall}
            className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40 active:bg-red-600 active:scale-90 transition-all border-4 border-red-400/30"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>

          {/* Camera */}
          <button
            onClick={() => setCameraOff(!cameraOff)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              cameraOff ? 'bg-red-500 shadow-lg shadow-red-500/30' : 'bg-white/15 backdrop-blur-xl border border-white/20 hover:bg-white/25'
            }`}
          >
            {cameraOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
          </button>

        </div>
      </div>

    </div>
  );
};

export default VideoCall;
