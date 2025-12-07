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

  return (
    <div className="todo-list-container">
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




