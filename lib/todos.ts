import { supabase } from './supabase'

export interface Todo {
  id: string
  title: string
  completed: boolean
  due_at?: string
  created_at?: string
  updated_at?: string
}

export async function fetchTodos(): Promise<Todo[]> {
  try {
    console.log('🔄 Fetching todos from client...')
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('❌ No user found')
      return []
    }

    console.log('🔍 Fetching todos for user:', user.id)
    const { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching todos:', error)
      return []
    }

    console.log('✅ Todos fetched:', todos)
    return todos || []
  } catch (error) {
    console.error('❌ Error fetching todos:', error)
    return []
  }
}

export async function addTodo(title: string): Promise<Todo | null> {
  try {
    console.log('🔄 Adding todo from client:', title)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('❌ No user found')
      return null
    }

    const { data: todo, error } = await supabase
      .from('todos')
      .insert({
        user_id: user.id,
        title,
        completed: false
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Error adding todo:', error)
      return null
    }

    console.log('✅ Todo added:', todo)
    return todo
  } catch (error) {
    console.error('❌ Error adding todo:', error)
    return null
  }
}

export async function updateTodo(id: string, updates: Partial<Todo>): Promise<Todo | null> {
  try {
    console.log('🔄 Updating todo from client:', id, updates)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('❌ No user found')
      return null
    }

    const { data: todo, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating todo:', error)
      return null
    }

    console.log('✅ Todo updated:', todo)
    return todo
  } catch (error) {
    console.error('❌ Error updating todo:', error)
    return null
  }
}

export async function deleteTodo(id: string): Promise<boolean> {
  try {
    console.log('🔄 Deleting todo from client:', id)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('❌ No user found')
      return false
    }

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('❌ Error deleting todo:', error)
      return false
    }

    console.log('✅ Todo deleted')
    return true
  } catch (error) {
    console.error('❌ Error deleting todo:', error)
    return false
  }
}
