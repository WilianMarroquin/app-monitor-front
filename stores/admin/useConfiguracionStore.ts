import { useClienteRequest } from '@/composables/useClienteRequest'
import { Configuracion } from '@/models/admin/Configuracion'
import type { ConfiguracionGeneralInterface } from '@/types/admin/configuraciones/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'
import { defineStore } from 'pinia'

export const useConfiguracionStore = defineStore('configuracion', () => {
  const configuraciones = ref<Configuracion[]>([])
  const configuracionesGenerales = ref<ConfiguracionGeneralInterface>({
    nombre_aplicacion: '',
    email_aplicacion: '',
    telefono_aplicacion: '',
    eslogan_aplicacion: '',
    fondoLoginOscuro: '',
    fondoLoginClaro: '',
  })

  const { get } = useClienteRequest()
  const { paginaEspera } = useCargandoPagina()
  const { success } = useToast()

  const cargarTodas = async () => {
    paginaEspera.value = true
    try {
      const res = await get('/api/configuraciones/generales')

      configuraciones.value = res.map((c: any) => new Configuracion(c))
    }
    catch (e) {
      manejaError(e)
    }
    finally {
      paginaEspera.value = false
    }
  }

  const cargarGenerales = async () => {
    paginaEspera.value = true
    try {
      const res = await get('api/libres/configuraciones/generales')

      configuracionesGenerales.value = res.data
    }
    catch (e) {
      manejaError(e)
    }
    finally {
      paginaEspera.value = false
    }
  }

  const obtener = (key: string): Configuracion | undefined => {
    return configuraciones.value.find(c => c.key === key)
  }

  const guardarGenerales = async (datos: Record<string, any>): Promise<void> => {
    try {
      const { post } = useClienteRequest()
      const res: SendResponseInterface<any> = await post('api/admin/configuraciones/generales/guardar', datos)

      if (res?.data)
        configuracionesGenerales.value = res.data.map((c: any) => new Configuracion(c))

      success(res.message)
    }
    catch (error) {
      manejaError(error)
    }
  }

  return {
    configuraciones,
    configuracionesGenerales,
    cargarTodas,
    obtener,
    cargarGenerales,
    guardarGenerales,
  }
})
