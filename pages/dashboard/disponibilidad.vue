<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseInterface } from '@/types/generales/types'

definePageMeta({
  action: 'Ver Dashboards',
  subject: 'Dashboard',
})

const { get } = useClienteRequest()

// === ESTADO DE LOS FILTROS ===
const filterServiceId = ref(null)
const filterDateFrom = ref(null)
const filterDateTo = ref(null)

// === ESTADO DEL PAYLOAD (Datos del Backend) ===
const isLoading = ref(true)
const dashboardData = ref({
  period: { start: '', end: '', days: 0 },
  kpis: {
    uptime_percentage: 100,
    total_downtime_minutes: 0,
    mttr_minutes: 0,
    total_incidents: 0,
    open_incidents: 0
  },
  top_offenders: []
})

// === FETCH DATA (Consumo del Endpoint) ===
const fetchAnalytics = async () => {
  try {
    isLoading.value = true

    // Construimos los parámetros para la URL
    const params = new URLSearchParams()
    if (filterServiceId.value) params.append('service_id', filterServiceId.value)
    if (filterDateFrom.value) params.append('fecha_inicio', filterDateFrom.value)
    if (filterDateTo.value) params.append('fecha_fin', filterDateTo.value)

    const respuesta = await get<SendResponseInterface<any>>(`api/analytics/uptime-response?${params.toString()}`)

    if (respuesta.success) {
      dashboardData.value = respuesta.data
    }
  } catch (errorCapturado) {
    manejaError(errorCapturado)
  } finally {
    isLoading.value = false
  }
}

// Cargar datos al iniciar
onMounted(() => {
  fetchAnalytics()
})

const aplicarFiltros = () => {
  fetchAnalytics()
}

const limpiarFiltros = () => {
  filterServiceId.value = null
  filterDateFrom.value = null
  filterDateTo.value = null
  fetchAnalytics()
}
</script>

<template>
  <div class="mb-6">
    <h1 class="text-h4 font-weight-bold mb-2">Disponibilidad y Atención</h1>
    <p class="text-medium-emphasis">Monitoreo de SLAs y tiempos de respuesta del equipo.</p>
  </div>

  <VCard class="mb-6 elevation-1">
    <VCardText>
      <VRow align="center">
        <VCol cols="12" md="4">
          <SelectorPro
            v-model="filterServiceId"
            clearable
            eager
            item-title="name"
            item-value="id"
            label="Filtrar por Servicio"
            url="api/services"
            :campos-a-filtrar="'name'"
            hide-details
          />
        </VCol>
        <VCol cols="12" md="3">
          <VTextField v-model="filterDateFrom" type="date" label="Desde" hide-details clearable />
        </VCol>
        <VCol cols="12" md="3">
          <VTextField v-model="filterDateTo" type="date" label="Hasta" hide-details clearable />
        </VCol>
        <VCol cols="12" md="2" class="d-flex gap-2">
          <VBtn color="primary" block @click="aplicarFiltros" :loading="isLoading">
            <VIcon start icon="ri-search-line" /> Analizar
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <VRow>
    <VCol cols="12" sm="6" md="3">
      <VCard class="h-100 border" :loading="isLoading">
        <VCardText class="d-flex flex-column align-center text-center">
          <VAvatar color="success" variant="tonal" size="50" class="mb-3">
            <VIcon icon="ri-heart-pulse-line" size="30" />
          </VAvatar>
          <div class="text-subtitle-2 text-medium-emphasis text-uppercase font-weight-bold">Uptime Global</div>
          <div class="text-h4 font-weight-bold mt-1 text-success">
            {{ dashboardData.kpis.uptime_percentage }}%
          </div>
          <div class="text-caption mt-1">SLA del periodo seleccionado</div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" sm="6" md="3">
      <VCard class="h-100 border" :loading="isLoading">
        <VCardText class="d-flex flex-column align-center text-center">
          <VAvatar color="error" variant="tonal" size="50" class="mb-3">
            <VIcon icon="ri-timer-flash-line" size="30" />
          </VAvatar>
          <div class="text-subtitle-2 text-medium-emphasis text-uppercase font-weight-bold">Downtime Total</div>
          <div class="text-h4 font-weight-bold mt-1 text-error">
            {{ dashboardData.kpis.total_downtime_minutes }}
          </div>
          <div class="text-caption mt-1">Minutos de inactividad acumulada</div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" sm="6" md="3">
      <VCard class="h-100 border" :loading="isLoading">
        <VCardText class="d-flex flex-column align-center text-center">
          <VAvatar color="warning" variant="tonal" size="50" class="mb-3">
            <VIcon icon="ri-tools-line" size="30" />
          </VAvatar>
          <div class="text-subtitle-2 text-medium-emphasis text-uppercase font-weight-bold">MTTR</div>
          <div class="text-h4 font-weight-bold mt-1 text-warning">
            {{ dashboardData.kpis.mttr_minutes }}
          </div>
          <div class="text-caption mt-1">Minutos promedio para resolver</div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" sm="6" md="3">
      <VCard class="h-100 border" :loading="isLoading">
        <VCardText class="d-flex flex-column align-center text-center">
          <VAvatar color="info" variant="tonal" size="50" class="mb-3">
            <VIcon icon="ri-alert-line" size="30" />
          </VAvatar>
          <div class="text-subtitle-2 text-medium-emphasis text-uppercase font-weight-bold">Tickets Abiertos</div>
          <div class="text-h4 font-weight-bold mt-1 text-info">
            {{ dashboardData.kpis.open_incidents }} <span class="text-h6 text-medium-emphasis">/ {{ dashboardData.kpis.total_incidents }}</span>
          </div>
          <div class="text-caption mt-1">Pendientes vs Total del periodo</div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

</template>

<style scoped lang="scss">
.border {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
