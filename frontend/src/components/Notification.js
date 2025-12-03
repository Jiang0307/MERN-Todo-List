import React from 'react';
import './Notification.css';

function Notification({ isOpen, message, onConfirm, confirmText = '確定' }) {
  if (!isOpen) return null;

  return (
    <div className="notification-overlay" onClick={onConfirm}>
      <div className="notification-card" onClick={(e) => e.stopPropagation()}>
        <div className="notification-body">
          <p>{message}</p>
        </div>
        <div className="notification-footer">
          <button
            onClick={onConfirm}
            className="notification-btn"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notification;

