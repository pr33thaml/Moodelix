'use client'

import { useEffect, useState } from 'react'

type Todo = {
  _id: string
  title: string
  completed: boolean
  dueAt?: string
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchTodos() {
    const res = await fetch('/api/todos')
    const data = await res.json()
    setTodos(Array.isArray(data) ? data : [])
  }

  useEffect(() => { fetchTodos() }, [])

  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await fetch('/api/todos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) })
      setTitle('')
      await fetchTodos()
    } finally {
      setLoading(false)
    }
  }

  async function toggleTodo(id: string, completed: boolean) {
    await fetch(`/api/todos/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed: !completed }) })
    await fetchTodos()
  }

  async function removeTodo(id: string) {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    await fetchTodos()
  }

  async function clearAllTodos() {
    if (todos.length === 0) return
    if (confirm('Are you sure you want to clear all tasks?')) {
      for (const todo of todos) {
        await removeTodo(todo._id)
      }
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-black mb-6">Todo App</h2>
      
      {/* Add New Todo Section */}
      <form onSubmit={addTodo} className="flex gap-3 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add your new todo"
          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center justify-center min-w-[48px]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span className="text-xl font-bold">+</span>
          )}
        </button>
      </form>

      {/* Todo List */}
      <div className="space-y-3 mb-6">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
              todo.completed 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo._id, todo.completed)}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
              />
              <span className={`text-gray-800 ${
                todo.completed ? 'line-through text-gray-500' : ''
              }`}>
                {todo.title}
              </span>
            </div>
            <button
              onClick={() => removeTodo(todo._id)}
              className="ml-3 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
        
        {todos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No tasks yet. Add your first todo!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {todos.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-gray-600">
            You have {todos.filter(t => !t.completed).length} pending tasks
          </span>
          <button
            onClick={clearAllTodos}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  )
}


