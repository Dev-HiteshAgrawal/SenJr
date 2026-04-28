import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function UnreadBadge({ chatId, userId }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!chatId || !userId) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    // Only query for unread messages to keep the snapshot small
    const q = query(messagesRef, where('read', '==', false));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let unreadCount = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        // Count if the sender is not the current user
        if (data.senderId !== userId) {
          unreadCount++;
        }
      });
      setCount(unreadCount);
    });

    return () => unsubscribe();
  }, [chatId, userId]);

  if (count === 0) return null;

  return (
    <span style={{
      background: '#ff4d4d',
      color: '#fff',
      borderRadius: '9999px',
      padding: '2px 8px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      marginLeft: '0.5rem',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '20px'
    }}>
      {count > 99 ? '99+' : count}
    </span>
  );
}
