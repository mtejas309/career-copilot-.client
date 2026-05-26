import api from './axios'

export const getJobReadiness = () => api.get('/agents/job-readiness')
export const getDailyPlan = () => api.get('/agents/daily-plan')
export const getCareerPath = () => api.get('/agents/career-path')
export const startInterview = () => api.post('/agents/interview/start')
export const evaluateAnswer = (data) => api.post('/agents/interview/evaluate', data)
export const getInterviewSummary = (data) => api.post('/agents/interview/summary', data)
