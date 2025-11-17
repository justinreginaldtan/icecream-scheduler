const { getDatabase } = require("../database/db")

/**
 * Database utility functions for common queries
 * Encapsulates prepared statements and error handling
 */

/**
 * Get single row by ID
 */
function getById(table, id) {
  const db = getDatabase()
  const stmt = db.prepare(`SELECT * FROM ${table} WHERE id = ?`)
  return stmt.get(id)
}

/**
 * Get all rows from table with optional WHERE clause
 */
function getAll(table, whereClause = null, params = []) {
  const db = getDatabase()
  let sql = `SELECT * FROM ${table}`
  if (whereClause) {
    sql += ` WHERE ${whereClause}`
  }
  const stmt = db.prepare(sql)
  return params.length > 0 ? stmt.all(...params) : stmt.all()
}

/**
 * Get single row with WHERE clause
 */
function getOne(table, whereClause, params = []) {
  const db = getDatabase()
  const sql = `SELECT * FROM ${table} WHERE ${whereClause}`
  const stmt = db.prepare(sql)
  return params.length > 0 ? stmt.get(...params) : stmt.get()
}

/**
 * Count rows in table with optional WHERE clause
 */
function count(table, whereClause = null, params = []) {
  const db = getDatabase()
  let sql = `SELECT COUNT(*) as count FROM ${table}`
  if (whereClause) {
    sql += ` WHERE ${whereClause}`
  }
  const stmt = db.prepare(sql)
  const result = params.length > 0 ? stmt.get(...params) : stmt.get()
  return result.count
}

/**
 * Insert row into table
 * Returns last insert ID
 */
function insert(table, data) {
  const db = getDatabase()
  const columns = Object.keys(data)
  const values = Object.values(data)
  const placeholders = columns.map(() => "?").join(", ")

  const sql = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`
  const stmt = db.prepare(sql)
  const result = stmt.run(...values)

  return result.lastInsertRowid
}

/**
 * Update row(s) in table
 * Returns number of rows affected
 */
function update(table, data, whereClause, params = []) {
  const db = getDatabase()
  const updates = Object.keys(data).map((key) => `${key} = ?`)
  const values = [...Object.values(data), ...params]

  const sql = `UPDATE ${table} SET ${updates.join(", ")} WHERE ${whereClause}`
  const stmt = db.prepare(sql)
  const result = stmt.run(...values)

  return result.changes
}

/**
 * Delete row(s) from table
 * Returns number of rows affected
 */
function deleteRows(table, whereClause, params = []) {
  const db = getDatabase()
  const sql = `DELETE FROM ${table} WHERE ${whereClause}`
  const stmt = db.prepare(sql)
  const result = stmt.run(...params)

  return result.changes
}

/**
 * Execute raw SQL query
 * Use for complex queries
 */
function query(sql, params = []) {
  const db = getDatabase()
  const stmt = db.prepare(sql)
  return params.length > 0 ? stmt.all(...params) : stmt.all()
}

/**
 * Execute raw SQL and return single row
 */
function queryOne(sql, params = []) {
  const db = getDatabase()
  const stmt = db.prepare(sql)
  return params.length > 0 ? stmt.get(...params) : stmt.get()
}

/**
 * Execute raw SQL for modifications (INSERT/UPDATE/DELETE)
 * Returns number of rows affected
 */
function execute(sql, params = []) {
  const db = getDatabase()
  const stmt = db.prepare(sql)
  const result = params.length > 0 ? stmt.run(...params) : stmt.run()
  return result.changes
}

/**
 * Transaction helper
 * Wraps a function in BEGIN/COMMIT or ROLLBACK
 */
function transaction(fn) {
  const db = getDatabase()
  try {
    db.exec("BEGIN TRANSACTION")
    const result = fn(db)
    db.exec("COMMIT")
    return result
  } catch (error) {
    db.exec("ROLLBACK")
    throw error
  }
}

module.exports = {
  getById,
  getAll,
  getOne,
  count,
  insert,
  update,
  deleteRows,
  query,
  queryOne,
  execute,
  transaction,
}
