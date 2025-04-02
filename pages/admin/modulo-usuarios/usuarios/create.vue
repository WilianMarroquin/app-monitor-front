<script setup lang="ts">
import Fields from '@/views/pages/admin/modulo-usuarios/usuarios/fields.vue'
import type { UsuarioInterface } from '@/types/admin/modulo-usuarios/types'
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseInterface } from '@/types/generales/types'

definePageMeta({
  navActiveLink: 'admin-modulo-usuarios-usuarios',
  // middleware: 'permissions',
  // action: 'crear usuarios', // Acción requerida
  // subject: 'usuarios',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
})

const { post } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const guardarUser = async (User: UsuarioInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta: SendResponseInterface<UsuarioInterface> = await post('api/admin/modulo-usuarios/users', User)

    success(respuesta.message)
    navigateTo(`/admin/modulo-usuarios/usuarios/edit/${respuesta?.data.id}`)
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
    <h1 v-text="'Crear Usuario'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/admin/modulo-usuarios/usuarios/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>
    <VCardText>
      <Fields @emitirDatos="guardarUser"
      />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
