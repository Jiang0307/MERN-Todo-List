import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Notification from './Notification';

// API Base URL - 統一配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
        email,
        password
      });

      if (isRegister) {
        setNotificationMessage('註冊成功！請登入');
        setShowNotification(true);
        setIsRegister(false);
        setPassword('');
      } else {
        // 登入成功，保存 token
        localStorage.setItem('token', response.data.token);
        // 設定 axios 預設 header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        // 導向到 Todo 頁面
        navigate('/todos');
      }
    } catch (err) {
      setError(err.response?.data?.error || '操作失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>MERN-Todo-List</h1>
        <h2>{isRegister ? '註冊' : '登入'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? '處理中...' : (isRegister ? '註冊' : '登入')}
          </button>
        </form>

        <p className="switch-mode">
          {isRegister ? '已有帳號？' : '還沒有帳號？'}
          <button 
            type="button" 
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setEmail('');
              setPassword('');
            }}
            className="link-button"
          >
            {isRegister ? '登入' : '註冊'}
          </button>
        </p>
      </div>
      
      <Notification
        isOpen={showNotification}
        message={notificationMessage}
        onConfirm={() => setShowNotification(false)}
      />
    </div>
  );
}

export default Login;

