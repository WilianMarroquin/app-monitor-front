<script setup lang="ts">
import Fields from '@/views/pages/admin/modulo-usuarios/usuario-estados/fields.vue'
import type { UserEstadoInterface } from '@/types/admin/modulo-usuarios/types'
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'admin-modulo-usuarios-usuario-estados',
  middleware: 'permissions',
  action: 'Crear Usuario Estados',
  subject: 'UserEstado',
})

const { post } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const guardarUserEstado = async (UserEstado: UserEstadoInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta: { message: string } = await post('api/admin/modulo-usuarios/users/estados', UserEstado)

    success(respuesta.message)
    navigateTo('/admin/modulo-usuarios/usuario-estados')
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
    <h1 v-text="'Crear Estado de Usuario'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/admin/modulo-usuarios/usuario-estados/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>
    <VCardText>
      <Fields @emitir-datos="guardarUserEstado"/>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
