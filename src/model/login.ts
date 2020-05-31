import * as yup from 'yup'
import { fieldIsRequired } from '../shared/utils/tools'

export const loginSchema =  yup.object().shape({
  username: yup.string().required(fieldIsRequired),
  password: yup.string().required(fieldIsRequired),
})

export type LoginSchema = yup.InferType<typeof loginSchema>

export type User = {
  username: string
  id: string
}