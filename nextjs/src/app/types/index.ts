export type UserRole = 'admin' | 'user' | 'qa';

export type TaskType = 'youtube' | 'social_media' | 'website_visit' | 'survey';

export type TaskStatus = 'new' | 'submitted' | 'approved' | 'rejected';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  totalEarned: number;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  instructions: string;
  type: TaskType;
  points: number;
  active: boolean;
  createdAt: string;
}

export interface Submission {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  taskTitle: string;
  evidence: {
    type: 'image' | 'text' | 'url';
    value: string;
  };
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerComment?: string;
  points: number;
}

export interface ClaimHistory {
  id: string;
  userId: string;
  points: number;
  claimedAt: string;
}
