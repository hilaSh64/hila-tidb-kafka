# TiDB Web Application

A simple full-stack web application with Node.js backend, plain HTML/JS frontend, and TiDB database with Change Data Capture (CDC).

## Features

- **Backend**: Node.js with Express.js
- **Frontend**: Plain HTML, CSS, and JavaScript (no dependencies)
- **Database**: TiDB (MySQL-compatible)
- **API**: RESTful API with CRUD operations
- **Authentication**: Token-based user authentication
- **Logging**: User activity logging with log4js
- **CDC**: TiDB Change Data Capture (TiCDC) to Kafka
- **Real-time Processing**: Kafka consumer for database changes

## Prerequisites

- Docker and Docker Compose

## Running the Application

### Start Everything

From the project root directory:

```bash
docker-compose up
```

Or to rebuild images:

```bash
docker-compose up --build
```

This will start:
- **PD** (Placement Driver) - TiDB cluster management (port 2379)
- **TiDB Database** - Database server (port 4000)
- **Backend API** - RESTful API server (port 3001)
- **Frontend** - Web interface (port 8080)
- **Kafka** - Message broker (ports 9092, 9093)
- **TiCDC** - Change Data Capture service (port 8300)
- **Kafka Consumer** - Processes database changes

The database is automatically initialized on backend startup.

### Access the Application

- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3001`
- Database: `localhost:4000`


## Project Structure

```
app/
├── db/
│   └── connection.js          # Database connection setup
├── routes/
│   ├── auth.js               # Authentication routes
│   └── items.js               # Items API routes
├── middleware/
│   └── auth.js                # Authentication middleware
├── utils/
│   └── logger.js              # Logging utility (log4js)
├── scripts/
│   └── init-db.js             # Database initialization script
├── frontend/
│   ├── index.html             # Plain HTML/JS frontend
│   └── frontend-server.js     # Frontend server
├── kafka-consumer/
│   ├── consumer.js            # Kafka consumer for CDC messages
│   └── Dockerfile
├── server.js                  # Express backend server
├── Dockerfile
└── package.json
```

## Services

- **db**: TiDB database server
- **backend**: Node.js API server with authentication
- **frontend**: Static file server for the web interface
- **kafka**: Apache Kafka message broker (KRaft mode, no Zookeeper)
- **ticdc**: TiDB Change Data Capture service
- **kafka-consumer**: Processes database change messages from Kafka

## Logging

- **User Activity**: Login events are logged to console in JSON format with timestamp, user ID, action, and IP address
- **Database Changes**: All INSERT/UPDATE/DELETE operations are captured by TiCDC and logged by the Kafka consumer
