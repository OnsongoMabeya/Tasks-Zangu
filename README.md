# Task Zangu

A modern task management application built with Go (backend) and Vue.js (frontend). This application allows users to create, manage, and track tasks with features like priority levels, status updates, and deadlines.

## Features

- **User Authentication**
  - User registration and login
  - JWT-based authentication
  - Secure password hashing

- **Task Management**
  - Create, read, update, and delete tasks
  - Set task priorities (low, medium, high)
  - Track task status (pending, in progress, completed)
  - Set and manage deadlines
  - Mark tasks as completed with a simple checkbox

- **User Interface**
  - Modern, responsive design using Tailwind CSS
  - Intuitive task creation and editing forms
  - Task filtering by status and priority
  - Visual indicators for task status and priority

## Tech Stack

### Backend

- **Language**: Go
- **Framework**: Gin (Web Framework)
- **Database**: PostgreSQL
- **ORM**: GORM
- **Authentication**: JWT
- **Other Libraries**:
  - `golang.org/x/crypto` for password hashing
  - `github.com/gin-contrib/cors` for CORS handling

### Frontend

- **Framework**: Vue.js 3
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

## Prerequisites

- Go 1.16 or higher
- Node.js 14 or higher
- PostgreSQL 12 or higher
- npm or yarn

## PostgreSQL Setup

1. Install PostgreSQL:

   ```bash
   # For macOS using Homebrew
   brew install postgresql@13
   ```

2. Start PostgreSQL service:

   ```bash
   # Start PostgreSQL
   brew services start postgresql

   # Verify it's running
   brew services list
   ```

3. Create database and user:

   ```bash
   # Connect to PostgreSQL
   psql postgres

   # Create database
   CREATE DATABASE task_management;

   # Create user with password
   CREATE USER task_user WITH ENCRYPTED PASSWORD 'your_password';

   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE task_management TO task_user;

   # Exit psql
   \q
   ```

4. Configure environment variables:

   ```bash
   # Create .env file in backend directory
   echo "DB_HOST=localhost
   DB_PORT=5432
   DB_USER=task_user
   DB_PASSWORD=your_password
   DB_NAME=task_management
   JWT_SECRET=your_jwt_secret" > backend/.env
   ```

## Setup and Installation

### 1. Clone the Repository

```bash
git clone git@github.com:OnsongoMabeya/Tasks-Zangu.git
cd simple-demo
```

### 2. Backend Setup

```bash
cd backend

# Install Go dependencies
go mod download

# Run the backend server
go run main.go
```

The backend server will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend development server will start on `http://localhost:5173`

## Shutting Down the Application

1. Stop the Frontend:
   - Press `Ctrl + C` in the frontend terminal

2. Stop the Backend:
   - Press `Ctrl + C` in the backend terminal

3. Stop PostgreSQL:

   ```bash
   # Stop PostgreSQL service
   brew services stop postgresql

   # Verify it's stopped
   brew services list
   ```

## API Endpoints

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - Login and receive JWT token

### Tasks

- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Project Structure

```bash
.
├── backend/
│   ├── config/         # Database and app configuration
│   ├── handlers/       # HTTP request handlers
│   ├── middleware/     # Authentication middleware
│   ├── models/         # Database models
│   ├── routes/         # API route definitions
│   └── main.go         # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Vue components
│   │   ├── stores/     # Pinia stores
│   │   ├── router/     # Vue router configuration
│   │   └── App.vue     # Root component
│   ├── index.html
│   └── package.json
└── README.md
```

## Development

### Backend Development

- The backend uses the Gin framework for routing and middleware
- GORM is used for database operations
- JWT tokens are used for authentication
- CORS is configured to allow requests from the frontend

### Frontend Development

- Components are built using Vue 3's Composition API
- Pinia manages application state
- Tailwind CSS provides utility-first styling
- Axios handles API requests with JWT authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
