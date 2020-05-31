import { createContext } from 'react'
import { User } from '../model/login'

export default createContext<User | null>(null)
