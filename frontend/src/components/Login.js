import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const response = await axios.post(`http://localhost:5000${endpoint}`, {
        email,
        password
      });

      if (isRegister) {
        alert('註冊成功！請登入');
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
        <h1>📝 Todo 應用</h1>
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
            }}
            className="link-button"
          >
            {isRegister ? '登入' : '註冊'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;

