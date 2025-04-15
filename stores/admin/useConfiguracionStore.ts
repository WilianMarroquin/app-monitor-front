import { useClienteRequest } from '@/composables/useClienteRequest'
import type { ConfiguracionGeneralInterface } from '@/types/admin/configuraciones/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'
import { defineStore } from 'pinia'

export const useConfiguracionStore = defineStore('configuracion', () => {
  const configuracionesGenerales = ref<ConfiguracionGeneralInterface>({
    nombre_aplicacion: '',
    email_aplicacion: '',
    telefono_aplicacion: '',
    eslogan_aplicacion: '',
    fondo_login_tema_oscuro: [],
    fondo_login_tema_claro: [],
    logo: [],
  })

  const { get } = useClienteRequest()
  const { paginaEspera } = useCargandoPagina()
  const { success } = useToast()

  const cargarGenerales = async (): Promise<void> => {
    paginaEspera.value = true
    try {
      const res: SendResponseInterface<ConfiguracionGeneralInterface> = await get('api/libres/configuraciones/generales')

      if (res.data)
        configuracionesGenerales.value = res.data
    }
    catch (e) {
      manejaError(e)
    }
    finally {
      paginaEspera.value = false
    }
  }

  const guardarGenerales = async (datos: Record<string, any>): Promise<void> => {
    try {
      const { post } = useClienteRequest()
      const res: SendResponseInterface<ConfiguracionGeneralInterface> = await post('api/admin/configuraciones/generales/guardar', datos)

      if (res?.data)
        configuracionesGenerales.value = res.data

      success(res.message)
    }
    catch (error) {
      manejaError(error)
    }
  }

  return {
    configuracionesGenerales,
    cargarGenerales,
    guardarGenerales,
  }
})
