'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, Circle, Smile, Frown, Zap, Heart, Meh } from 'lucide-react'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

interface MoodEntry {
  id: string
  mood: 'happy' | 'sad' | 'excited' | 'calm' | 'neutral'
  note: string
  createdAt: Date
}

const moodIcons = {
  happy: Smile,
  sad: Frown,
  excited: Zap,
  calm: Heart,
  neutral: Meh,
}

const moodColors = {
  happy: 'text-mood-happy',
  sad: 'text-mood-sad',
  excited: 'text-mood-excited',
  calm: 'text-mood-calm',
  neutral: 'text-mood-neutral',
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [newMood, setNewMood] = useState<MoodEntry['mood']>('neutral')
  const [newMoodNote, setNewMoodNote] = useState('')

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('moodelix-todos')
    const savedMoods = localStorage.getItem('moodelix-moods')
    
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      })))
    }
    
    if (savedMoods) {
      setMoodEntries(JSON.parse(savedMoods).map((mood: any) => ({
        ...mood,
        createdAt: new Date(mood.createdAt)
      })))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('moodelix-todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    localStorage.setItem('moodelix-moods', JSON.stringify(moodEntries))
  }, [moodEntries])

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
      }
      setTodos([...todos, todo])
      setNewTodo('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const addMood = () => {
    if (newMoodNote.trim()) {
      const moodEntry: MoodEntry = {
        id: Date.now().toString(),
        mood: newMood,
        note: newMoodNote.trim(),
        createdAt: new Date(),
      }
      setMoodEntries([...moodEntries, moodEntry])
      setNewMoodNote('')
    }
  }

  const deleteMood = (id: string) => {
    setMoodEntries(moodEntries.filter(mood => mood.id !== id))
  }

  const getMoodStats = () => {
    const moodCounts = moodEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood: mood as MoodEntry['mood'],
      count,
      percentage: Math.round((count / moodEntries.length) * 100)
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-primary-700 mb-4">
          Moodelix
        </h1>
        <p className="text-xl text-gray-600">
          Track your todos and capture your mood ✨
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Todo Section */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CheckCircle className="text-primary-500" />
            My Todos
          </h2>
          
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              className="input flex-1"
            />
            <button onClick={addTodo} className="btn btn-primary">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {todos.map(todo => (
              <div
                key={todo.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  todo.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  {todo.completed ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <Circle className="text-gray-400" />
                  )}
                </button>
                
                <span
                  className={`flex-1 ${
                    todo.completed
                      ? 'line-through text-gray-500'
                      : 'text-gray-700'
                  }`}
                >
                  {todo.text}
                </span>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            
            {todos.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No todos yet! Add one above to get started.
              </p>
            )}
          </div>
        </div>

        {/* Mood Section */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Heart className="text-pink-500" />
            Mood Tracker
          </h2>
          
          <div className="mb-6">
            <div className="flex gap-2 mb-3">
              {Object.entries(moodIcons).map(([mood, Icon]) => (
                <button
                  key={mood}
                  onClick={() => setNewMood(mood as MoodEntry['mood'])}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    newMood === mood
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${moodColors[mood as keyof typeof moodColors]}`} />
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="How are you feeling?"
                value={newMoodNote}
                onChange={(e) => setNewMoodNote(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addMood()}
                className="input flex-1"
              />
              <button onClick={addMood} className="btn btn-primary">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mood Stats */}
          {moodEntries.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Mood Overview</h3>
              <div className="space-y-2">
                {getMoodStats().map(({ mood, count, percentage }) => {
                  const Icon = moodIcons[mood]
                  return (
                    <div key={mood} className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${moodColors[mood]}`} />
                      <span className="capitalize text-gray-600">{mood}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${moodColors[mood].replace('text-', 'bg-')}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Recent Mood Entries */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Recent Entries</h3>
            {moodEntries.slice(0, 5).map(mood => {
              const Icon = moodIcons[mood.mood]
              return (
                <div
                  key={mood.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200"
                >
                  <Icon className={`w-5 h-5 ${moodColors[mood.mood]}`} />
                  <span className="flex-1 text-gray-700">{mood.note}</span>
                  <span className="text-sm text-gray-500">
                    {mood.createdAt.toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => deleteMood(mood.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
            
            {moodEntries.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No mood entries yet! Track your first mood above.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="mt-12 text-center">
        <div className="inline-flex gap-8 bg-white rounded-xl shadow-sm border border-gray-200 px-8 py-4">
          <div>
            <div className="text-2xl font-bold text-primary-600">{todos.length}</div>
            <div className="text-sm text-gray-600">Total Todos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600">
              {todos.filter(t => t.completed).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600">{moodEntries.length}</div>
            <div className="text-sm text-gray-600">Mood Entries</div>
          </div>
        </div>
      </div>
    </div>
  )
}
