const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// 中間件
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// MongoDB 連接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB 連接成功'))
.catch((err) => console.error('❌ MongoDB 連接失敗:', err));

// User 模型
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

// Todo 模型（加入 userId）
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model('Todo', todoSchema);

// JWT 驗證中間件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: '需要登入' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token 無效或已過期' });
    req.userId = user.userId;
    next();
  });
};

// API 路由

// 根路徑 - 顯示 API 信息
app.get('/', (req, res) => {
  res.json({
    message: '🎉 Todo API 服務器運行中！',
    info: '這是後端 API 服務器，前端應用請訪問 http://localhost:3000',
    endpoints: {
      'POST /api/auth/register': '註冊',
      'POST /api/auth/login': '登入',
      'GET /api/todos': '獲取所有 Todo（需要登入）',
      'GET /api/todos/:id': '獲取單個 Todo（需要登入）',
      'POST /api/todos': '創建新 Todo（需要登入）',
      'PUT /api/todos/:id': '更新 Todo（需要登入）',
      'DELETE /api/todos/:id': '刪除 Todo（需要登入）'
    },
    frontend: 'http://localhost:3000'
  });
});

// 註冊
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: '請提供 email 和密碼' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: '請輸入有效的 email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      email: email.toLowerCase().trim(), 
      password: hashedPassword 
    });
    await user.save();
    res.json({ message: '註冊成功' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: '此 email 已被註冊' });
    }
    res.status(400).json({ error: '註冊失敗' });
  }
});

// 登入
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: '請提供 email 和密碼' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: '登入失敗' });
  }
});

// 獲取所有 Todo（需要登入）
app.get('/api/todos', authenticateToken, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 創建新 Todo（需要登入）
app.post('/api/todos', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: '標題不能為空' });
    }

    const todo = new Todo({
      title: title.trim(),
      description: description || '',
      userId: req.userId
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新 Todo（需要登入）
app.put('/api/todos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const todo = await Todo.findOne({ _id: id, userId: req.userId });
    if (!todo) {
      return res.status(404).json({ error: 'Todo 不存在' });
    }

    if (title !== undefined) todo.title = title.trim();
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 刪除 Todo（需要登入）
app.delete('/api/todos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, userId: req.userId });

    if (!todo) {
      return res.status(404).json({ error: 'Todo 不存在' });
    }

    res.json({ message: 'Todo 已刪除' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 獲取單個 Todo（需要登入）
app.get('/api/todos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, userId: req.userId });

    if (!todo) {
      return res.status(404).json({ error: 'Todo 不存在' });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

// 監聽所有網絡接口，讓同一網絡的設備可以訪問
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 服務器運行在 http://localhost:${PORT}`);
  console.log(`📱 同一網絡設備可訪問: http://你的IP地址:${PORT}`);
  console.log(`💡 提示: 在終端執行 'ipconfig' (Windows) 或 'ifconfig' (Mac/Linux) 查看你的 IP 地址`);
});

