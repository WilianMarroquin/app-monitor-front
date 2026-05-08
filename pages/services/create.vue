<script setup lang="ts">
import Fields from '@/views/pages/services/fields.vue'
import type { ServiceInterface } from '@/types/services/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'services',
  middleware: 'permissions',
  action: 'Crear Services',
  subject: 'Service',
})

const { post } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const guardarService = async (Service: ServiceInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta = await post<SendResponseInterface<ServiceInterface>>('api/services', Service)

    success(respuesta.message)
    navigateTo('/services')
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
    <h1 v-text="'Crear Service'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/services"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>
  </div>

  <VCard>
    <VCardText>
      <Fields @emitir-datos="guardarService" />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
