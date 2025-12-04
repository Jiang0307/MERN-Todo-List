import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './../App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import axios from 'axios';

// API Base URL - 統一配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/todos`;

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 登出
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  }, [navigate]);

  // 獲取所有 Todo
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTodos(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Token 無效，登出
        handleLogout();
        setError('登入已過期，請重新登入');
      } else {
        setError('無法載入 Todo 列表');
        console.error('❌ 獲取 Todo 失敗:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    // 檢查是否有 token
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // 設定 axios 預設 header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchTodos();
  }, [navigate, fetchTodos]);

  // 創建新 Todo
  const createTodo = async (todoData) => {
    try {
      const response = await axios.post(API_URL, todoData);
      setTodos([response.data, ...todos]);
      return { success: true };
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
        return { success: false, error: '登入已過期，請重新登入' };
      }
      return { success: false, error: err.response?.data?.error || '創建失敗' };
    }
  };

  // 更新 Todo
  const updateTodo = async (id, updates) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updates);
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
      return { success: true };
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
        return { success: false, error: '登入已過期，請重新登入' };
      }
      return { success: false, error: err.response?.data?.error || '更新失敗' };
    }
  };

  // 刪除 Todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
      return { success: true };
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
        return { success: false, error: '登入已過期，請重新登入' };
      }
      return { success: false, error: err.response?.data?.error || '刪除失敗' };
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h1>Welcome to MERN-Todo-List</h1>
            </div>
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              登出
            </button>
          </div>
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

export default TodoApp;

