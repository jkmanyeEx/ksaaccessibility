import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const pool = mysql.createPool({
  host: 'localhost',
  user: 'devmeko',
  password: 'Qqqq1111!',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function initDb() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS ksaaccessibility`);
    await connection.query(`USE ksaaccessibility`);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        student_id VARCHAR(50) NOT NULL,
        issue_name VARCHAR(255) NOT NULL,
        description TEXT,
        severity INT NOT NULL,
        suggested_fix TEXT,
        photo_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database and table initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Helper for queries that need the database
export async function query(sql: string, params?: any[]) {
  const connection = await pool.getConnection();
  try {
    await connection.query(`USE ksaaccessibility`);
    return await connection.query(sql, params);
  } finally {
    connection.release();
  }
}

export default pool;
