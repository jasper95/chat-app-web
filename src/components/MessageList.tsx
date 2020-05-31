import React, { useContext, useState, useEffect, useRef } from 'react'
import { Message } from '../model/message'
import AuthContext from '../context/AuthContext'
import useQuery from '../shared/hooks/useQuery'
import SocketContext from '../context/SocketContext'
import uniq from 'lodash/uniq'
import qs from 'qs'
import cn from 'classnames'


type MessageListProps = {
}

const queryString = qs.stringify({
  sort: [{ column: 'created_date', direction: 'asc' }]
})
function MessageList(props: MessageListProps) {
  const user = useContext(AuthContext)
  const socket = useContext(SocketContext)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [typings, setTypings] = useState<string[]>([])
  const [{ loading }] = useQuery<Message[]>({ url: `/message_view?${queryString}`}, { isBase: true, initialData: [], onFetchSuccess })
  useEffect(() => {
    socket?.on('newMessage', (message: Message) => {
      setMessages(prev => prev.concat([message]))
    })
    socket?.on('typing', (data : { username: string}) => {
      setTypings(prev => uniq(prev.concat([data.username])))
    })
    socket?.on('stopTyping', (data : { username: string}) => {
      setTypings(prev => prev.filter(e => e !== data.username))
    })
  }, [socket])
  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  return (
    <div className='chatbox-messages'>
      {loading && (
        <div className='preloader'>
          <span className='spinner'></span>
          <span className='text'>Loading...</span>
        </div>
      )}
      {messages.map((message) => (
        <div key={message.id} className={cn('message', { me: message.sender === user?.username, others: message.sender !== user?.username })}>
          <span className='text'>{message.text}</span>
          <span className='sender'>{message.sender}</span>
        </div>
      ))}
      {typings.length > 0 && (
        <span className='someone-typing'>{`${typings.join(', ')} typing...`}</span>
      )}
      <div className='bottom' ref={bottomRef}/>
    </div>
  )

  function onFetchSuccess(data: Message[]) {
    setMessages(data)
  }
}
export default MessageList