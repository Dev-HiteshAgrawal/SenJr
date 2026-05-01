import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { buildStudyScore } from '../lib/studentOS';
import './StudentProfile.css';

export default function StudentProfile() {
  const { id } = useParams();
  const { currentUser, userProfile } = useAuth();
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendStatus, setFriendStatus] = useState('none'); // none, pending, friends

  useEffect(() => {
    if (id === currentUser?.uid) {
      navigate('/profile', { replace: true });
      return;
    }

    async function fetchProfile() {
      try {
        const userDoc = await getDoc(doc(db, 'users', id));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.role === 'mentor') {
            navigate(`/mentor/${id}`, { replace: true });
            return;
          }
          setProfile(data);
          
          // Determine friend status
          if (data.friends?.includes(currentUser?.uid)) {
            setFriendStatus('friends');
          } else if (data.friendRequests?.includes(currentUser?.uid)) {
            setFriendStatus('pending');
          } else {
            setFriendStatus('none');
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [id, currentUser, navigate]);

  const handleFriendAction = async () => {
    if (!currentUser) {
      notifyInfo("Please login to connect with students!");
      return;
    }

    try {
      const userRef = doc(db, 'users', id);
      
      if (friendStatus === 'none') {
        await updateDoc(userRef, {
          friendRequests: arrayUnion(currentUser.uid)
        });
        await updateDoc(doc(db, 'users', currentUser.uid), {
          outgoingFriendRequests: arrayUnion(id)
        });
        setFriendStatus('pending');
        notifySuccess(`Friend request sent to ${profile.displayName || 'Student'}!`);
      } else if (friendStatus === 'pending') {
        await updateDoc(userRef, {
          friendRequests: arrayRemove(currentUser.uid)
        });
        await updateDoc(doc(db, 'users', currentUser.uid), {
          outgoingFriendRequests: arrayRemove(id)
        });
        setFriendStatus('none');
        notifyInfo("Friend request cancelled.");
      } else if (friendStatus === 'friends') {
        if (window.confirm("Remove this friend?")) {
          await updateDoc(userRef, {
            friends: arrayRemove(currentUser.uid)
          });
          await updateDoc(doc(db, 'users', currentUser.uid), {
            friends: arrayRemove(id)
          });
          setFriendStatus('none');
          notifySuccess("Removed from friends.");
        }
      }
    } catch (error) {
      console.error("Friend action error:", error);
      notifyError("Failed to update friend status. Try again.");
    }
  };

  if (loading) return <div className="loading-state">Fetching details...</div>;
  if (!profile) return <div className="loading-state">We couldn't find this student.</div>;
  const score = buildStudyScore(profile);

  return (
    <div className="student-profile-container animate-fade-in">
      <div className="student-profile-card card">
        <div className="student-avatar-large">
          {profile.displayName?.charAt(0) || 'S'}
        </div>
        <h1 className="student-name">{profile.displayName || 'Student'}</h1>
        <p className="student-college">{profile.college || 'No college listed'}</p>

        <div className="friend-action-container">
          <button 
            className={`btn-primary friend-btn ${friendStatus}`}
            onClick={handleFriendAction}
          >
            {friendStatus === 'friends' ? '👥 Connected' : 
             friendStatus === 'pending' ? '⏳ Pending' : 
             '➕ Connect'}
          </button>
          
          {friendStatus === 'friends' && (
            <button 
              className="btn-secondary message-btn"
              onClick={() => {
                const chatId = [currentUser.uid, id].sort().join('_');
                navigate(`/chat/${chatId}`);
              }}
            >
              💬 Message
            </button>
          )}
        </div>

        <div className="student-stats">
          <div className="stat-box">
            <h3>{profile.badges?.length || 0}</h3>
            <p>Badges</p>
          </div>
          <div className="stat-box">
            <h3>{profile.friends?.length || 0}</h3>
            <p>Connections</p>
          </div>
          <div className="stat-box">
            <h3>{score.studyScore}</h3>
            <p>Study score</p>
          </div>
        </div>
      </div>
    </div>
  );
}
