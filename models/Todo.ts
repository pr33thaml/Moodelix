import { Schema, model, models } from 'mongoose'

export interface TodoDoc {
  _id: string
  title: string
  completed: boolean
  dueAt?: Date
  createdAt: Date
  updatedAt: Date
}

const TodoSchema = new Schema<TodoDoc>(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueAt: { type: Date },
  },
  { timestamps: true }
)

export const Todo = models.Todo || model<TodoDoc>('Todo', TodoSchema)


