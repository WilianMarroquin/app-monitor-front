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

export function validaSiExisteDato(dado: string): boolean {
  return dado !== undefined && dado !== null && dado !== ''
}

export function traducirTipoATipoTypeScript(tsTipo: string): string {
  switch (tsTipo.toLowerCase()) {
    case 'integer':
    case 'bigint':
    case 'int':
    case 'decimal':
    case 'float':
    case 'double':
      return 'number'

    case 'bit':
    case 'boolean':
      return 'boolean'
    case 'date':
    case 'datetime':
    case 'timestamp':
    case 'string':
    case 'varchar':
    case 'text':
    default:
      return 'string'
  }
}
