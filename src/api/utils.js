export function transformToParamsString(params) {
  if (typeof params !== 'object' || params === null || Array.isArray(params)) return ''
  let paramsString = '?'
  Object.keys(params).map((key) => {
    paramsString +=
      params[key] !== null && params[key] !== undefined && params[key] !== ''
        ? `${key}=${params[key]}&`
        : ''
  })
  paramsString = paramsString.slice(0, -1)
  paramsString = encodeURI(paramsString)
  paramsString = paramsString.replace(/#/g, '%23')
  paramsString = paramsString.replace(/\[/g, '%5B')
  paramsString = paramsString.replace(/\]/g, '%5D')
  return paramsString
}

export function getCodeResponse(error) {
  if (typeof error === 'object') {
    if (Object.keys(error).length === 0) {
      error = -2 //Error de sintaxis
    } else {
      let isAboutSession =
        !!error.message &&
        (error.message.toLowerCase().includes('network') ||
          error.message.toLowerCase().includes('red'))
      error = error.response
        ? error.response.status
        : isAboutSession
          ? 405 // Error de sesión
          : -1
    }
  } else {
    error = -1
  }
  return error
}

export function isFormData(v) {return typeof FormData !== 'undefined' && v instanceof FormData;}
 
