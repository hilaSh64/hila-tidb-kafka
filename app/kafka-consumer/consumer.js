import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'tidb-cdc-consumer',
  brokers: [process.env.KAFKA_BROKERS || 'kafka:9094']
});

const consumer = kafka.consumer({ groupId: 'tidb-cdc-group' });
const topic = process.env.KAFKA_TOPIC || 'tidb-changes';

async function run() {
  try {
    await consumer.connect();
    console.log('Connected to Kafka');
    
    await consumer.subscribe({ topic, fromBeginning: false });
    console.log(`Subscribed to topic: ${topic}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value.toString();
          const data = JSON.parse(value);

          // Parse Canal JSON format from TiDB CDC
          let logEntry = {};
          
          if (data.type) {
            // Canal JSON format
            logEntry = {
              timestamp: new Date().toISOString(),
              table: data.database + '.' + data.table,
              operation: data.type.toLowerCase(),
              data: data.data || data.old || {}
            };
          } else {
            // Fallback for other formats
            logEntry = {
              timestamp: new Date().toISOString(),
              table: data.table || 'unknown',
              operation: data.operation || 'unknown',
              data: data.data || data
            };
          }

          console.log(JSON.stringify(logEntry));
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }
    });
  } catch (error) {
    console.error('Kafka consumer error:', error);
    process.exit(1);
  }
}

run();

