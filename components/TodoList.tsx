'use client'

import { useEffect, useState } from 'react'
import { useSupabaseAuth } from '@/lib/SupabaseAuthContext'
import { fetchTodos, addTodo, updateTodo, deleteTodo, type Todo } from '@/lib/todos'


export default function TodoList() {
  const { user, session } = useSupabaseAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchTodosFromAPI() {
    if (!session) {
      console.log('No session, clearing todos')
      setTodos([])
      return
    }

    try {
      console.log('🔄 Fetching todos for user:', session.user.id)
      const data = await fetchTodos()
      setTodos(data)
      console.log('✅ Todos fetched:', data)
    } catch (error) {
      console.error('❌ Error fetching todos:', error)
      setTodos([])
    }
  }

  useEffect(() => { 
    fetchTodosFromAPI() 
  }, [session])

  async function addTodoHandler(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !session) {
      console.log('❌ Cannot add todo - no title or session:', { title: title.trim(), hasSession: !!session })
      return
    }
    setLoading(true)
    try {
      console.log('🔄 Adding todo:', title)
      const newTodo = await addTodo(title)
      if (newTodo) {
        console.log('✅ Todo added successfully:', newTodo)
        setTitle('')
        await fetchTodosFromAPI()
      }
    } catch (error) {
      console.error('❌ Error adding todo:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleTodo(id: string, completed: boolean) {
    if (!session) return
    try {
      const updatedTodo = await updateTodo(id, { completed: !completed })
      if (updatedTodo) {
        await fetchTodosFromAPI()
        console.log('✅ Todo toggled successfully')
      }
    } catch (error) {
      console.error('❌ Error toggling todo:', error)
    }
  }

  async function removeTodo(id: string) {
    if (!session) return
    try {
      const success = await deleteTodo(id)
      if (success) {
        await fetchTodosFromAPI()
        console.log('✅ Todo removed successfully')
      }
    } catch (error) {
      console.error('❌ Error removing todo:', error)
    }
  }

  async function clearAllTodos() {
    if (todos.length === 0 || !session) return
    if (confirm('Are you sure you want to clear all tasks?')) {
      for (const todo of todos) {
        await removeTodo(todo.id)
      }
    }
  }

  if (!session) {
    return (
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-black mb-6">Todo App</h2>
        <div className="text-center text-gray-500">
          <p>Please sign in to manage your tasks</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Add New Todo Section */}
      <form onSubmit={addTodoHandler} className="flex gap-3 mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to accomplish?"
          className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 text-lg"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="px-8 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-lg font-medium disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {/* Todo List */}
      <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {todos.length === 0 ? (
          <div className="text-center text-white/60 py-12">
            <div className="text-xl">No tasks yet. Start building your success!</div>
          </div>
        ) : (
          todos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
              todo.completed
                ? 'bg-white/5 border-white/10 text-white/60'
                : 'bg-white/10 border-white/20 text-white'
            }`}
          >
            <button
              onClick={() => toggleTodo(todo.id, todo.completed)}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                todo.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-white/40 hover:border-white/60'
              }`}
            >
              {todo.completed && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <span className={`flex-1 text-lg ${todo.completed ? 'line-through' : ''}`}>
              {todo.title}
            </span>
            <button
              onClick={() => removeTodo(todo.id)}
              className="text-white/40 hover:text-red-400 transition-colors p-2"
              title="Delete task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          ))
        )}
      </div>

      {/* Footer */}
      {todos.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <span className="text-white/60">
            You have {todos.filter(t => !t.completed).length} pending tasks
          </span>
          <button
            onClick={clearAllTodos}
            className="text-white/40 hover:text-red-400 text-sm font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  )
}


