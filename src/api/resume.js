import api from './axios'

export const uploadResume = (formData) =>
  api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const getResumeAnalysis = () => api.get('/resume/analysis')
