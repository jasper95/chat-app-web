import React from 'react'
import cn from 'classnames'
import useForm from '../shared/hooks/useForm'
import { getValidationResult } from '../shared/utils/tools'
import { LoginSchema, loginSchema } from '../model/login'
import useMutation from '../shared/hooks/useMutation'

const initialFields = {
  username: '',
  password: ''
}
type LoginProps = {
  onLogin(): void
}
function Login(props: LoginProps) {
  const [formState, formHandlers] = useForm({ initialFields, validator , onValid })
  const [loginState,onMutate] = useMutation({ url: '/auth/login' })
  const { fields } = formState
  return (
    <>
      <div className='header'>
        <div className="wrapper">
          Chat App
        </div>
      </div>
      <div className='mainContainer'>
        <div className='login'>
          <div className="wrapper">
            <form className='form' onSubmit={onSubmit}>
              <input className='input' placeholder='Username' name='username' value={fields.username} onChange={formHandlers.onElementChange}/>
              <input className='input' placeholder='Password' name='password' value={fields.password} type='password' onChange={formHandlers.onElementChange}/>
              <button onClick={onSubmit} className={cn('btn btn-primary', {processing: loginState.loading})}>
                <span className='text'>Login/Signup</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    formHandlers.onValidate()
  }

  function onValid() {
    onMutate({ data: fields, onSuccess: props.onLogin })
  }
}

function validator(data: LoginSchema) {
  return getValidationResult(data, loginSchema)
}




export default Login