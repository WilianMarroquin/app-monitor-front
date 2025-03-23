import { useToast } from '@/composables/useToast'

export function manejaError(errorCapturado: any) {
  const { error } = useToast()
  if (errorCapturado.response) {
    const mensaje = errorCapturado.response.data?.message || 'Error del servidor'

    error(mensaje)
  }
  else if (errorCapturado.request) {
    error('No se pudo conectar con el servidor')
  }
  else {
    error(errorCapturado.message || 'Ocurrió un error desconocido')
  }
}
