import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
})

const MAX_REQUESTS_COUNT = 1
const INTERVAL_MS = 10
let PENDING_REQUESTS = 0

api.interceptors.request.use((req) => {
  if (req.method === 'post' && req.url === '/api/individual-goals') {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
          PENDING_REQUESTS++
          clearInterval(interval)
          resolve(req)
        }
      }, INTERVAL_MS)
    })
  } else {
    return req
  }
})

api.interceptors.response.use(
  (res) => {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1)
    return Promise.resolve(res)
  },
  function (error) {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1)
    return Promise.reject(error)
  },
)
