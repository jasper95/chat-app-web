import axios, { AxiosRequestConfig, AxiosError } from 'axios'

const baseURL = '/api'
const axiosInstance = axios.create({
  baseURL,
})

axiosInstance.interceptors.request.use(
  function(config: AxiosRequestConfig) {
    config.headers['Authorization'] = `Basic ${Buffer.from(
      `${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`,
    ).toString('base64')}`
    return config
  },
  (err: Error) => {
    return Promise.reject(err)
  },
)

axiosInstance.interceptors.response.use(
  function(response) {
    return response.data
  },
  function(error: AxiosError) {
    // Do something with response error
    return Promise.reject(error)
  },
)

export default axiosInstance
