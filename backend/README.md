# Micro Task Platform - Backend API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional, defaults are provided):
```env
PORT=2000
JWT_SECRET=your-secret-key-change-in-production
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)

### Tasks
- `GET /api/tasks` - Get all active tasks (protected)
- `GET /api/tasks/:id` - Get task details (protected)

### Submissions
- `POST /api/submissions` - Create submission (protected)
- `GET /api/submissions/me` - Get user's submissions (protected)

### Admin Routes (Admin only)
- `POST /api/admin/tasks` - Create task
- `GET /api/admin/tasks` - Get all tasks
- `GET /api/admin/users` - Get all users

### QA Routes (QA/Admin only)
- `GET /api/qa/submissions?status=pending` - Get submissions by status
- `POST /api/qa/submissions/:id/approve` - Approve submission
- `POST /api/qa/submissions/:id/reject` - Reject submission

### Points
- `GET /api/points/me` - Get user's points and history (protected)
- `POST /api/points/claim` - Claim 100 points reward (protected)

## Default Login Credentials

**Admin:**
- Email: `admin@platform.com`
- Password: `admin123`

**QA:**
- Email: `qa@platform.com`
- Password: `qa123`

**User:**
- Email: `john@example.com`
- Password: `user123`

## Data Storage

All data is stored in JSON files in the `data/` directory:
- `users.json` - User accounts
- `tasks.json` - Task definitions
- `addedTasks.json` - Newly created tasks
- `submissions.json` - Task submissions
- `points.json` - Points transaction history
- `claims.json` - Reward claim history

Files are automatically created if they don't exist.

## Server

The server runs on `http://localhost:2000` by default.

Health check: `GET /health`

## Serving Frontend from Backend

The backend can serve the frontend build folder for production deployment.

### Steps to Build and Serve Frontend:

1. **Build the frontend:**
   ```bash
   cd ../frontend
   npm run build
   ```

2. **Start the backend server:**
   ```bash
   cd ../backend
   npm start
   ```

3. **Access the application:**
   - Frontend: `http://localhost:2000` (or your configured PORT)
   - API: `http://localhost:2000/api`

The backend will automatically:
- Serve static files (CSS, JS, images) from `frontend/build`
- Handle React Router client-side routing
- Keep API routes accessible at `/api/*`

### Development vs Production:

- **Development**: Run frontend (`npm start`) and backend (`npm run dev`) separately
- **Production**: Build frontend once, then serve everything from backend

### Environment Variables:

For production builds, you can set `REACT_APP_API_URL=/api` in the frontend `.env` file before building, or the config will automatically use relative paths in production mode.



admin@platform.com
admin123


john@example.com
user123

qa@platform.com
qa123
