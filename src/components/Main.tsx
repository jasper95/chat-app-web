import React from 'react'

import Login from './Login'
import Chat from './Chat'
import useQuery from '../shared/hooks/useQuery'
import AuthContext from '../context/AuthContext'
import { User } from '../model/login'

function Main() {
  const [{ error, data, loading}, { refetch }] = useQuery<User | null>({ url: '/auth/session'}, { initialData: null})
  if (loading) {
    return (
      <div className='preloader'>
        <span className='spinner'></span>
        <span className='text'>Loading...</span>
      </div>
    )
  }
  if (data && !error) {
    return (
      <AuthContext.Provider value={data}>
        <Chat onLogout={refetch}/>
      </AuthContext.Provider>
    )
  }
  return (
    <Login onLogin={refetch}/>
  )
}
export default Main