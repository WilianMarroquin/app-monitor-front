<script setup lang="ts">
import type { RolInterface } from '@/types/admin/modulo-usuarios/types'
import { manejaError } from '@/utils/funcionesComunes'
import { SendResponseInterface } from '@/types/generales/types'

const props = defineProps<PropsInterface>()
const { get, post } = useClienteRequest()
const { paginaEspera } = useCargandoPagina()
const { success } = useToast()

interface PropsInterface {
  user_id: string
}

const rolesDisponibles = ref<RolInterface[]>([])
const rolesAsignadoActualmente = ref<RolInterface[]>([])

const getRolesDisponibles = async () => {
  paginaEspera.value = true
  try {
    const respuesta: { data: RolInterface[] } = await get('api/admin/modulo-usuarios/roles/all')
    rolesDisponibles.value = respuesta.data
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

getRolesDisponibles()

const getRolesDeUsuario = async () => {
  paginaEspera.value = true
  try {
    const respuesta: {
      data: RolInterface[]
    } = await get(`api/admin/modulo-usuarios/users/obtener/roles/deUser/${props.user_id}`)
    rolesAsignadoActualmente.value = respuesta.data
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

getRolesDeUsuario()

const actualizarRolSeleccionado = async (rol: RolInterface) => {
  paginaEspera.value = true
  try {
    const res = await post('api/admin/modulo-usuarios/users/asignar/rol/aUser', {
      user_id: props.user_id,
      rol_id: rol.id,
    })

    success(res.message)
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

const quitarRolSeleccionado = async (rol: RolInterface): Promise<void> => {
  try {
    const datosRequest = {
      user_id: props.user_id,
      rol_id: rol.id,
    }

    const res: SendResponseInterface<RolInterface> = await post('api/admin/modulo-usuarios/users/quitar/rol/aUser', datosRequest)

    success(res.message)
  }
  catch (error: any) {
    manejaError(error)
  }
}
</script>

<template>
  <ListasSeleccionables
    :ItemsDisponibles="rolesDisponibles"
    :ItemsSeleccionadas="rolesAsignadoActualmente"
    tipo="Roles"
    @itemAgregada="actualizarRolSeleccionado"
    @itemQuitada="quitarRolSeleccionado"
  />
</template>
