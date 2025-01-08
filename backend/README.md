# Task Zangu Backend

A robust Go backend service providing RESTful APIs for task management with PostgreSQL database.

## Technology Stack

- **Language**: Go (Golang)
- **Framework**: Gin Web Framework
- **Database**: PostgreSQL
- **ORM**: GORM
- **Authentication**: JWT (JSON Web Tokens)

## Features

- **RESTful API Endpoints**
  - User authentication (login/register)
  - CRUD operations for tasks
  - Task filtering and search capabilities

- **Database Management**
  - PostgreSQL integration with GORM
  - Automatic migrations
  - Soft delete functionality
  - Relationship handling (User-Tasks)

- **Security**
  - JWT-based authentication
  - Password hashing
  - Protected routes
  - CORS configuration

## Project Structure

```bash
backend/
├── config/             # Configuration settings
├── handlers/           # HTTP request handlers
│   ├── auth_handler.go # Authentication logic
│   └── task_handler.go # Task management logic
├── models/             # Database models
│   ├── user.go        # User model
│   └── task.go        # Task model
├── middleware/         # Custom middleware
└── main.go            # Application entry point
```

## API Endpoints

### Authentication

- `POST /register` - User registration
- `POST /login` - User login

### Tasks

- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Setup and Installation

1. Set up PostgreSQL database

2. Configure environment variables:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=task_management
   JWT_SECRET=your_jwt_secret
   ```

3. Run the application:

   ```bash
   go run main.go
   ```

## Database Schema

### Users Table

- `id` (Primary Key)
- `username`
- `password` (hashed)
- `created_at`
- `updated_at`

### Tasks Table

- `id` (Primary Key)
- `user_id` (Foreign Key)
- `title`
- `description`
- `status`
- `priority`
- `deadline`
- `created_at`
- `updated_at`
- `deleted_at`
