<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseInterface } from '@/types/generales/types'
import { useTheme } from 'vuetify'

definePageMeta({
  action: 'Ver Dashboards',
  subject: 'Dashboard',
})

const { get } = useClienteRequest()
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

// === ESTADO DE LOS FILTROS ===
const filterDateFrom = ref(null)
const filterDateTo = ref(null)
const isLoading = ref(true)

// === ESTADO DEL PAYLOAD ===
const dashboardData = ref({
  heatmap: [],
  engine_status: {
    is_active: false,
    last_ping_human: 'Cargando...'
  },
  distribution_by_type: [],
  duration_ranges: {
    'Micro (< 5 min)': 0,
    'Media (5-30 min)': 0,
    'Crítica (> 30 min)': 0
  }
})

// === FETCH DATA ===
const fetchPatterns = async () => {
  try {
    isLoading.value = true
    const params = new URLSearchParams()
    if (filterDateFrom.value) params.append('fecha_inicio', filterDateFrom.value)
    if (filterDateTo.value) params.append('fecha_fin', filterDateTo.value)

    const respuesta = await get<SendResponseInterface<any>>(`api/analytics/failure-patterns?${params.toString()}`)

    if (respuesta.success) {
      dashboardData.value = respuesta.data
    }
  } catch (errorCapturado) {
    manejaError(errorCapturado)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchPatterns())
const aplicarFiltros = () => fetchPatterns()
const limpiarFiltros = () => {
  filterDateFrom.value = null
  filterDateTo.value = null
  fetchPatterns()
}

// ==========================================
// 📊 CONFIGURACIÓN DE GRÁFICOS (DataViz)
// ==========================================

// 1. MAPA DE CALOR (Heatmap) - Data Wrangling
const heatmapSeries = computed(() => {
  // Mapeamos los días como los devuelve MySQL (1=Domingo, 7=Sábado)
  const daysMap: Record<number, string> = {
    1: 'Domingo', 2: 'Lunes', 3: 'Martes', 4: 'Miércoles', 5: 'Jueves', 6: 'Viernes', 7: 'Sábado'
  }

  const series = []

  // Rellenamos la cuadrícula de 7 días x 24 horas (incluso si hay 0 errores)
  for (let d = 1; d <= 7; d++) {
    const dataRow = []
    for (let h = 0; h < 24; h++) {
      // Buscamos si el backend reportó un error para este día y hora exactos
      const found = dashboardData.value.heatmap.find((item: any) => item.day_of_week === d && item.hour_of_day === h)
      dataRow.push({
        x: `${h.toString().padStart(2, '0')}:00`, // Ej: "09:00"
        y: found ? found.total : 0
      })
    }
    series.push({ name: daysMap[d], data: dataRow })
  }

  return series
})

const heatmapOptions = computed(() => ({
  theme: { mode: isDark.value ? 'dark' : 'light' },
  chart: { type: 'heatmap', toolbar: { show: false }, fontFamily: 'inherit', background: 'transparent' },
  dataLabels: { enabled: false },
  colors: ['#F44336'], // Rojo de peligro
  title: { text: 'Concentración de Incidentes', align: 'center' },
  plotOptions: {
    heatmap: {
      shadeIntensity: 0.5,
      radius: 4,
      colorScale: {
        ranges: [
          { from: 0, to: 0, color: isDark.value ? '#333333' : '#F3F4F6', name: 'Sin incidentes' },
          { from: 1, to: 2, color: '#FFBABA', name: 'Bajo' },
          { from: 3, to: 5, color: '#FF5252', name: 'Medio' },
          { from: 6, to: 100, color: '#900C3F', name: 'Alto/Crítico' }
        ]
      }
    }
  }
}))

// 2. GRÁFICO DE DONO: Distribución por Tipo
const typeSeries = computed(() => {
  return dashboardData.value.distribution_by_type.map((item: any) => item.total_outages)
})

const typeOptions = computed(() => ({
  theme: { mode: isDark.value ? 'dark' : 'light' },
  chart: { type: 'donut', fontFamily: 'inherit', background: 'transparent' },
  labels: dashboardData.value.distribution_by_type.map((item: any) => item.service_type.toUpperCase()),
  colors: ['#2196F3', '#9C27B0', '#00BCD4'],
  plotOptions: { pie: { donut: { size: '65%' } } },
  legend: { position: 'bottom' }
}))

// 3. GRÁFICO DE BARRAS: Rangos de Duración
const durationSeries = computed(() => [{
  name: 'Cantidad de Incidentes',
  data: Object.values(dashboardData.value.duration_ranges)
}])

const durationOptions = computed(() => ({
  theme: { mode: isDark.value ? 'dark' : 'light' },
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit', background: 'transparent' },
  plotOptions: { bar: { borderRadius: 4, distributed: true } }, // Distributed para tener colores distintos
  dataLabels: { enabled: true },
  xaxis: { categories: Object.keys(dashboardData.value.duration_ranges) },
  colors: ['#4CAF50', '#FF9800', '#F44336'], // Verde (Micro), Naranja (Medio), Rojo (Crítico)
  legend: { show: false }
}))
</script>

<template>
  <div class="mb-6 d-flex flex-wrap justify-space-between align-center mb-4 gap-4">
    <div>
      <h1 class="text-h4 font-weight-bold mb-2">Patrones de Fallos (RCA)</h1>
      <p class="text-medium-emphasis">Análisis forense para predecir caídas y ubicar cuellos de botella en la infraestructura.</p>
    </div>

    <div class="d-flex align-center gap-4">
      <VChip
        v-if="!isLoading"
        :color="dashboardData.engine_status.is_active ? 'success' : 'error'"
        variant="outlined"
        size="large"
        class="font-weight-medium"
      >
        <VIcon
          start
          :icon="dashboardData.engine_status.is_active ? 'ri-pulse-line' : 'ri-cloud-off-line'"
          :class="dashboardData.engine_status.is_active ? 'pulse-animation' : ''"
        />
        Monitor: {{ dashboardData.engine_status.is_active ? 'En línea' : 'Detenido' }}
        <span class="text-caption ml-1 opacity-70">({{ dashboardData.engine_status.last_ping_human }})</span>
      </VChip>
    </div>
  </div>

  <VCard class="mb-6 elevation-1">
    <VCardText>
      <VRow align="center">
        <VCol cols="12" md="4"><VTextField v-model="filterDateFrom" type="date" label="Desde" hide-details clearable /></VCol>
        <VCol cols="12" md="4"><VTextField v-model="filterDateTo" type="date" label="Hasta" hide-details clearable /></VCol>
        <VCol cols="12" md="4" class="d-flex gap-2 justify-end">
          <VBtn v-if="filterDateFrom || filterDateTo" variant="tonal" color="error" @click="limpiarFiltros">
            Limpiar
          </VBtn>
          <VBtn color="primary" @click="aplicarFiltros" :loading="isLoading">
            <VIcon start icon="ri-search-line" /> Analizar
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <VCard class="mb-6 border" :loading="isLoading">
    <VCardTitle class="text-subtitle-1 font-weight-bold pt-4 px-4">
      <VIcon icon="ri-fire-line" color="error" class="mr-2" />
      Mapa de Calor de Incidentes (Días vs Horas)
    </VCardTitle>
    <VCardText>
      <ClientOnly>
        <VueApexCharts type="heatmap" height="350" :options="heatmapOptions" :series="heatmapSeries" />
      </ClientOnly>
    </VCardText>
  </VCard>

  <VRow>
    <VCol cols="12" md="5">
      <VCard class="h-100 border" :loading="isLoading">
        <VCardTitle class="text-subtitle-1 font-weight-bold pt-4 px-4">
          <VIcon icon="ri-pie-chart-line" color="info" class="mr-2" />
          Fallos por Tipo de Servicio
        </VCardTitle>
        <VCardText class="d-flex justify-center align-center h-100 pb-6">
          <ClientOnly>
            <VueApexCharts
              v-if="typeSeries.length > 0"
              type="donut"
              width="350"
              :options="typeOptions"
              :series="typeSeries"
            />
            <div v-else class="text-medium-emphasis">No hay datos suficientes.</div>
          </ClientOnly>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="7">
      <VCard class="h-100 border" :loading="isLoading">
        <VCardTitle class="text-subtitle-1 font-weight-bold pt-4 px-4">
          <VIcon icon="ri-bar-chart-box-line" color="warning" class="mr-2" />
          Clasificación por Duración
        </VCardTitle>
        <VCardText>
          <ClientOnly>
            <VueApexCharts type="bar" height="280" :options="durationOptions" :series="durationSeries" />
          </ClientOnly>
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
