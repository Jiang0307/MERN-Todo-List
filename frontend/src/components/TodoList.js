import React from 'react';
import './TodoList.css';
import TodoItem from './TodoItem';

function TodoList({ todos, onUpdateTodo, onDeleteTodo }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 還沒有任何 Todo</p>
        <p className="empty-hint">在上方表單中新增一個 Todo 開始吧！</p>
      </div>
    );
  }

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="todo-list-container">
      <div className="todo-stats">
        <span>總共: {totalCount}</span>
        <span>已完成: {completedCount}</span>
        <span>未完成: {totalCount - completedCount}</span>
      </div>

      <div className="todo-list">
        {todos.map(todo => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onUpdate={onUpdateTodo}
            onDelete={onDeleteTodo}
          />
        ))}
      </div>
    </div>
  );
}

export default TodoList;




