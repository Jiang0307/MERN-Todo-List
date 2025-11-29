const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 中間件
app.use(cors());
app.use(express.json());

// MongoDB 連接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB 連接成功'))
.catch((err) => console.error('❌ MongoDB 連接失敗:', err));

// Todo 模型
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model('Todo', todoSchema);

// API 路由

// 根路徑 - 顯示 API 信息
app.get('/', (req, res) => {
  res.json({
    message: '🎉 Todo API 服務器運行中！',
    info: '這是後端 API 服務器，前端應用請訪問 http://localhost:3000',
    endpoints: {
      'GET /api/todos': '獲取所有 Todo',
      'GET /api/todos/:id': '獲取單個 Todo',
      'POST /api/todos': '創建新 Todo',
      'PUT /api/todos/:id': '更新 Todo',
      'DELETE /api/todos/:id': '刪除 Todo'
    },
    frontend: 'http://localhost:3000'
  });
});

// 獲取所有 Todo
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 創建新 Todo
app.post('/api/todos', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: '標題不能為空' });
    }

    const todo = new Todo({
      title: title.trim(),
      description: description || ''
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新 Todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;

    const todo = await Todo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ error: 'Todo 不存在' });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 刪除 Todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo 不存在' });
    }

    res.json({ message: 'Todo 已刪除', todo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 獲取單個 Todo
app.get('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);

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

