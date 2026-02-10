# Task & Reward Points Platform - Application Structure

## 📁 Project Structure

```
src/app/
├── App.tsx                          # Main application component with routing
├── types/
│   └── index.ts                     # TypeScript interfaces and types
├── data/
│   └── mockData.ts                  # Mock data for demo purposes
├── context/
│   ├── AuthContext.tsx              # Authentication state management
│   └── DataContext.tsx              # Application data state management
└── components/
    ├── auth/
    │   └── LoginPage.tsx            # Login screen with quick access
    ├── layout/
    │   ├── Navbar.tsx               # Top navigation bar
    │   └── Sidebar.tsx              # Role-based sidebar navigation
    ├── user/                        # User role components
    │   ├── UserDashboard.tsx        # User dashboard with stats
    │   ├── TaskList.tsx             # Available tasks grid
    │   ├── TaskDetailsModal.tsx     # Task details and submission form
    │   ├── SubmissionsList.tsx      # User's submission history
    │   ├── PointsRewards.tsx        # Points tracking and claim rewards
    │   └── UserProfile.tsx          # User profile and statistics
    ├── qa/                          # QA Lead role components
    │   ├── QADashboard.tsx          # QA overview dashboard
    │   ├── PendingReviews.tsx       # Review pending submissions
    │   └── ReviewedSubmissions.tsx  # Approved/rejected submissions
    └── admin/                       # Admin role components
        ├── AdminDashboard.tsx       # Admin overview dashboard
        ├── TaskManagement.tsx       # Manage all tasks
        ├── CreateTaskModal.tsx      # Create new tasks
        ├── UserManagement.tsx       # View and manage users
        └── AllSubmissions.tsx       # View all submissions with filters
```

## 🎯 Key Features by Role

### 👤 User Role
- **Dashboard**: View stats, points progress, and recent activity
- **Tasks**: Browse and view available tasks
- **Submit**: Complete tasks by providing evidence (image, URL, or text)
- **Track**: Monitor submission status (pending, approved, rejected)
- **Rewards**: Claim rewards when reaching 100 points
- **Profile**: View personal statistics and history

### 🔍 QA Lead Role
- **Dashboard**: Overview of review statistics
- **Pending Reviews**: Review and approve/reject submissions
- **Approved/Rejected**: View history of reviewed submissions
- **Comments**: Add feedback comments to submissions

### ⚙️ Admin Role
- **Dashboard**: Platform overview with key metrics
- **Task Management**: Create, edit, activate/deactivate, and delete tasks
- **User Management**: View all users and their statistics
- **Submissions**: Monitor all submissions with status filters
- **Analytics**: Track platform performance and user engagement

## 🔧 Technical Implementation

### State Management
- **Context API**: Used for global state (Auth & Data)
- **LocalStorage**: Persists data across browser sessions
- **Mock Data**: Simulates backend API responses

### Data Flow
1. User authenticates → `AuthContext` stores user info
2. Data loads from localStorage or mock data → `DataContext`
3. Components consume context via hooks (`useAuth`, `useData`)
4. User actions update context state
5. State changes persist to localStorage

### Task Types
- **YouTube**: Subscribe to channels, watch videos
- **Social Media**: Follow, like, share on social platforms
- **Website Visit**: Visit partner sites, sign up for newsletters
- **Survey**: Complete feedback forms and surveys

### Evidence Types
- **Image**: Screenshot uploads (file name/description)
- **URL**: Direct links to completed actions
- **Text**: Confirmation codes, descriptions, or text proof

### Points System
- Users earn points by completing tasks
- Points accumulate in user account
- Users can claim rewards when reaching 100 points
- Claimed points are deducted from current balance
- Total earned points tracked separately

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563eb) - Main actions, points
- **Success**: Green (#16a34a) - Approved, positive actions
- **Warning**: Orange (#ea580c) - Pending, needs attention
- **Danger**: Red (#dc2626) - Rejected, errors
- **Secondary**: Gray - Neutral elements

### Components
- Built with shadcn/ui components
- Consistent spacing and rounded corners
- Responsive grid layouts
- Clean card-based design

## 🚀 Getting Started

1. Open the application
2. Use Quick Login buttons on login screen
3. Explore features based on your role
4. All data persists in browser localStorage
5. Clear localStorage to reset to initial state

## 📝 Notes

- This is a demo application with mock data
- No real backend or database connection
- Password validation is simplified for demo
- Data resets when localStorage is cleared
- All features are fully functional within the frontend
