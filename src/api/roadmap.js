import api from './axios'

export const generateRoadmap = () => api.post('/roadmap/generate')
export const getRoadmap = () => api.get('/roadmap')
export const updateGoalStatus = (goalId) => api.patch(`/roadmap/goals/${goalId}`)
