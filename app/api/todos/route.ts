import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    console.log('🔍 GET /api/todos - Starting request')
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log('🔍 User check result:', { user: !!user, userId: user?.id, error: userError })
    
    if (!user) {
      console.log('❌ No user found, returning 401')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔍 Fetching todos for user:', user.id)
    const { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    console.log('🔍 Todos query result:', { todos, error })

    if (error) {
      console.error('❌ Error fetching todos:', error)
      throw error
    }

    console.log('✅ Returning todos:', todos || [])
    return NextResponse.json(todos || [])
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    console.log('🔍 POST /api/todos - Starting request')
    const body = await req.json()
    console.log('🔍 Request body:', body)
    
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log('🔍 User check result:', { user: !!user, userId: user?.id, error: userError })
    
    if (!user) {
      console.log('❌ No user found, returning 401')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔍 Inserting todo for user:', user.id)
    const { data: todo, error } = await supabase
      .from('todos')
      .insert({
        user_id: user.id,
        title: body?.title,
        due_at: body?.dueAt,
        completed: false
      })
      .select()
      .single()

    console.log('🔍 Insert result:', { todo, error })

    if (error) {
      console.error('❌ Error inserting todo:', error)
      throw error
    }

    console.log('✅ Todo created successfully:', todo)
    return NextResponse.json(todo, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}


