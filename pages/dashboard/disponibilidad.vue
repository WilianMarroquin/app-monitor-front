<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseInterface } from '@/types/generales/types'

// IMPORTANTE: Importamos el componente de gráficos
import VueApexCharts from 'vue3-apexcharts'

definePageMeta({
  action: 'Ver Dashboards',
  subject: 'Dashboard',
})

const { get } = useClienteRequest()
import { useTheme } from 'vuetify'

const filterServiceId = ref(null)
const filterDateFrom = ref(null)
const filterDateTo = ref(null)
const isLoading = ref(true)
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

const dashboardData = ref({
  period: { start: '', end: '', days: 0 },
  kpis: {
    uptime_percentage: 100,
    total_downtime_minutes: 0,
    mttr_minutes: 0,
    total_incidents: 0,
    open_incidents: 0,
    alert_fatigue: 0 // <-- Añadido
  },
  top_offenders: [],
  trend_data: [] // <-- Añadido
})

const trendSeries = computed(() => [{
  name: 'Incidentes Registrados',
  data: dashboardData.value.trend_data.map((item: any) => item.total_outages)
}])

const trendOptions = computed(() => ({
  theme: { mode: isDark.value ? 'dark' : 'light' }, // <-- THEME AWARENESS
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'inherit',
    zoom: { enabled: false },
    background: 'transparent' // <-- Fondo transparente
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  xaxis: {
    type: 'datetime',
    categories: dashboardData.value.trend_data.map((item: any) => item.date)
  },
  yaxis: {
    labels: { formatter: (val: number) => val.toFixed(0) }
  },
  colors: ['#673AB7'],
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.1, stops: [0, 90, 100] }
  },
  tooltip: {
    theme: isDark.value ? 'dark' : 'light', // <-- Tooltip en modo oscuro
    x: { format: 'dd MMM yyyy' }
  }
}))

