import { createConnection } from '../db/connection.js';
import crypto from 'crypto';

async function initDatabase() {
  try {
    const db = await createConnection();

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'test';
    await db.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await db.execute(`USE ${dbName}`);

    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tokens table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create items table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully!');
    console.log('Tables "users", "tokens", and "items" created or already exist.');

    // Insert sample user if users table is empty
    const [userRows] = await db.execute('SELECT COUNT(*) as count FROM users');
    if (userRows[0].count === 0) {
      // Simple password hash (in production, use bcrypt)
      const password = 'admin';
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      
      await db.execute(`
        INSERT INTO users (username, email, password) VALUES
        ('admin', 'admin@example.com', ?)
      `, [hashedPassword]);
      console.log('Sample user created: username=admin, password=admin');
    }

    await db.end();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();

