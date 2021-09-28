import { openDB } from 'idb'

const DB_NAME = 'scavenger'
const ITEMS_STORE = 'items'
const QUESTIONS_STORE = 'questions'

export default class ScavengerDatabase {
  constructor () {
    if (typeof window === 'undefined') {
      throw new Error('Browser is required')
    }
    if (typeof window.indexedDB === 'undefined') {
      throw new Error('Browser does not support IndexedDB')
    }
  }

  async _openDatabase () {
    return await openDB(DB_NAME, 1, {
      upgrade (db) {
        db.createObjectStore(ITEMS_STORE, { keyPath: 'id' })
        db.createObjectStore(QUESTIONS_STORE, { keyPath: 'id' })
      }
    })
  }

  async addItem (id, score) {
    const db = await this._openDatabase()
    try {
      await db.put(ITEMS_STORE, { id, score, ts: Date.now() })
    } finally {
      db.close()
    }
  }
  async getItem (id) {
    const db = await this._openDatabase()
    try {
      return await db.get(ITEMS_STORE, id) || null
    }
    finally {
      db.close()
    }
  }

  async addItemQuestion (id, question, score) {
    const db = await this._openDatabase()
    try {
      await db.put(QUESTIONS_STORE, { id, question, score, ts: Date.now() })
    } finally {
      db.close()
    }
  }
  async getItemQuestion (id) {
    const db = await this._openDatabase()
    try {
      return await db.get(QUESTIONS_STORE, id) || null
    }
    finally {
      db.close()
    }
  }

  async getScore () {
    const db = await this._openDatabase()
    try {
      const items = await db.getAll(ITEMS_STORE)
      const questions = await db.getAll(QUESTIONS_STORE)
      return items.map(x => x.score).reduce((a, b) => a + b, 0) +
        questions.map(x => x.score).reduce((a, b) => a + b, 0)
    } finally {
      db.close()
    }
  }
}
