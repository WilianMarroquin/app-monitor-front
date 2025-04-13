// models/Configuracion.ts

export class Configuracion {
  id?: number
  key: string
  value: string
  descripcion: string
  created_at?: string | null
  updated_at?: string | null
  deleted_at?: string | null

  constructor(data: Partial<Configuracion> = {}) {
    this.id = data.id
    this.key = data.key || ''
    this.value = data.value || ''
    this.descripcion = data.descripcion || ''
    this.created_at = data.created_at || null
    this.updated_at = data.updated_at || null
    this.deleted_at = data.deleted_at || null
  }

  /**
   * Convierte la instancia a un objeto plano
   * útil para enviar en peticiones HTTP.
   */
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      key: this.key,
      value: this.value,
      descripcion: this.descripcion,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    }
  }

  /**
   * Indica si esta configuración fue eliminada
   */
  get estaEliminada(): boolean {
    return !!this.deleted_at
  }
}
