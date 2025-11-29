import React, { useState } from 'react';
import './TodoForm.css';

function TodoForm({ onCreateTodo }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      console.warn('⚠️ 標題為空，無法提交');
      alert('請輸入標題');
      return;
    }

    console.log('📤 提交表單:', { title: title.trim(), description: description.trim() });
    setIsSubmitting(true);
    const result = await onCreateTodo({
      title: title.trim(),
      description: description.trim()
    });

    if (result.success) {
      console.log('✅ Todo 創建成功，清空表單');
      setTitle('');
      setDescription('');
    } else {
      console.error('❌ Todo 創建失敗:', result.error);
      alert(result.error || '創建失敗');
    }

    setIsSubmitting(false);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">標題 *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="輸入 Todo 標題..."
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">描述</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="輸入 Todo 描述（選填）..."
          rows="3"
          disabled={isSubmitting}
        />
      </div>

      <button 
        type="submit" 
        className="submit-btn"
        disabled={isSubmitting || !title.trim()}
      >
        {isSubmitting ? '創建中...' : '➕ 新增 Todo'}
      </button>
    </form>
  );
}

export default TodoForm;




