import { useState } from 'react'
import omit from 'lodash/omit'

type FormErrors = {
  [key: string]: string
}
type FormValid = {
  isValid: boolean
  errors?: FormErrors
}

type CustomChangeHandler<T> = {
  [key: string]: (val: any, fields: T) => Partial<T>
}

export type UseFormParams<T> = {
  initialFields: T | (() => T)
  onValid?(arg: T): void
  validator?(arg0: T): FormValid
  customChangeHandler?: CustomChangeHandler<T>
}

export type FormState<T> = {
  fields: T
  errors: FormErrors
}

export type FormHandlers = {
  onChange: (key: string, value: any) => void
  onElementChange: (value: any, e: any) => void | undefined
  onValidate: () => void
  onReset: () => void
  onSetError: (errors: FormErrors) => void
}

export default function useForm<S>(params: UseFormParams<S>) {
  const {
    initialFields,
    validator = (): FormValid => ({ isValid: true, errors: {} }),
    customChangeHandler = {},
    onValid = () => {},
  } = params
  const [fields, setFields] = useState<S>(initialFields)
  const [errors, setErrors] = useState<FormErrors>({})
  function onElementChange(e: React.FormEvent<HTMLInputElement>): void | undefined {
    let id = ''
    let value: string | number = ''
    if (e.target) {
      const target = e.target as HTMLInputElement
      id = target.id || target.name || ''
      value = target.value
      if (target?.type === 'number' && !Number.isNaN(Number(value))) {
        value = Number(value)
      }
    }
    if (id) {
      onChange(id, value)
    }
  }

  function onSetForm(data: S) {
    setFields(data)
  }

  function onSetError(errors: FormErrors) {
    setErrors(errors)
  }

  return [
    {
      fields,
      errors,
    },
    {
      onElementChange,
      onChange,
      onValidate,
      onReset,
      onSetForm,
      onSetError,
    },
  ] as const
  function onChange(key: string, value: any): void {
    const customHandler = customChangeHandler[key]

    if (customHandler) {
      setFields(oldFields => {
        const changes = customHandler(value, oldFields)
        if (changes) {
          return { ...oldFields, ...changes }
        }
        return oldFields
      })
      return
    }
    setErrors(omit(errors, key))
    setFields(oldFields => ({ ...oldFields, [key]: value }))
  }

  function onValidate(): void {
    const { isValid, errors: validationErrors = {} } = validator(fields)
    if (isValid) {
      setErrors({})
      onValid(fields)
      return
    }
    setErrors(validationErrors)
  }
  function onReset() {
    setErrors({})
    setFields(initialFields)
  }
}
