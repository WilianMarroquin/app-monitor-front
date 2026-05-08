<script setup lang="ts">
import { ref, computed } from 'vue'
import type { IncidentInterface } from '@/types/incidents/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'
import { useRoute } from 'vue-router'

definePageMeta({
  navActiveLink: 'incidents',
  middleware: 'permissions',
  action: 'Ver Incidentes',
  subject: 'Incident',
})

const { get } = useClienteRequest()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params.id

// Ampliamos el estado inicial para evitar errores en la consola antes de que cargue la data
const item = ref<any>({
  id: null,
  description: null,
  status: null,
  opened_at: null,
  resolved_at: null,
  service_id: null,
  ping_id: null,
  service: null,
  comentarios: []
})

const getIncident = async () => {
  try {
    paginaEspera.value = true
    const respuesta = await get<SendResponseInterface<any>>(`api/incidents/${id}`)
    item.value = respuesta.data
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
  return item.value.id !== null
})

// === FUNCIÓN PARA FORMATEAR FECHAS (Unix a Legible) ===
const formatDateTime = (timestamp: number | null) => {
  if (!timestamp) return '---'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}
</script>

<template>
  <div class="d-flex flex-wrap justify-space-between align-center mb-6">
    <div>
      <h1 class="text-h4 font-weight-bold">
        Detalle del Incidente <span class="text-primary">#{{ item.id || '...' }}</span>
      </h1>
    </div>
    <VBtn
      color="secondary"
      variant="tonal"
      to="/incidents"
    >
      <VIcon class="mr-2 ri-arrow-left-line"/>
      Regresar
    </VBtn>
  </div>

  <VRow v-if="puedeMostrarDatos">

    <VCol cols="12" md="7" lg="8">
      <VCard class="mb-6 elevation-2 border">

        <VCardItem class="bg-light-primary pb-4">
          <template #title>
            <div class="d-flex justify-space-between align-center">
              <span class="text-h6 font-weight-bold">
                <VIcon icon="ri-server-line" class="mr-2" />
                {{ item.service?.name || 'Servicio Desconocido' }}
              </span>
              <VChip
                :color="item.status === 'open' ? 'error' : 'success'"
                variant="elevated"
                class="font-weight-bold text-uppercase"
              >
                {{ item.status === 'open' ? 'Pendiente' : 'Resuelto' }}
              </VChip>
            </div>
          </template>
        </VCardItem>

        <VDivider />

        <VCardText class="pt-6">
          <VRow class="mb-6 bg-grey-100 rounded pa-2 mx-0">
            <VCol cols="12" sm="6">
              <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold mb-1">Apertura del Incidente</div>
              <div class="d-flex align-center font-weight-medium">
                <VIcon icon="ri-calendar-event-line" size="small" class="mr-2 text-primary" />
                {{ formatDateTime(item.opened_at) }}
              </div>
            </VCol>

            <VCol cols="12" sm="6">
              <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold mb-1">Cierre del Incidente</div>
              <div class="d-flex align-center font-weight-medium">
                <VIcon icon="ri-check-double-line" size="small" class="mr-2 text-success" />
                {{ formatDateTime(item.resolved_at) }}
              </div>
            </VCol>
          </VRow>

          <div class="text-subtitle-1 text-medium-emphasis font-weight-bold mb-2">Descripción de la Alerta:</div>
          <VAlert
            :type="item.status === 'open' ? 'error' : 'warning'"
            variant="tonal"
            icon="ri-alert-line"
            class="text-body-1"
          >
            {{ item.description }}
          </VAlert>

        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="5" lg="4">
      <VCard class="elevation-2 border h-100">
        <VCardItem class="bg-light-secondary pb-3">
          <template #title>
            <span class="text-h6 font-weight-bold">
              <VIcon icon="ri-discuss-line" class="mr-2" />
              Seguimiento
            </span>
          </template>
        </VCardItem>
        <VDivider />

        <VCardText class="pt-5">
          <VTimeline
            v-if="item.comentarios && item.comentarios.length > 0"
            side="end"
            align="start"
            density="compact"
            line-color="grey-300"
          >
            <VTimelineItem
              v-for="comentario in item.comentarios"
              :key="comentario.id"
              dot-color="primary"
              size="small"
              fill-dot
            >
              <div class="d-flex flex-column mb-4">

                <div class="d-flex justify-space-between align-center mb-1">
                  <strong class="text-caption font-weight-bold text-primary d-flex align-center">
                    <VIcon icon="ri-user-smile-line" size="small" class="mr-1" />
                    {{ comentario.user?.nombre_completo || 'Usuario Desconocido' }}
                  </strong>

                  <span class="text-caption text-medium-emphasis">
            {{ formatDateTime(comentario.created_at) }}
          </span>
                </div>

                <div class="text-body-2 bg-grey-50 pa-3 rounded border mt-1">
                  {{ comentario.description }}
                </div>

              </div>
            </VTimelineItem>
          </VTimeline>

          <div v-else class="text-center py-6">
            <VIcon icon="ri-chat-off-line" size="x-large" class="text-grey-lighten-1 mb-2" />
            <div class="text-body-2 text-medium-emphasis">Aún no hay comentarios en este incidente.</div>
          </div>
        </VCardText>
      </VCard>
    </VCol>

  </VRow>
</template>

<style scoped lang="scss">
.border {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.bg-light-primary {
  background-color: rgba(var(--v-theme-primary), 0.05);
}
.bg-light-secondary {
  background-color: rgba(var(--v-theme-secondary), 0.05);
}
.bg-grey-50 {
  background-color: #f9fafb;
}
.bg-grey-100 {
  background-color: #f3f4f6;
}
</style>
