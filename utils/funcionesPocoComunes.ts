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
