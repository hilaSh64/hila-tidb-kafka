# TiDB Web Application

A simple full-stack web application with Node.js backend, plain HTML/JS frontend, and TiDB database.

## Features

- **Backend**: Node.js with Express.js
- **Frontend**: Plain HTML, CSS, and JavaScript (no dependencies)
- **Database**: TiDB (MySQL-compatible)
- **API**: RESTful API with CRUD operations

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- TiDB instance (local or remote)

## Installation

### 1. Install Backend Dependencies

```bash
cd app
npm install
```

### 2. Configure Database

Create a `.env` file in the `app` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=4000
DB_USER=root
DB_PASSWORD=
DB_NAME=test
DB_SSL=false

# Server Configuration
PORT=3001
```

Adjust these values according to your TiDB configuration.

### 3. Initialize Database

Run the database initialization script to create the necessary tables:

```bash
cd app
npm run init-db
```

This will:
- Create the database if it doesn't exist
- Create the `items` table
- Insert sample data

## Running the Application

### Start the Backend Server

```bash
cd app
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The backend server will run on `http://localhost:3001`

### Start the Frontend Server

In a new terminal:

```bash
cd app
npm run frontend
```

The frontend will run on `http://localhost:8080`

## API Endpoints

### Items API

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get a single item by ID
- `POST /api/items` - Create a new item
  ```json
  {
    "name": "Item Name",
    "description": "Item Description"
  }
  ```
- `PUT /api/items/:id` - Update an item
- `DELETE /api/items/:id` - Delete an item

### Health Check

- `GET /api/health` - Check server status

## Project Structure

```
app/
├── db/
│   └── connection.js       # Database connection setup
├── routes/
│   └── items.js            # Items API routes
├── scripts/
│   └── init-db.js          # Database initialization script
├── frontend/
│   └── index.html          # Plain HTML/JS frontend
├── server.js                # Express backend server
├── frontend-server.js       # Simple Node.js frontend server
├── package.json
└── README.md
```

## Usage

1. Make sure your TiDB instance is running
2. Configure the database connection in `.env`
3. Initialize the database with `npm run init-db`
4. Start the backend server (`npm start`)
5. Start the frontend server (`npm run frontend`)
6. Open `http://localhost:8080` in your browser

You can now:
- View all items
- Create new items
- Edit existing items
- Delete items

## Troubleshooting

### Database Connection Issues

- Verify TiDB is running and accessible
- Check your `.env` configuration
- Ensure the database credentials are correct
- For remote TiDB, you may need to set `DB_SSL=true`

### Port Conflicts

- Backend default port: 3001 (change in `.env`)
- Frontend default port: 8080 (change in `frontend-server.js`)

## License

ISC

