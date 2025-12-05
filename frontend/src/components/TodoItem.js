import React, { useState } from 'react';
import './TodoItem.css';
import ConfirmDialog from './ConfirmDialog';
import { FaEdit, FaTrash } from 'react-icons/fa';

function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggleComplete = async () => {
    console.log('☑️ 切換完成狀態:', { id: todo._id, title: todo.title, 新狀態: !todo.completed });
    await onUpdate(todo._id, { completed: !todo.completed });
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      console.warn('⚠️ 編輯標題為空');
      alert('標題不能為空');
      return;
    }

    console.log('儲存編輯:', { 
      id: todo._id, 
      原標題: todo.title, 
      新標題: editTitle.trim(),
      原描述: todo.description,
      新描述: editDescription.trim()
    });
    setIsUpdating(true);
    const result = await onUpdate(todo._id, {
      title: editTitle.trim(),
      description: editDescription.trim()
    });

    if (result.success) {
      console.log('✅ 編輯儲存成功');
      setIsEditing(false);
    } else {
      console.error('❌ 編輯儲存失敗:', result.error);
      alert(result.error || '更新失敗');
    }

    setIsUpdating(false);
  };

  const handleCancel = () => {
    console.log('❌ 取消編輯:', { id: todo._id, title: todo.title });
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    console.log('🗑️ 點擊刪除按鈕:', { id: todo._id, title: todo.title });
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    console.log('✅ 確認刪除:', { id: todo._id, title: todo.title });
    setShowDeleteConfirm(false);
    await onDelete(todo._id);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="刪除 Todo"
        message="確定要刪除這個 Todo 嗎？此操作無法復原。"
        confirmText="刪除"
        cancelText="取消"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
        {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-input"
            placeholder="標題"
            disabled={isUpdating}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="edit-textarea"
            placeholder="描述"
            rows="2"
            disabled={isUpdating}
          />
          <div className="edit-actions">
            <button
              onClick={handleSave}
              className="save-btn"
              disabled={isUpdating || !editTitle.trim()}
            >
              {isUpdating ? '儲存中...' : '儲存'}
            </button>
            <button
              onClick={handleCancel}
              className="cancel-btn"
              disabled={isUpdating}
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <div className="view-mode">
          <div className="todo-header">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={handleToggleComplete}
              />
              <span className="checkmark"></span>
            </label>
            <h3 className={`todo-title ${todo.completed ? 'strikethrough' : ''}`}>
              {todo.title}
            </h3>
          </div>

          {todo.description && (
            <p className={`todo-description ${todo.completed ? 'faded' : ''}`}>
              {todo.description}
            </p>
          )}

          <div className="todo-footer">
            <span className="todo-date">
              {formatDate(todo.createdAt)}
            </span>
            <div className="todo-actions">
              <button
                onClick={() => {
                  console.log('✏️ 開始編輯:', { id: todo._id, title: todo.title });
                  setIsEditing(true);
                }}
                className="edit-btn"
                title="編輯"
              >
                <FaEdit />
              </button>
              <button
                onClick={handleDeleteClick}
                className="delete-btn"
                title="刪除"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

export default TodoItem;


