import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageCircle, MoreVertical } from 'lucide-react';

const VideoCall = () => {
  const navigate = useNavigate();
  const { roomName } = useParams();

  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const localVideoRef = useRef(null);
  const timerRef = useRef(null);

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

  const endCall = () => {
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    navigate('/sessions');
  };

  return (
    <div className="fixed inset-0 bg-[#0B1527] font-sans flex flex-col">

      {/* Remote Video (full screen bg) */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#0B1527]">
        {connected ? (
          <div className="w-full h-full bg-gradient-to-br from-[#0B1527] to-[#1a2a4a] flex items-center justify-center">
            {/* Placeholder for remote video — replace with LiveKit <VideoTrack /> */}
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-[#1E3A5F] flex items-center justify-center mb-4 mx-auto">
                <span className="text-4xl font-black text-white">R</span>
              </div>
              <p className="text-white font-bold text-lg">Rahul Sharma</p>
              <p className="text-blue-300 text-sm mt-1">Connected ✓</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-medium">Connecting to session...</p>
            <p className="text-gray-400 text-sm mt-1">Room: {roomName}</p>
          </div>
        )}
      </div>

      {/* Session Info Overlay — Top */}
      {connected && (
        <div className="relative z-10 flex items-center justify-between px-4 pt-safe pt-10">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2">
            <p className="text-white font-bold text-sm">UP Police Prep Session</p>
            <p className="text-green-400 text-xs font-medium">🔴 Live • {formatTime(elapsed)}</p>
          </div>
          <button className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* Local Video PiP — Bottom Right */}
      <div className="absolute bottom-28 right-4 z-20 w-28 h-40 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg bg-gray-900">
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
            <span className="text-3xl font-black text-white">H</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <span className="text-[9px] text-white font-bold bg-black/50 px-1.5 py-0.5 rounded">You</span>
        </div>
      </div>

      {/* Participants count */}
      {connected && (
        <div className="absolute top-safe top-10 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
            <Users className="w-3 h-3 text-white" />
            <span className="text-xs text-white font-medium">2 participants</span>
          </div>
        </div>
      )}

      {/* Control Bar — Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-8 pt-4 px-8 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-around">

          {/* Mute */}
          <button
            onClick={() => setMuted(!muted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              muted ? 'bg-red-500' : 'bg-white/20 backdrop-blur-sm'
            }`}
          >
            {muted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>

          {/* End Call */}
          <button
            onClick={endCall}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-xl active:bg-red-600 transition-colors"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>

          {/* Camera */}
          <button
            onClick={() => setCameraOff(!cameraOff)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              cameraOff ? 'bg-red-500' : 'bg-white/20 backdrop-blur-sm'
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
