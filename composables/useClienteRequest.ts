export const useClienteRequest = () => {
  const config = useRuntimeConfig()
  const event = useRequestEvent()

  const baseURL = config.public.apiBase || 'http://localhost:8000'

  const contieneArchivo = (data: any): boolean => {
    if (!data || typeof data !== 'object')
      return false

    return Object.values(data).some(val =>
      val instanceof File
      || val instanceof Blob
      || (Array.isArray(val) && val.some(v => v instanceof File || v instanceof Blob)))
  }

  const convertirAFormData = (data: any, form: FormData = new FormData(), parentKey = ''): FormData => {
    for (const key in data) {
      const value = data[key]
      const formKey = parentKey ? `${parentKey}.${key}` : key

      if (value instanceof File || value instanceof Blob) {
        form.append(formKey, value, value.name)
      }
      else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        convertirAFormData(value, form, formKey)
      }
      else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof File || item instanceof Blob) {
            form.append(`${formKey}[${index}]`, item, item.name)
          }
          else{
            convertirAFormData(item, form, `${formKey}[${index}]`)
          }
        })
      }
      else if (value !== undefined && value !== null) {
        form.append(formKey, value.toString())
      }
    }

    return form
  }

  const request = async <T>(
    url: string,
    method: string,
    body: any = null,
    headers: Record<string, any> = {},
  ): Promise<T> => {
    const tieneArchivo = contieneArchivo(body)
    const isFormData = body instanceof FormData || tieneArchivo

    const opts: any = {
      method,
      baseURL,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
    }

    if (body) {
      opts.body = isFormData
        ? body instanceof FormData
          ? body
          : convertirAFormData(body)
        : JSON.stringify(body)
    }

    if (process.server && event?.node?.req?.headers?.cookie) {
      opts.headers.cookie = event.node.req.headers.cookie
    }

    // 👉 Agrega el XSRF-TOKEN desde cookie
    if (process.client) {
      const token = useCookie('XSRF-TOKEN').value
      if (token) {
        opts.headers['X-XSRF-TOKEN'] = decodeURIComponent(token)
      }
    }

    try {
      return await $fetch<T>(url, opts)
    }
    catch (error: any) {
      console.error('❌ Error en petición HTTP:', error?.data || error)
      const statusCode = error?.status || error?.response?.status || error?.statusCode

      if (statusCode === 401 || statusCode === 419) {
        const { user } = useSanctumAuth()
        user.value = null
        if (process.client) {
          navigateTo('/login')
        }
      }

      throw error?.data || error
    }
  }

  const buildQuery = (params: Record<string, any>) => {
    const query = new URLSearchParams()
    for (const key in params) {
      const value = params[key]
      if (value === undefined || value === null) continue
      if (Array.isArray(value))
        value.forEach(val => query.append(key, val))

      else
        query.append(key, value)
    }

    return query.toString()
  }

  return {
    get: <T>(url: string, params: Record<string, any> = {}, headers = {}): Promise<T> => {
      const query = buildQuery(params)
      const fullUrl = query ? `${url}?${query}` : url

      return request(fullUrl, 'GET', null, headers)
    },
    post: <T>(url: string, body: any, headers = {}): Promise<T> => request(url, 'POST', body, headers),
    put: <T>(url: string, body: any, headers = {}): Promise<T> => request(url, 'PUT', body, headers),
    del: <T>(url: string, headers = {}): Promise<T> => request(url, 'DELETE', null, headers),
  }
}
