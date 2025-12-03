import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import TodoApp from './components/TodoApp';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 根路徑重定向到 /todos */}
        <Route path="/" element={<Navigate to="/todos" replace />} />
        
        {/* 登入頁面 */}
        <Route path="/login" element={<Login />} />
        
        {/* Todo 頁面（需要登入） */}
        <Route 
          path="/todos" 
          element={
            <ProtectedRoute>
              <TodoApp />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 頁面 */}
        <Route path="*" element={<Navigate to="/todos" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

