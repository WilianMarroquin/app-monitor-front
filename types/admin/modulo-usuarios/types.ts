export interface RolInterface {
  id?: number
  name: string | null
  guard_name: string | null
}

export interface PermisoInterface {
  id?: number | null
  name: string | null
  subject: string | null
  guard_name: string | null
}

export interface UsuarioInterface {
  id?: number
  primer_nombre: string | null
  segundo_nombre: string | null
  primer_apellido: string | null
  segundo_apellido: string | null
  nombre_completo: string | null
  usuario: string | null
  email: string | null
  roles?: RolInterface[] | null
  permisos?: PermisoInterface[] | null
  password?: string | null
  password_confirmation?: string | null
}
