<script setup lang="ts">
import Fields from '@/views/pages/permissiones/fields.vue'
import type { PermisoInterface } from '@/types/admin/modulo-usuarios/types'
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'admin-modulo-usuarios-permisos',
  // middleware: 'permissions',
  // action: 'crear permisos', // Acción requerida
  // subject: 'permisos',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
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
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Crear Permission'"/>
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
      <Fields @emitirDatos="guardarPermission"
      />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
