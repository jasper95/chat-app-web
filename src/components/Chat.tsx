import React, { useState, useEffect, useContext } from 'react'
import socketIOClient from "socket.io-client";
import cn from 'classnames'
import MessageList from './MessageList'
import MessageBox from './MessageBox'
import useMutation from '../shared/hooks/useMutation'
import SocketContext from '../context/SocketContext';
import AuthContext from '../context/AuthContext';

type ChatProps = {
  onLogout():void,
}
function Chat(props: ChatProps) {
  const [logoutState,onMutate] = useMutation({ url: '/auth/logout'})
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null)
  const user = useContext(AuthContext)
  useEffect(() => {
    const conn = socketIOClient(process.env.REACT_APP_SOCKET_URL || '');
    setSocket(conn)
    conn.emit('joinUser',{
      username: user?.username,
      user_id: user?.id
    })
  }, [])
  return (
    <>
      <div className='header'>
        <div className="wrapper">
          Chat App
          <button onClick={handleLogout} className={cn('btn btn-danger logout', { processing: logoutState.loading})}>
            <span className='text'>Logout</span>
          </button>
        </div>
      </div>
      <div className='mainContainer'>
        <div className='chatbox'>
          <SocketContext.Provider value={socket}>
            <MessageList/>
            <MessageBox/>
          </SocketContext.Provider>
        </div>
      </div>
    </>
  )

  function handleLogout() {
    onMutate({ onSuccess: props.onLogout})
  }
}

export default Chat