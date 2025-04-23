<script setup lang="ts">
import type { PermisoInterface } from '@/types/admin/modulo-usuarios/types'
import { manejaError } from '@/utils/funcionesComunes'
import Fields from '@/views/pages/admin/modulo-usuarios/permisos/fields.vue'

definePageMeta({
  navActiveLink: 'admin-modulo-usuarios-permisos',
  middleware: 'permissions',
  action: 'Crear Permisos',
  subject: 'Permission',
})

const { post } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const guardarPermission = async (Permission: PermisoInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta: { message: string } = await post('api/admin/modulo-usuarios/permissions', Permission)

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
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-4">
    <h1 v-text="'Crear Permiso'"/>
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
      <Fields @emitir-datos="guardarPermission" />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
