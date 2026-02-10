// User roles
export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  QA: 'qa'
};

// Task types
export const TaskType = {
  YOUTUBE: 'youtube',
  SOCIAL_MEDIA: 'social_media',
  WEBSITE_VISIT: 'website_visit',
  SURVEY: 'survey'
};

// Task status
export const TaskStatus = {
  NEW: 'new',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Submission status
export const SubmissionStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// User interface
export const createUser = (data) => ({
  id: data.id,
  name: data.name,
  email: data.email,
  role: data.role,
  points: data.points || 0,
  totalEarned: data.totalEarned || 0,
  avatar: data.avatar
});

// Task interface
export const createTask = (data) => ({
  id: data.id,
  title: data.title,
  description: data.description,
  instructions: data.instructions,
  type: data.type,
  points: data.points,
  active: data.active !== undefined ? data.active : true,
  createdAt: data.createdAt
});

// Submission interface
export const createSubmission = (data) => ({
  id: data.id,
  taskId: data.taskId,
  userId: data.userId,
  userName: data.userName,
  taskTitle: data.taskTitle,
  evidence: data.evidence,
  status: data.status,
  submittedAt: data.submittedAt,
  reviewedAt: data.reviewedAt,
  reviewerComment: data.reviewerComment,
  points: data.points
});

// Claim History interface
export const createClaimHistory = (data) => ({
  id: data.id,
  userId: data.userId,
  points: data.points,
  claimedAt: data.claimedAt
});

