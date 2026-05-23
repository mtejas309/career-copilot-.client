import api from './axios'

export const getStats = () => api.get('/admin/stats')
export const getUsers = () => api.get('/admin/users')
export const getUserDetail = (id) => api.get(`/admin/users/${id}`)
export const deleteUser = (id) => api.delete(`/admin/users/${id}`)
export const updateUserRole = (id, role) => api.patch(`/admin/users/${id}/role`, { role })
