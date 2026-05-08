<script setup lang="ts">
import Fields from '@/views/pages/incidents/fields.vue'
import type { IncidentInterface } from '@/types/incidents/types'
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseInterface } from '@/types/generales/types'

definePageMeta({
  navActiveLink: 'incidents',
  middleware: 'permissions',
  action: 'Editar Incidentes',
  subject: 'Incident',
})

const { put, get } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params.id

const actualizarIncident = async (Incident: IncidentInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta = await put<SendResponseInterface<IncidentInterface>>(`api/incidents/${id}/`, Incident)

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

const itemIncident = ref<IncidentInterface>(
{ description: null,
status: null,
opened_at: null,
resolved_at: null,
service_id: null,
ping_id: null }
)

const getIncident = async () => {
  paginaEspera.value = true
  try {
    const respuesta = await get<SendResponseInterface<IncidentInterface>>(`api/incidents/${id}/`)
    itemIncident.value = respuesta.data
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

getIncident()

const puedeMostrarDatos = computed(() => {
  return Object.values(itemIncident .value).some(valor => valor !== null && valor !== undefined)
})
</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Editar Incident'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/incidents/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>
    <VCardText>
      <Fields
        v-if="puedeMostrarDatos"
        :item="itemIncident"
        @emitir-datos="actualizarIncident"
      />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
