import api from './axios'

export const sendMessage = (content) => api.post('/chat/message', { content })
export const getChatHistory = () => api.get('/chat/history')
export const clearChatHistory = () => api.delete('/chat/history')
