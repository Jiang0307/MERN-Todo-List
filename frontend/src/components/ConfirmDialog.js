import React from 'react';
import './ConfirmDialog.css';

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = '確認', cancelText = '取消' }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog-header">
          <h3>{title || '確認操作'}</h3>
        </div>
        <div className="confirm-dialog-body">
          <p>{message || '確定要執行此操作嗎？'}</p>
        </div>
        <div className="confirm-dialog-footer">
          <button
            onClick={onCancel}
            className="confirm-dialog-btn cancel-btn"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="confirm-dialog-btn confirm-btn"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;



