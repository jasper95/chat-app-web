import * as yup from 'yup'
import { fieldIsRequired } from '../shared/utils/tools'

export const messageSchema =  yup.object().shape({
  text: yup.string().required(fieldIsRequired),
  sender: yup.string().notRequired(),
  id: yup.string().notRequired(),
})

export type Message = yup.InferType<typeof messageSchema>