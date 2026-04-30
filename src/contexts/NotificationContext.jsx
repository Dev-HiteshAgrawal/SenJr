import { createContext, useContext, useState, useCallback } from 'react';
import './Notification.css';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

const ERROR_MESSAGES = [
  "Error 6769: Even Albert Einstein Made MISTAKES! 😅",
  "Error 6769: Oops... Even Albert Einstein Made MISTAKES! 🛸",
  "Error 6769: The server sneezed. Even Albert Einstein Made MISTAKES! 🤧",
  "Error 6769: Something went wonky... Even Albert Einstein Made MISTAKES! 🧪"
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, message) => {
    const id = Date.now();
    
    // Easter egg error handling
    let finalMessage = message;
    if (type === 'error') {
      const einsteinMsg = ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];
      finalMessage = `${einsteinMsg} (Details: ${message})`;
    }

    setNotifications((prev) => [...prev, { id, type, message: finalMessage }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const notifySuccess = (msg) => addNotification('success', msg);
  const notifyError = (msg) => addNotification('error', msg); // Automatically uses Einstein error
  const notifyInfo = (msg) => addNotification('info', msg);

  return (
    <NotificationContext.Provider value={{ notifySuccess, notifyError, notifyInfo }}>
      {children}
      <div className="notification-container">
        {notifications.map(note => (
          <div key={note.id} className={`notification-toast ${note.type} animate-slide-in-right`}>
            <span className="notification-icon">
              {note.type === 'success' ? '✅' : note.type === 'error' ? '⚠️' : 'ℹ️'}
            </span>
            <p className="notification-text">{note.message}</p>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
