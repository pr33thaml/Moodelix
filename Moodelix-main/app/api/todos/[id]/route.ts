import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Todo } from '@/models/Todo'

type Params = { params: { id: string } }

export async function PATCH(req: Request, { params }: Params) {
  try {
    const body = await req.json()
    await connectToDatabase()
    const todo = await Todo.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    )
    return NextResponse.json(todo)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await connectToDatabase()
    await Todo.findByIdAndDelete(params.id)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}


