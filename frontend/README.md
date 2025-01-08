# Task Management System Frontend

A modern Vue.js application for managing tasks with a clean and intuitive user interface.

## Technology Stack

- **Framework**: Vue.js 3 with Composition API
- **Build Tool**: Vite
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Router**: Vue Router

## Features

- **User Authentication**
  - Login/Register functionality
  - JWT token-based authentication
  - Secure route protection

- **Task Management**
  - Create, Read, Update, Delete (CRUD) operations for tasks
  - Task status toggle (Pending → In Progress → Completed)
  - Task filtering by status and priority
  - Search functionality for task title and description

- **User Interface**
  - Responsive design for all screen sizes
  - Modern glass-morphism design
  - Smooth transitions and animations
  - Intuitive task status indicators
  - Priority badges (Low, Medium, High)

## Project Structure

```bash
frontend/
├── src/
│   ├── components/          # Vue components
│   │   ├── Login.vue       # User authentication
│   │   └── TaskList.vue    # Task management
│   ├── stores/             # Pinia state management
│   │   ├── auth.js         # Authentication store
│   │   └── task.js         # Task management store
│   ├── router/             # Vue router configuration
│   └── App.vue             # Root component
└── index.html              # Entry point
```

## Setup and Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

## API Integration

- Communicates with the backend REST API at `http://localhost:8080`
- Uses JWT tokens for authenticated requests
- Handles API errors with user-friendly messages
