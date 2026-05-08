<script setup lang="ts">
import Fields from '@/views/pages/incidents/fields.vue'
import type { IncidentInterface } from '@/types/incidents/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'incidents',
  middleware: 'permissions',
  action: 'Crear Incidentes',
  subject: 'Incident',
})

const { post } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const guardarIncident = async (Incident: IncidentInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta = await post<SendResponseInterface<IncidentInterface>>('api/incidents', Incident)

    success(respuesta.message)
    navigateTo('/incidents')
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
    <h1 v-text="'Crear Incident'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/incidents"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>
  </div>

  <VCard>
    <VCardText>
      <Fields @emitir-datos="guardarIncident" />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
