import capitalize from 'lodash/capitalize'

export function getValidationResult<T>(data: T, schema: any) {
  try {
    schema.validateSync(data, { abortEarly: false, allowUnknown: true })
    return {
      errors: {},
      isValid: true,
    }
  } catch (err) {
    const errors = err.inner.reduce((acc: any, el: any) => {
      const { path, message } = el
      acc[path] = message
      return acc
    }, {})
    return { isValid: false, errors }
  }
}

export function fieldIsRequired(params: any) {
  const { label, path } = params
  const display =
    label ||
    path
      .split('.')
      .pop()
      .split('_')
      .filter((e: any) => e !== 'id')
      .map(capitalize)
      .join(' ')
  return `${display} is required`
}

export function fieldIsInvalid(params: any) {
  const { label, path } = params
  const display =
    label ||
    path
      .split('.')
      .pop()
      .split('_')
      .filter((e: any) => e !== 'id')
      .map(capitalize)
      .join(' ')
  return `${display} is required`
}