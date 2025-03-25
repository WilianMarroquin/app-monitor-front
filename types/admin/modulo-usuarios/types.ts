export interface RolInterface {
  name: string | null
  guard_name: string | null
}

export interface PermisoInterface {
  name: string | null
  subject: string | null
  guard_name: string | null
}

export interface UsuarioInterface {
  primer_nombre: string
  segundo_nombre: string
  primer_apellido: string
  segundo_apellido: string
  nombre_completo: string
  usuario: string
  email: string
}
