import axios from 'axios'
import axiosRetry from 'axios-retry'
import merge from 'lodash/merge'

// axios instead of fetch for timeouts, retries, and cancellations

const apiAxios = axios.create({
  baseURL: process.env.MY_APP_API_URL,
  timeout: 3000,
  withCredentials: true
})

axiosRetry(apiAxios, {retries: 3})

export default function api (config) {
  const cookie = config.req
    ? config.req.headers.cookie
    : (typeof window !== 'undefined' && window.document.cookie)

  delete config.req

  const _headers = merge(config.headers || {}, {cookie})

  return apiAxios(merge(config, {headers: _headers}))
}
