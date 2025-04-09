<script setup lang="ts">
import type { ConfiguracionInterface } from '@/types/admin/configuraciones/types'
import { manejaError } from '@/utils/funcionesComunes'
import Fields from '@/views/pages/admin/configuraciones/configuraciones/fields.vue'

// definePageMeta({
//   middleware: 'permissions',
//   action: 'crear configuraciones', // Acción requerida
//   subject: 'configuraciones',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
// })

const { post } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const guardarConfiguracion = async (Configuracion: ConfiguracionInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta: { message: string } = await post('api/admin/configuraciones/generales', Configuracion)

    success(respuesta.message)
    navigateTo('/admin/configuraciones/generales')
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
    <h1 v-text="'Crear Configuracion'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/admin/configuraciones/generales/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>
    <VCardText>
      <Fields
        @emitirDatos="guardarConfiguracion"
      />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
