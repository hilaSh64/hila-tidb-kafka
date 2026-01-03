import mysql from 'mysql2/promise';

let connection = null;

export async function createConnection() {
  if (connection) {
    return connection;
  }

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 4000,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
    });
//Logging
    console.log('Connected to TiDB database');
    return connection;
  } catch (error) {
    console.error('Error connecting to TiDB:', error);
    throw error;
  }
}

export function getConnection() {
  if (!connection) {
    throw new Error('Database connection not initialized');
  }
  return connection;
}

