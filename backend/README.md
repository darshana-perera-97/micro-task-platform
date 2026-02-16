# Task & Reward Points Backend API

Node.js + Express backend for the Task & Reward Points Platform.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and set your `JWT_SECRET` (use a strong random string in production).

The `.env` file includes admin credentials:
- `ADMIN_EMAIL=admin@admin.com`
- `ADMIN_PASSWORD=123456`

### 3. Seed Users (Optional but Recommended)

Run the seed script to create users with properly hashed passwords:

```bash
npm run seed
```

This will create the admin user from `.env` credentials and other test users.

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── server.js              # Main server file
├── routes/                # API routes
├── controllers/           # Business logic
├── middleware/            # Auth & role middleware
├── utils/                 # Helper functions
├── data/                  # JSON data storage
└── uploads/              # Uploaded files (auto-created)
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Default Test Users

After running `npm run seed`, the following users are available:

- **Admin**: `admin@admin.com` (password: `123456` - from .env)
- **QA Lead**: `qa@platform.com` (password: `password`)
- **User**: `john@example.com`, `emily@example.com`, `michael@example.com` (password: `password`)

**Note**: Run `npm run seed` to create users with properly hashed passwords. The admin credentials are read from `.env` file (ADMIN_EMAIL and ADMIN_PASSWORD).

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)

### Tasks (User)

- `GET /api/tasks` - Get all active tasks (protected)
- `GET /api/tasks/:id` - Get task details (protected)

### Submissions (User)

- `POST /api/submissions` - Create submission (protected, supports image upload)
- `GET /api/submissions/me` - Get user's submissions (protected)
- `GET /api/submissions/:id` - Get submission by ID (protected)

### Admin Routes

**Task Management:**
- `POST /api/admin/tasks` - Create task
- `GET /api/admin/tasks` - Get all tasks
- `PUT /api/admin/tasks/:id` - Update task
- `DELETE /api/admin/tasks/:id` - Delete task

**User Management:**
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/pending` - Get pending user requests
- `POST /api/admin/users/:id/approve` - Approve user request
- `PUT /api/admin/users/:id/status` - Update user status (active/pending/suspended)

**Operator Management:**
- `POST /api/admin/operators` - Create operator (admin or QA user)

**Submission Management:**
- `GET /api/admin/submissions` - Get all submissions

### QA Routes

- `GET /api/qa/submissions?status=pending` - Get submissions by status
- `POST /api/qa/submissions/:id/approve` - Approve submission
- `POST /api/qa/submissions/:id/reject` - Reject submission

### Points

- `GET /api/points/me` - Get user's points and history
- `POST /api/points/claim` - Claim 100 points reward

## 💾 Data Storage

All data is stored in JSON files in the `data/` directory:

- `users.json` - User accounts
- `tasks.json` - Task definitions
- `submissions.json` - Task submissions
- `points.json` - Points transaction history
- `claims.json` - Reward claim history

Files are automatically created if they don't exist.

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control (admin, qa, user)
- Input validation
- File upload validation (images only, 5MB limit)

## 📝 Example API Calls

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password"
  }'
```

### Get Active Tasks (with token)

```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Submission

```bash
curl -X POST http://localhost:5000/api/submissions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "task-1",
    "evidence": {
      "text": "CONF-2026-ABC123",
      "link": ""
    }
  }'
```

### Create Operator (Admin only)

```bash
curl -X POST http://localhost:5000/api/admin/operators \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New QA Operator",
    "email": "qa2@platform.com",
    "password": "securepassword123",
    "role": "qa"
  }'
```

### Approve User Request (Admin only)

```bash
curl -X POST http://localhost:5000/api/admin/users/USER_ID/approve \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

### Get Pending Users (Admin only)

```bash
curl -X GET http://localhost:5000/api/admin/users/pending \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## 🛠️ Development

### Adding New Features

1. Create controller in `controllers/`
2. Create routes in `routes/`
3. Add middleware if needed
4. Update `server.js` if adding new route groups

### Testing

You can use tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

## 📦 Dependencies

- **express** - Web framework
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **uuid** - Unique ID generation
- **multer** - File upload handling
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🚨 Important Notes

1. **JWT Secret**: Change `JWT_SECRET` in production!
2. **Admin Credentials**: Admin login is configured in `.env` file (ADMIN_EMAIL and ADMIN_PASSWORD). Default: `admin@admin.com` / `123456`
3. **User Approval**: New user registrations are set to `pending` status and require admin approval before they can login.
4. **Password Hashing**: Run `npm run seed` to create users with properly hashed passwords.
5. **File Uploads**: Images are stored in `uploads/` directory (auto-created).
6. **Data Persistence**: All data is stored in JSON files. Consider migrating to a database for production.

## 👥 User Status System

Users can have three statuses:
- **pending**: New registrations awaiting admin approval
- **active**: Approved users who can login and use the platform
- **suspended**: Users who have been suspended by admin

Only users with `active` status can login. Admins can approve pending users or suspend active users.

## 🎯 Next Steps

- Add rate limiting
- Add request validation (e.g., express-validator)
- Add API documentation (Swagger)
- Migrate to MongoDB/PostgreSQL
- Add email notifications
- Add admin analytics dashboard

