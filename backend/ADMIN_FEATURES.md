# Admin Features Documentation

## 🔐 Admin Login

The admin credentials are configured in the `.env` file:

```
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=123456
```

After running `npm run seed`, you can login with these credentials.

## 👥 Operator Management

Admins can create operators (users with `admin` or `qa` roles) directly without approval.

### Create Operator

**Endpoint:** `POST /api/admin/operators`

**Request Body:**
```json
{
  "name": "New QA Operator",
  "email": "qa2@platform.com",
  "password": "securepassword123",
  "role": "qa"  // or "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "QA operator created successfully",
  "data": {
    "id": "uuid",
    "name": "New QA Operator",
    "email": "qa2@platform.com",
    "role": "qa",
    "status": "active",
    ...
  }
}
```

**Note:** Operators are automatically set to `active` status and can login immediately.

## ✅ User Request Management

New user registrations are set to `pending` status and require admin approval before they can login.

### Get Pending Users

**Endpoint:** `GET /api/admin/users/pending`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user-id",
      "name": "New User",
      "email": "newuser@example.com",
      "role": "user",
      "status": "pending",
      "createdAt": "2026-02-10T..."
    }
  ],
  "count": 1
}
```

### Approve User

**Endpoint:** `POST /api/admin/users/:id/approve`

**Response:**
```json
{
  "success": true,
  "message": "User approved successfully",
  "data": {
    "id": "user-id",
    "name": "New User",
    "email": "newuser@example.com",
    "status": "active",
    ...
  }
}
```

### Update User Status

**Endpoint:** `PUT /api/admin/users/:id/status`

**Request Body:**
```json
{
  "status": "active"  // or "pending" or "suspended"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User status updated to active",
  "data": { ... }
}
```

**Note:** Admin users cannot be suspended.

## 📊 User Status System

Users can have three statuses:

1. **pending** - New registrations awaiting admin approval
2. **active** - Approved users who can login and use the platform
3. **suspended** - Users who have been suspended by admin

### Status Behavior

- **Pending users**: Cannot login. They receive a message: "Your account is pending approval."
- **Active users**: Can login and use all features normally.
- **Suspended users**: Cannot login. They receive a message: "Your account has been suspended."

## 🔄 Workflow

1. **User Registration**: New users register via `POST /api/auth/register`
   - Status is automatically set to `pending`
   - User cannot login until approved

2. **Admin Approval**: Admin views pending users and approves them
   - `GET /api/admin/users/pending` - View pending users
   - `POST /api/admin/users/:id/approve` - Approve user

3. **User Login**: Once approved, user can login normally
   - Status is now `active`
   - User can access all features

4. **Admin Actions**: Admin can also suspend users if needed
   - `PUT /api/admin/users/:id/status` with `"status": "suspended"`

## 📝 Example API Calls

### Login as Admin

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@admin.com",
    "password": "123456"
  }'
```

### Create Operator

```bash
curl -X POST http://localhost:5000/api/admin/operators \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "QA Operator 2",
    "email": "qa2@platform.com",
    "password": "password123",
    "role": "qa"
  }'
```

### Get Pending Users

```bash
curl -X GET http://localhost:5000/api/admin/users/pending \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Approve User

```bash
curl -X POST http://localhost:5000/api/admin/users/USER_ID/approve \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Suspend User

```bash
curl -X PUT http://localhost:5000/api/admin/users/USER_ID/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "suspended"
  }'
```

