<script setup lang="ts">
import type { RolInterface } from '@/types/admin/modulo-usuarios/types'
import { manejaError } from '@/utils/funcionesComunes'

const props = defineProps<PropsInterface>()
const { get, post } = useClienteRequest()
const { paginaEspera } = useCargandoPagina()

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
  } catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  } finally {
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
  } catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  } finally {
    paginaEspera.value = false
  }
}

getRolesDeUsuario()

const actualizarPermisoSeleccionados = async (rol: RolInterface) => {

  paginaEspera.value = true
  try {
    await post('api/admin/modulo-usuarios/users/asignar/rol/aUser', {
      user_id: props.user_id,
      rol_id: rol.id,
    })
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}
</script>

<template>
  <ListasSeleccionables
    :items="rolesDisponibles"
    :selected-items="rolesAsignadoActualmente"
    tipo="Roles"
    @update:selected-items="actualizarPermisoSeleccionados"
  />
</template>
