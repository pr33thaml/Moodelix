import mongoose from 'mongoose'

type MongooseConnectionState = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseState: MongooseConnectionState | undefined
}

const MONGODB_URI = process.env.MONGODB_URI || ''

if (!global.mongooseState) {
  global.mongooseState = { conn: null, promise: null }
}

export async function connectToDatabase() {
  const state = global.mongooseState!
  if (state.conn) return state.conn
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not set')
  if (!state.promise) {
    state.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || undefined,
    })
  }
  state.conn = await state.promise
  return state.conn
}


