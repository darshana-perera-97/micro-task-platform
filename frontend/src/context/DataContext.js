import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTasks, mockSubmissions, mockClaimHistory } from '../data/mockData';

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [claimHistory, setClaimHistory] = useState([]);

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

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addSubmission = (submission) => {
    const newSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    setSubmissions(prev => [...prev, newSubmission]);
  };

  const updateSubmission = (id, updates) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, ...updates } : sub
    ));
  };

  const addClaim = (userId, points) => {
    const newClaim = {
      id: `claim-${Date.now()}`,
      userId,
      points,
      claimedAt: new Date().toISOString(),
    };
    setClaimHistory(prev => [...prev, newClaim]);
  };

  const getUserSubmissions = (userId) => {
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

