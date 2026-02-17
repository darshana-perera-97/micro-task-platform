import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTasks, mockSubmissions, mockClaimHistory } from '../data/mockData';

import API_URL from '../config/api';

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [claimHistory, setClaimHistory] = useState([]);

  useEffect(() => {
    // Fetch tasks from backend API
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Try user endpoint first (for regular users - returns only active tasks)
          let response = await fetch(`${API_URL}/tasks`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          let tasksData = null;

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              tasksData = data.data;
              console.log('Tasks loaded from /api/tasks:', tasksData.length, 'active tasks');
            }
          } else {
            // If user endpoint fails, try admin endpoint (for admin users - returns all tasks)
            const adminResponse = await fetch(`${API_URL}/admin/tasks`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (adminResponse.ok) {
              const adminData = await adminResponse.json();
              if (adminData.success && adminData.data) {
                tasksData = adminData.data;
                console.log('Tasks loaded from /api/admin/tasks:', tasksData.length, 'total tasks');
              }
            } else {
              const errorData = await adminResponse.json().catch(() => ({}));
              console.error('Failed to fetch tasks from both endpoints:', errorData.message || 'Unknown error');
            }
          }

          if (tasksData) {
            setTasks(tasksData);
            return;
          }
        } else {
          console.warn('No auth token found, using fallback data');
        }
      } catch (error) {
        console.error('Error fetching tasks from backend:', error);
      }

      // Fallback to localStorage or mock data
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        try {
          const parsed = JSON.parse(savedTasks);
          setTasks(parsed);
          console.log('Tasks loaded from localStorage:', parsed.length);
        } catch (e) {
          console.error('Error parsing localStorage tasks:', e);
          setTasks(mockTasks);
        }
      } else {
        setTasks(mockTasks);
        console.log('Using mock tasks data');
      }
    };

    fetchTasks();

    // Fetch submissions from backend API
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Try to fetch from QA endpoint (works for admin too)
          const response = await fetch(`${API_URL}/qa/submissions`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setSubmissions(data.data);
              console.log('Submissions loaded from backend:', data.data.length);
              return;
            }
          }
        }
      } catch (error) {
        console.error('Error fetching submissions from backend:', error);
      }

      // Fallback to localStorage or mock data
      const savedSubmissions = localStorage.getItem('submissions');
      setSubmissions(savedSubmissions ? JSON.parse(savedSubmissions) : mockSubmissions);
    };

    fetchSubmissions();

    // Load other data from localStorage or use mock data
    const savedClaims = localStorage.getItem('claimHistory');
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

  const addTask = async (task) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        // Fallback to local storage if no token
        const newTask = {
          ...task,
          id: `task-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        setTasks(prev => [...prev, newTask]);
        return;
      }

      const response = await fetch(`${API_URL}/admin/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Task saved to backend successfully, refresh tasks from backend
        const refreshResponse = await fetch(`${API_URL}/admin/tasks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success && refreshData.data) {
            setTasks(refreshData.data);
            console.log('Tasks refreshed from backend:', refreshData.data.length);
          }
        } else {
          // Fallback: add to local state
          setTasks(prev => [...prev, data.data]);
        }
        console.log('Task saved to backend:', data.data);
      } else {
        console.error('Failed to save task to backend:', data.message);
        // Fallback to local storage on error
        const newTask = {
          ...task,
          id: `task-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        setTasks(prev => [...prev, newTask]);
      }
    } catch (error) {
      console.error('Error saving task to backend:', error);
      // Fallback to local storage on error
      const newTask = {
        ...task,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [...prev, newTask]);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        // Fallback to local state if no token
        setTasks(prev => prev.map(task => 
          task.id === id ? { ...task, ...updates } : task
        ));
        return;
      }

      const response = await fetch(`${API_URL}/admin/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Task updated successfully, refresh tasks from backend
        const refreshResponse = await fetch(`${API_URL}/admin/tasks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success && refreshData.data) {
            setTasks(refreshData.data);
            console.log('Tasks refreshed from backend after update');
          }
        } else {
          // Fallback: update local state
          setTasks(prev => prev.map(task => 
            task.id === id ? { ...task, ...updates } : task
          ));
        }
      } else {
        console.error('Failed to update task:', data.message);
        // Fallback: update local state
        setTasks(prev => prev.map(task => 
          task.id === id ? { ...task, ...updates } : task
        ));
      }
    } catch (error) {
      console.error('Error updating task:', error);
      // Fallback: update local state
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ));
    }
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addSubmission = async (submission) => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Send to backend API
        const response = await fetch(`${API_URL}/submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            taskId: submission.taskId,
            evidence: submission.evidence,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Check if submission already exists before adding (prevent duplicates)
            setSubmissions(prev => {
              const exists = prev.some(sub => 
                sub.taskId === data.data.taskId && 
                sub.userId === data.data.userId
              );
              if (exists) {
                console.warn('Submission already exists, not adding duplicate');
                return prev;
              }
              const updated = [...prev, data.data];
              // Save to localStorage
              localStorage.setItem('submissions', JSON.stringify(updated));
              return updated;
            });
            console.log('Submission saved to backend:', data.data);
            return data.data;
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Failed to save submission to backend:', errorData.message || 'Unknown error');
          // If it's a duplicate submission error, don't add to local state
          if (errorData.message && errorData.message.includes('already submitted')) {
            throw new Error(errorData.message);
          }
          throw new Error(errorData.message || 'Failed to submit task');
        }
      }
    } catch (error) {
      console.error('Error saving submission to backend:', error);
      // DO NOT add to local state if it's a duplicate submission error
      // Only throw the error to let component handle it
      throw error;
    }
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

