import axios from 'axios'
import { apiBase } from './constants.js'

export const req = axios.create({
  baseURL: apiBase,
  validateStatus: () => true
})

req.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (config.headers.Authorization === undefined && token) {
    config.headers.Authorization = `token ${token}`
  }
  return config
})
