import React, { useContext, useCallback } from 'react'
import AuthContext from '../context/AuthContext'
import SocketContext from '../context/SocketContext'
import useForm from '../shared/hooks/useForm'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

function MessageBox() {
  const user = useContext(AuthContext)
  const socket = useContext(SocketContext)
  const [formState, formHandlers]= useForm({
    initialFields: { text: '', user_id: user?.id },
    onValid
  })
  const { fields } = formState
  const throttleType = useCallback(throttle(onType, 1000), [socket])
  const debounceStop = useCallback(debounce(stopType, 2000), [socket])
  return (
    <div className='chatbox-input'>
      <form className='form' onSubmit={onSubmit}>
        <input className='input' name='text' onKeyPress={throttleType} onKeyUp={debounceStop} placeholder='Type your message here...' value={fields.text} onChange={formHandlers.onElementChange} />
        <button className='btn btn-primary' onClick={onSubmit}>
          <span className='text'>Send</span>
        </button>
      </form>
    </div>
  )

  function onType() {
    socket?.emit('typing')
  }

  function stopType() {
    socket?.emit('stopTyping')
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    formHandlers.onValidate()
  }


  function onValid() {
    socket?.emit('newMessage', fields, formHandlers.onReset)
  }
}
export default MessageBox