<script setup lang="ts">
import type { PermisoInterface, RolInterface } from '@/types/admin/modulo-usuarios/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'
import Fields from '@/views/pages/admin/modulo-usuarios/roles/fields.vue'

definePageMeta({
  navActiveLink: 'admin-modulo-usuarios-roles',
  middleware: 'permissions',
  action: 'Editar Roles',
  subject: 'Rol',
})

const { put, get } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params.id
const permisosDisponibles = ref<PermisoInterface[]>([])
const permisosSeleccionados = ref<PermisoInterface[]>([])

const itemRol = ref<RolInterface>({
  name: '',
  guard_name: '',
})

const actualizarRol = async (Rol: RolInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const dataRequest = {
      ...Rol,
      permisos: permisosSeleccionados.value.map((permiso) => permiso.id),
    }

    const respuesta = await put(`api/admin/modulo-usuarios/roles/${id}`, dataRequest)

    success(respuesta.message)
    navigateTo('/admin/modulo-usuarios/roles')
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

const getRol = async () => {
  paginaEspera.value = true
  try {
    const respuesta: SendResponseInterface<RolInterface> = await get(`api/admin/modulo-usuarios/roles/${id}/`)
    itemRol.value = respuesta.data
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

getRol()

const getPermisos = async (): Promise<void> => {
  try {
    const res = await get('api/admin/modulo-usuarios/permissions/all')
    permisosDisponibles.value = res.data
  }
  catch (error: any) {
    manejaError(error)
  }
}

getPermisos()

const getPermisosActualesRol = async (): Promise<void> => {
  try {
    const res: SendResponseInterface<PermisoInterface> = await get(`api/admin/modulo-usuarios/roles/obtener/permisos/asignados/${id}`)
    permisosSeleccionados.value = res.data
  }
  catch (error: any) {
    manejaError(error)
  }
}

getPermisosActualesRol()
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Editar Rol'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/admin/modulo-usuarios/roles/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>
    <VCardText>
      <Fields :item="itemRol"
              @emitirDatos="actualizarRol"
              :permisosDisponibles="permisosDisponibles"
              v-model:permisosSeleccionados="permisosSeleccionados"
      />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
