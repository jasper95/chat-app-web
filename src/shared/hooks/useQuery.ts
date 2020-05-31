import { useState, useEffect } from 'react'
import axiosLib, { AxiosRequestConfig } from 'axios'
import axios from '../utils/axios'

export interface UseQueryOptions<T> {
  initialData: T | (() => T)
  isBase?: boolean
  skip?: boolean
  onFetchSuccess?: (data: T) => void
}

export interface UseQueryState<T> {
  data: T
  loading: boolean
  error: Error | undefined
}

export interface UseQueryHandlers {
  refetch: () => void
}

function useQuery<T>(config: AxiosRequestConfig, options: UseQueryOptions<T>) {
  const { initialData, isBase = false, skip = false, onFetchSuccess = () => {} } = options
  const { url } = config
  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error>()
  const [refetchCount, setRefetchCount] = useState(0)
  useEffect(() => {
    const source = axiosLib.CancelToken.source()
    const fetchData = () => {
      setIsLoading(true)
      axios({
        ...config,
        url: [isBase && 'base', url].filter(Boolean).join(''),
        cancelToken: source.token,
      })
        .then((response: any) => {
          setData(response)
          setError(undefined)
          setIsLoading(false)
          onFetchSuccess(response)
        })
        .catch(error => {
          if (!axiosLib.isCancel(error)) {
            setError(error)
          }
          setIsLoading(false)
        })
    }
    if (!skip) {
      fetchData()
    } else {
      setIsLoading(false)
    }
    return () => {
      source.cancel()
    }
  }, [url, isBase, refetchCount])
  const queryState: UseQueryState<T> = { data, loading: isLoading, error }
  return [queryState, { refetch }] as const

  function refetch() {
    setRefetchCount(prev => prev + 1)
  }
}

export default useQuery
