export interface MenuOpcionInterface {
  id?: number | null
  titulo: string | null
  titulo_seccion: string | null
  icono: string | null
  ruta: string | null
  orden?: number | null
  action: string | null
  subject: string | null
  parent_id: number | null
  children?: MenuOpcionInterface[] | []
}

export interface ConfiguracionInterface {
  id?: number
  key: string | null
  value: string | null
  descripcion: string | null
  created_at?: string | null
  updated_at?: string | null
  deleted_at?: string | null
}

export interface ConfiguracionGeneralInterface {
  nombre_aplicacion: string
  email_aplicacion: string
  telefono_aplicacion: string
  eslogan_aplicacion: string
  fondo_login_tema_oscuro: File[]
  fondo_login_tema_claro: File[]
  logo: File[]
}