const fetchAnalytics = async () => {
  try {
    isLoading.value = true
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

onMounted(() => fetchAnalytics())
const aplicarFiltros = () => fetchAnalytics()
const limpiarFiltros = () => {
  filterServiceId.value = null
  filterDateFrom.value = null
  filterDateTo.value = null
  fetchAnalytics()
}

// ==========================================
// 📊 CONFIGURACIÓN DE GRÁFICOS (DataViz)
// ==========================================

// 1. Gráfico de Barras: Top 5 Servicios con más Downtime
const offendersSeries = computed(() => [{
  name: 'Minutos Caídos',
  data: dashboardData.value.top_offenders.map((item: any) => item.total_downtime)
}])

const offendersOptions = computed(() => ({
  theme: { mode: isDark.value ? 'dark' : 'light' }, // <-- THEME AWARENESS
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit',
    background: 'transparent' // <-- Fondo transparente
  },
  plotOptions: { bar: { borderRadius: 4, horizontal: true } },
  dataLabels: { enabled: false },
  xaxis: { categories: dashboardData.value.top_offenders.map((item: any) => item.service?.name || 'Desconocido') },
  colors: ['#F44336'],
  title: { text: 'Servicios con Mayor Inactividad', align: 'left' } // <-- Quitamos el color quemado (#666)
}))

// 2. Gráfico de Dono: Proporción de Resolución
const ticketsSeries = computed(() => {
  const open = dashboardData.value.kpis.open_incidents
  const resolved = dashboardData.value.kpis.total_incidents - open
  return [resolved, open]
})

const ticketsOptions = computed(() => ({
  theme: { mode: isDark.value ? 'dark' : 'light' }, // <-- THEME AWARENESS
  chart: {
    type: 'donut',
    fontFamily: 'inherit',
    background: 'transparent' // <-- Fondo transparente
  },
  labels: ['Resueltos', 'Pendientes'],
  colors: ['#4CAF50', '#FF9800'],
  dataLabels: { enabled: true },
  plotOptions: { pie: { donut: { size: '70%' } } },
  legend: { position: 'bottom' }
}))
</script>

<template>
  <div class="mb-6">
    <h1 class="text-h4 font-weight-bold mb-2">Disponibilidad y Atención</h1>
    <p class="text-medium-emphasis">Monitoreo de SLAs y métricas operativas del equipo.</p>
  </div>

  <VCard class="mb-6 elevation-1">
    <VCardText>
      <VRow align="center">
        <VCol cols="12" md="4">
          <SelectorPro v-model="filterServiceId" clearable eager item-title="name" item-value="id" label="Filtrar por Servicio" url="api/services" :campos-a-filtrar="'name'" hide-details />
        </VCol>
        <VCol cols="12" md="3"><VTextField v-model="filterDateFrom" type="date" label="Desde" hide-details clearable /></VCol>
        <VCol cols="12" md="3"><VTextField v-model="filterDateTo" type="date" label="Hasta" hide-details clearable /></VCol>
        <VCol cols="12" md="2" class="d-flex gap-2">
          <VBtn color="primary" block @click="aplicarFiltros" :loading="isLoading"><VIcon start icon="ri-search-line" /> Analizar</VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <div class="d-flex align-center mb-4 mt-8">
    <VIcon icon="ri-server-line" size="x-large" color="primary" class="mr-2" />
    <h2 class="text-h5 font-weight-bold">Estado General de Infraestructura</h2>
  </div>
  <VDivider class="mb-6" />

  <VRow>
    <VCol cols="12" md="4" class="d-flex flex-column gap-4">
      <VCard class="border flex-grow-1 d-flex flex-column justify-center" :loading="isLoading">
        <VCardText class="d-flex align-center">
          <VAvatar color="success" variant="tonal" size="64" class="mr-4"><VIcon icon="ri-heart-pulse-line" size="36" /></VAvatar>
          <div>
            <div class="text-subtitle-2 text-medium-emphasis text-uppercase font-weight-bold">Uptime Global</div>
            <div class="text-h3 font-weight-bold text-success">{{ dashboardData.kpis.uptime_percentage }}%</div>
          </div>
        </VCardText>
      </VCard>

      <VCard class="border flex-grow-1 d-flex flex-column justify-center" :loading="isLoading">
        <VCardText class="d-flex align-center">
          <VAvatar color="error" variant="tonal" size="64" class="mr-4"><VIcon icon="ri-timer-flash-line" size="36" /></VAvatar>
          <div>
            <div class="text-subtitle-2 text-medium-emphasis text-uppercase font-weight-bold">Downtime Total</div>
            <div class="text-h3 font-weight-bold text-error">{{ dashboardData.kpis.total_downtime_minutes }} <span class="text-h6">min</span></div>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="8">
      <VCard class="h-100 border" :loading="isLoading">
        <VCardText v-if="!isLoading && dashboardData.top_offenders.length > 0">
          <ClientOnly>
            <VueApexCharts type="bar" height="250" :options="offendersOptions" :series="offendersSeries" />
          </ClientOnly>
        </VCardText>
        <VCardText v-else class="h-100 d-flex align-center justify-center text-medium-emphasis">
          No hay caídas registradas en este periodo.
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <div class="d-flex align-center mb-4 mt-10">
    <VIcon icon="ri-team-line" size="x-large" color="secondary" class="mr-2" />
    <h2 class="text-h5 font-weight-bold">Rendimiento de Recuperación</h2>
  </div>
  <VDivider class="mb-6" />

  <VRow>
    <VCol cols="12" md="4" class="d-flex flex-column gap-4">
      <VCard class="border flex-grow-1 d-flex flex-column justify-center" :loading="isLoading">
        <VCardText class="d-flex align-center">
          <VAvatar color="warning" variant="tonal" size="64" class="mr-4"><VIcon icon="ri-tools-line" size="36" /></VAvatar>
          <div>
            <div class="text-subtitle-2 text-medium-emphasis text-uppercase font-weight-bold">MTTR (Tiempo Medio)</div>
            <div class="text-h3 font-weight-bold text-warning">{{ dashboardData.kpis.mttr_minutes }} <span class="text-h6">min</span></div>
          </div>
        </VCardText>
      </VCard>

      <VCard class="border flex-grow-1 d-flex flex-column justify-center" :loading="isLoading">
        <VCardText class="d-flex align-center">
          <VAvatar color="info" variant="tonal" size="64" class="mr-4"><VIcon icon="ri-alert-line" size="36" /></VAvatar>
          <div>
            <div class="text-subtitle-2 text-medium-emphasis text-uppercase font-weight-bold">Tickets Abiertos</div>
            <div class="text-h3 font-weight-bold text-info">{{ dashboardData.kpis.open_incidents }} <span class="text-h6">/ {{ dashboardData.kpis.total_incidents }}</span></div>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="8">
      <VCard class="h-100 border d-flex flex-column" :loading="isLoading">
        <VCardTitle class="text-subtitle-1 font-weight-bold pt-4 px-4 text-medium-emphasis">Volumen de Resolución</VCardTitle>
        <VCardText class="flex-grow-1 d-flex align-center justify-center">
          <ClientOnly>
            <VueApexCharts v-if="dashboardData.kpis.total_incidents > 0" type="donut" width="380" :options="ticketsOptions" :series="ticketsSeries" />
            <div v-else class="text-medium-emphasis">No hay tickets generados en este periodo.</div>
          </ClientOnly>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  <div class="d-flex align-center mb-4 mt-10">
    <VIcon icon="ri-line-chart-line" size="x-large" color="purple" class="mr-2" />
    <h2 class="text-h5 font-weight-bold">Análisis de Estabilidad y Tendencias</h2>
  </div>
  <VDivider class="mb-6" />

  <VRow>
    <VCol cols="12" md="3">
      <VCard class="h-100 border d-flex flex-column justify-center" :loading="isLoading">
        <VCardText class="d-flex flex-column align-center text-center">
          <VAvatar color="purple" variant="tonal" size="64" class="mb-4">
            <VIcon icon="ri-notification-badge-line" size="36" />
          </VAvatar>
          <div class="text-subtitle-2 text-medium-emphasis text-uppercase font-weight-bold">Fatiga de Alertas</div>
          <div class="text-h3 font-weight-bold text-purple my-2">
            {{ dashboardData.kpis.alert_fatigue }}
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Caídas (flapping) menores a 3 minutos que generan "ruido" al equipo.
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="9">
      <VCard class="h-100 border" :loading="isLoading">
        <VCardTitle class="text-subtitle-1 font-weight-bold pt-4 px-4 text-medium-emphasis">
          Evolución de Incidentes a lo largo del tiempo
        </VCardTitle>
        <VCardText v-if="!isLoading && dashboardData.trend_data.length > 0">
          <ClientOnly>
            <VueApexCharts
              type="area"
              height="280"
              :options="trendOptions"
              :series="trendSeries"
            />
          </ClientOnly>
        </VCardText>
        <VCardText v-else class="h-100 d-flex align-center justify-center text-medium-emphasis">
          No hay datos de tendencia disponibles para el periodo seleccionado.
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style scoped lang="scss">
.border {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.gap-4 {
  gap: 16px;
}
</style>
