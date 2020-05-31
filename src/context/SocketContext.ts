import { createContext } from 'react'

export default createContext<SocketIOClient.Socket | null>(null)
