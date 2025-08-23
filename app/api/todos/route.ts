import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Todo } from '@/models/Todo'

export async function GET() {
  try {
    await connectToDatabase()
    const todos = await Todo.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json(todos)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    await connectToDatabase()
    const todo = await Todo.create({ title: body?.title, dueAt: body?.dueAt })
    return NextResponse.json(todo, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}


