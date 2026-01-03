import mysql from 'mysql2/promise';
import { Kafka } from 'kafkajs';

const DB_HOST = process.env.DB_HOST || 'db';
const DB_PORT = process.env.DB_PORT || 4000;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'test';
const KAFKA_BROKERS = process.env.KAFKA_BROKERS || 'kafka:9094';
const KAFKA_TOPIC = process.env.KAFKA_TOPIC || 'tidb-changes';

// Create Kafka producer
const kafka = new Kafka({
  clientId: 'tidb-cdc-producer',
  brokers: [KAFKA_BROKERS]
});

const producer = kafka.producer();

// Track last check times for each table
const lastChecks = {
  items: null,
  users: null,
  tokens: null
};

// Tables that have updated_at column
const tablesWithUpdatedAt = new Set(['items']);

async function connectDB() {
  return await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  });
}

async function publishChange(table, operation, data) {
  try {
    const message = {
      type: operation.toUpperCase(),
      database: DB_NAME,
      table: table,
      data: data,
      old: null,
      ts: Date.now()
    };

    await producer.send({
      topic: KAFKA_TOPIC,
      messages: [{
        key: `${table}-${data.id || Date.now()}`,
        value: JSON.stringify(message)
      }]
    });

    // Log to console
    const logEntry = {
      timestamp: new Date().toISOString(),
      table: `${DB_NAME}.${table}`,
      operation: operation.toLowerCase(),
      data: data
    };
    console.log(JSON.stringify(logEntry));
  } catch (error) {
    console.error('Error publishing change:', error);
  }
}

async function checkTableChanges(db, tableName) {
  try {
    // Get the latest record based on updated_at or created_at
    const hasUpdatedAt = tablesWithUpdatedAt.has(tableName);
    const orderBy = hasUpdatedAt 
      ? `COALESCE(updated_at, created_at) DESC`
      : `created_at DESC`;
    
    const [rows] = await db.execute(
      `SELECT * FROM ${tableName} ORDER BY ${orderBy} LIMIT 1`
    );

    if (rows.length > 0) {
      const latest = rows[0];
      const latestTime = latest.updated_at || latest.created_at;
      
      if (!lastChecks[tableName] || new Date(latestTime) > new Date(lastChecks[tableName])) {
        // New or updated record detected
        if (lastChecks[tableName]) {
          await publishChange(tableName, 'UPDATE', latest);
        } else {
          await publishChange(tableName, 'INSERT', latest);
        }
        lastChecks[tableName] = latestTime;
      }
    }

    // Check for deletions by counting records
    const [countRows] = await db.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
    const currentCount = countRows[0].count;
    
    if (lastChecks[`${tableName}_count`] !== undefined && currentCount < lastChecks[`${tableName}_count`]) {
      // Deletion detected (simplified - in production, use triggers or binlog)
      await publishChange(tableName, 'DELETE', { count: currentCount });
    }
    lastChecks[`${tableName}_count`] = currentCount;
  } catch (error) {
    console.error(`Error checking ${tableName}:`, error);
  }
}

async function monitorChanges() {
  await producer.connect();
  console.log('CDC Service started - monitoring database changes');

  const db = await connectDB();
  console.log('Connected to database');

  // Poll for changes every 2 seconds
  setInterval(async () => {
    try {
      await checkTableChanges(db, 'items');
      await checkTableChanges(db, 'users');
      await checkTableChanges(db, 'tokens');
    } catch (error) {
      console.error('Error monitoring changes:', error);
    }
  }, 2000);
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down CDC service...');
  await producer.disconnect();
  process.exit(0);
});

monitorChanges().catch(console.error);

