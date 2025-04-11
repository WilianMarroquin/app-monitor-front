export const useClienteRequest = () => {
  const config = useRuntimeConfig()
  const event = useRequestEvent()
  const token = useCookie('token') // Cambia el nombre si tu token está en otra cookie

  const baseURL = config.public.apiBase || 'http://localhost:8000'

  const request = async (
    url: string,
    method: string,
    body: any = null,
    headers: Record<string, any> = {}
  ) => {
    const opts: any = {
      method,
      baseURL,
      credentials: 'include', // incluye cookies
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    }

    if (body) {
      opts.body = body
    }

    // Si estás en SSR, añade las cookies manualmente
    if (process.server && event?.node?.req?.headers?.cookie) {
      opts.headers.cookie = event.node.req.headers.cookie
    }

    // Si hay token, añadir Authorization
    if (token.value) {
      opts.headers.Authorization = `Bearer ${token.value}`
    }

    try {
      const response = await $fetch(url, opts)
      return response
    } catch (error: any) {
      console.error('❌ Error en petición HTTP:', error?.data || error)
      throw error?.data || error
    }
  }

  const buildQuery = (params: Record<string, any>) => {
    const query = new URLSearchParams()

    for (const key in params) {
      const value = params[key]
      if (value === undefined || value === null) continue
      if (Array.isArray(value)) {
        value.forEach(val => query.append(key, val))
      } else {
        query.append(key, value)
      }
    }

    return query.toString()
  }

  return {
    get: (url: string, params: Record<string, any> = {}, headers = {}) => {
      const query = buildQuery(params)
      const fullUrl = query ? `${url}?${query}` : url
      return request(fullUrl, 'GET', null, headers)
    },
    post: (url: string, body: any, headers = {}) => request(url, 'POST', body, headers),
    put: (url: string, body: any, headers = {}) => request(url, 'PUT', body, headers),
    del: (url: string, headers = {}) => request(url, 'DELETE', null, headers),
  }
}
