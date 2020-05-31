import { useState, ReactNode } from 'react'
import capitalize from 'lodash/capitalize'
import axios from '../utils/axios'
import { AxiosResponse, AxiosError } from 'axios'

interface MutationParams {
  data?: any
  method?: 'POST' | 'PUT' | 'DELETE'
  onSuccess?: Function
  hideDialog?: boolean
  message?: string | ReactNode
  onMessageDismiss?(): void
  url: string
  isBase?: boolean
}

interface NodeMutation extends Omit<MutationParams, 'url'> {
  id?: string
  node: string
}

export type MutationFunctionType = (params?: Omit<MutationParams, 'url'>) => Promise<AxiosResponse<any>>

export default function useMutation(params: MutationParams) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState()
  const [error, setError] = useState()

  const state = {
    loading,
    data,
    error,
  }

  return [state, mutate] as const
  async function mutate(params2: Omit<MutationParams, 'url'> = {}) {
    setLoading(true)
    const allParams = { ...params, ...params2 }
    const {
      data: body,
      method = 'POST',
      onSuccess = () => {},
      isBase = false,
    } = allParams
    let { url } = allParams
    url = [url, ['delete', 'put'].includes(method.toLowerCase()) && body.id].filter(Boolean).join('/')
    url = [isBase && 'base', url].filter(Boolean).join('')
    const response: any = await axios({
      data: body,
      method,
      url,
    }).catch((err: AxiosError) => {
      setError(err.response?.data)
      return { error: err.response?.data }
    })
    setLoading(false)
    if (response && !response.error) {
      setData(response)
      onSuccess(response)
    }
    return response
  }
}

export function useCreateNode(params: NodeMutation) {
  const { node, message = `${capitalize(node)} successfully created`, isBase = true } = params
  return useMutation({
    message,
    method: 'POST',
    url: `/${node}`,
    isBase,
    ...params,
  })
}

export function useUpdateNode(params: NodeMutation) {
  const { node, message = `${capitalize(node)} successfully updated` } = params
  return useMutation({
    message,
    method: 'PUT',
    url: `/${node}`,
    isBase: true,
    ...params,
  })
}

export function useDeleteNode(params: NodeMutation) {
  const { node, message = `${capitalize(node)} successfully deleted`, id } = params
  return useMutation({
    message,
    method: 'DELETE',
    url: `/${node}`,
    isBase: true,
    ...params,
  })
}
