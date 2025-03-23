<script setup lang="ts">
import Fields from '@/views/pages/roles/fields.vue'
import type { RolInterface } from '@/types/admin/modulo-usuarios/types'
import { manejaError } from '@/utils/funcionesComunes'

// definePageMeta({
//   middleware: 'permissions',
//   action: 'crear roles', // Acción requerida
//   subject: 'roles',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
// })

const { post } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const guardarRol = async (Rol: RolInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta: { message: string } = await post('api/admin/modulo-usuarios/roles', Rol)

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
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Crear Rol'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/roles/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>
    <VCardText>
      <Fields :fields="fields"
              @emitirDatos="guardarRol"
      />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
