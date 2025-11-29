import React, { useState, useEffect } from 'react';
import './App.css';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import axios from 'axios';

// API URL 配置：根據環境自動選擇
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 獲取所有 Todo
  const fetchTodos = async () => {
    try {
      setLoading(true);
      console.log('🔄 開始獲取 Todo 列表...');
      console.log('📡 API URL:', API_URL);
      const response = await axios.get(API_URL);
      console.log('✅ 獲取成功:', response.data);
      console.log('📊 Todo 數量:', response.data.length);
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError('無法載入 Todo 列表');
      console.error('❌ 獲取 Todo 失敗:', err);
      console.error('錯誤詳情:', err.response?.data || err.message);
    } finally {
      setLoading(false);
      console.log('⏹️ 載入完成');
    }
  };

  useEffect(() => {
    console.log('🚀 App 組件已載入');
    console.log('📡 API URL:', API_URL);
    console.log('🔧 開發模式:', process.env.NODE_ENV === 'development' ? '是' : '否');
    fetchTodos();
  }, []);

  useEffect(() => {
    console.log('📝 Todo 列表已更新，目前有', todos.length, '個 Todo');
    if (todos.length > 0) {
      console.log('📋 Todo 列表:', todos.map(t => ({ id: t._id, title: t.title, completed: t.completed })));
    }
  }, [todos]);

  // 創建新 Todo
  const createTodo = async (todoData) => {
    try {
      console.log('➕ 創建新 Todo:', todoData);
      const response = await axios.post(API_URL, todoData);
      console.log('✅ 創建成功:', response.data);
      setTodos([response.data, ...todos]);
      return { success: true };
    } catch (err) {
      console.error('❌ 創建 Todo 失敗:', err);
      console.error('錯誤詳情:', err.response?.data || err.message);
      return { success: false, error: err.response?.data?.error || '創建失敗' };
    }
  };

  // 更新 Todo
  const updateTodo = async (id, updates) => {
    try {
      console.log('✏️ 更新 Todo:', { id, updates });
      const response = await axios.put(`${API_URL}/${id}`, updates);
      console.log('✅ 更新成功:', response.data);
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
      return { success: true };
    } catch (err) {
      console.error('❌ 更新 Todo 失敗:', err);
      console.error('錯誤詳情:', err.response?.data || err.message);
      return { success: false, error: err.response?.data?.error || '更新失敗' };
    }
  };

  // 刪除 Todo
  const deleteTodo = async (id) => {
    try {
      console.log('🗑️ 刪除 Todo:', id);
      await axios.delete(`${API_URL}/${id}`);
      console.log('✅ 刪除成功');
      setTodos(todos.filter(todo => todo._id !== id));
      return { success: true };
    } catch (err) {
      console.error('❌ 刪除 Todo 失敗:', err);
      console.error('錯誤詳情:', err.response?.data || err.message);
      return { success: false, error: err.response?.data?.error || '刪除失敗' };
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1>📝 Todo 應用</h1>
          <p>使用 MERN Stack 建立的練習項目</p>
        </header>

        <TodoForm onCreateTodo={createTodo} />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">載入中...</div>
        ) : (
          <TodoList
            todos={todos}
            onUpdateTodo={updateTodo}
            onDeleteTodo={deleteTodo}
          />
        )}
      </div>
    </div>
  );
}

export default App;

