import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Submission, ClaimHistory } from '../types';
import { mockTasks, mockSubmissions, mockClaimHistory } from '../data/mockData';

interface DataContextType {
  tasks: Task[];
  submissions: Submission[];
  claimHistory: ClaimHistory[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addSubmission: (submission: Omit<Submission, 'id' | 'submittedAt' | 'status'>) => void;
  updateSubmission: (id: string, updates: Partial<Submission>) => void;
  addClaim: (userId: string, points: number) => void;
  getUserSubmissions: (userId: string) => Submission[];
  getPendingSubmissions: () => Submission[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [claimHistory, setClaimHistory] = useState<ClaimHistory[]>([]);

  useEffect(() => {
    // Load data from localStorage or use mock data
    const savedTasks = localStorage.getItem('tasks');
    const savedSubmissions = localStorage.getItem('submissions');
    const savedClaims = localStorage.getItem('claimHistory');

    setTasks(savedTasks ? JSON.parse(savedTasks) : mockTasks);
    setSubmissions(savedSubmissions ? JSON.parse(savedSubmissions) : mockSubmissions);
    setClaimHistory(savedClaims ? JSON.parse(savedClaims) : mockClaimHistory);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever data changes
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('claimHistory', JSON.stringify(claimHistory));
  }, [claimHistory]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addSubmission = (submission: Omit<Submission, 'id' | 'submittedAt' | 'status'>) => {
    const newSubmission: Submission = {
      ...submission,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    setSubmissions(prev => [...prev, newSubmission]);
  };

  const updateSubmission = (id: string, updates: Partial<Submission>) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, ...updates } : sub
    ));
  };

  const addClaim = (userId: string, points: number) => {
    const newClaim: ClaimHistory = {
      id: `claim-${Date.now()}`,
      userId,
      points,
      claimedAt: new Date().toISOString(),
    };
    setClaimHistory(prev => [...prev, newClaim]);
  };

  const getUserSubmissions = (userId: string) => {
    return submissions.filter(sub => sub.userId === userId);
  };

  const getPendingSubmissions = () => {
    return submissions.filter(sub => sub.status === 'pending');
  };

  return (
    <DataContext.Provider value={{
      tasks,
      submissions,
      claimHistory,
      addTask,
      updateTask,
      deleteTask,
      addSubmission,
      updateSubmission,
      addClaim,
      getUserSubmissions,
      getPendingSubmissions,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
