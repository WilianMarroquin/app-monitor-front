<script setup lang="ts">
import Fields from '@/views/pages/admin/modulo-usuarios/permisos/fields.vue'
import { manejaError } from '@/utils/funcionesComunes'
import type { PermisoInterface } from '@/types/admin/modulo-usuarios/types'
import type { SendResponseInterface } from '@/types/generales/types'

definePageMeta({
  navActiveLink: 'admin-modulo-usuarios-permisos',
  middleware: 'permissions',
  action: 'Editar Permisos',
  subject: 'Permission',
})

const { put, get } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params.id

const actualizarPermission = async (Permission: PermisoInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta: SendResponseInterface<PermisoInterface> = await put(`api/admin/modulo-usuarios/permissions/${id}`, Permission)

    success(respuesta.message)
    navigateTo('/admin/modulo-usuarios/permisos')
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

const itemPermission = ref<PermisoInterface | [] >({
  name: null,
  subject: null,
  guard_name: null,
})

const getPermission = async () => {
  paginaEspera.value = true
  try {
    const respuesta: SendResponseInterface<PermisoInterface> = await get(`api/admin/modulo-usuarios/permissions/${id}/`)

    itemPermission.value = respuesta.data ?? []
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

getPermission()

const puedeMostrarDatos = computed(() => {
  return Object.values(itemPermission.value).some(valor => valor !== null && valor !== undefined)
})
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Editar Permiso'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/admin/modulo-usuarios/permisos"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>
    <VCardText>
      <Fields
        v-if="puedeMostrarDatos"
        :item="itemPermission"
        @emitir-datos="actualizarPermission"
      />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
