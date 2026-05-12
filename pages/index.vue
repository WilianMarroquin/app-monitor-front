<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseInterface } from '@/types/generales/types'
import { useTheme } from 'vuetify'

definePageMeta({
  action: 'Ver Dashboard',
  subject: 'Dashboard',
})

const { get } = useClienteRequest()
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

// Estado local exclusivo de este componente, sin estados globales
const isLoading = ref(true)
let pollingInterval: ReturnType<typeof setInterval> | null = null

// Estructura inicial alineada con el Payload del Backend refactorizado
const dashboardData = ref({
  engine_status: {
    is_active: false,
    last_ping_human: 'Cargando...'
  },
  kpis: {
    global_uptime: '0%',
    registered_services: 0,
    operational_services: 0,
    critical_incidents: 0,
    avg_latency: '0ms'
  },
  hot_zone: [],
  system_health: [],
  telemetry: {
    heatmap: [],
    slowest_services: []
  }
})

// === FETCH DATA ===
const fetchDashboard = async (isBackgroundPolling = false) => {
  try {
    if (!isBackgroundPolling) isLoading.value = true

    const respuesta = await get<SendResponseInterface<any>>(`api/analytics/dashboard/summary`)

    if (respuesta.success) {
      dashboardData.value = respuesta.data
    }
  } catch (errorCapturado) {
    manejaError(errorCapturado)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDashboard()
  // Implementamos un 'polling' cada 60 segundos para refrescar en background
  pollingInterval = setInterval(() => fetchDashboard(true), 60000)
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})

// ==========================================
// 📊 CONFIGURACIÓN DE GRÁFICOS (DataViz)
// ==========================================

// 1. MAPA DE CALOR (Heatmap)
const heatmapSeries = computed(() => {
  const daysMap: Record<number, string> = {
    1: 'Dom', 2: 'Lun', 3: 'Mar', 4: 'Mié', 5: 'Jue', 6: 'Vie', 7: 'Sáb'
  }
  const series = []
  const apiHeatmap = dashboardData.value.telemetry?.heatmap || []

  for (let d = 1; d <= 7; d++) {
    const dataRow = []
    for (let h = 0; h < 24; h++) {
      const found = apiHeatmap.find((item: any) => item.day_of_week === d && item.hour_of_day === h)
      dataRow.push({
        x: `${h.toString().padStart(2, '0')}h`,
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
  colors: ['#F44336'],
  title: { text: 'Concentración de Fallos (Últimos 30 días)', align: 'left', style: { fontWeight: 'normal', color: isDark.value ? '#fff' : '#000' } },
  plotOptions: {
    heatmap: {
      shadeIntensity: 0.5,
      radius: 4,
      colorScale: {
        ranges: [
          { from: 0, to: 0, color: isDark.value ? '#2A2A2B' : '#F3F4F6', name: 'Ok' },
          { from: 1, to: 2, color: '#FFBABA', name: 'Bajo' },
          { from: 3, to: 5, color: '#FF5252', name: 'Medio' },
          { from: 6, to: 100, color: '#900C3F', name: 'Crítico' }
        ]
      }
    }
  }
}))

// 2. BARRAS HORIZONTALES: Servicios más lentos (Bottlenecks)
const slowestSeries = computed(() => [{
  name: 'Latencia (ms)',
  data: (dashboardData.value.telemetry?.slowest_services || []).map((s: any) => s.tiempo_espera)
}])

const slowestOptions = computed(() => ({
  theme: { mode: isDark.value ? 'dark' : 'light' },
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit', background: 'transparent' },
  plotOptions: { bar: { borderRadius: 4, horizontal: true, distributed: true } },
  dataLabels: { enabled: true, formatter: (val: number) => `${val} ms` },
  xaxis: {
    categories: (dashboardData.value.telemetry?.slowest_services || []).map((s: any) => s.name),
    labels: { style: { colors: isDark.value ? '#aaa' : '#333' } }
  },
  colors: ['#FF9800', '#FFB74D', '#FFCC80', '#FFE0B2', '#FFF3E0'],
  legend: { show: false }
}))
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-space-between align-center mb-4 gap-4">
      <div>
        <h1 class="text-h4 font-weight-bold mb-1">Centro de Mando</h1>
        <p class="text-medium-emphasis">Single Pane of Glass - Estado global de la infraestructura.</p>
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

        <VBtn color="primary" @click="() => fetchDashboard(false)" :loading="isLoading">
          <VIcon start icon="ri-refresh-line" /> Actualizar
        </VBtn>
      </div>
    </div>

    <VRow class="mb-4">
      <VCol cols="12" sm="6" lg>
        <VCard class="border elevation-0 h-100" :loading="isLoading">
          <VCardText class="d-flex align-center justify-space-between h-100">
            <div>
              <div class="text-overline text-medium-emphasis">Global Uptime</div>
              <div class="text-h4 font-weight-black text-primary">{{ dashboardData.kpis.global_uptime }}</div>
            </div>
            <VAvatar color="primary" variant="tonal" rounded size="54">
              <VIcon icon="ri-percent-line" size="32" />
            </VAvatar>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" lg>
        <VCard class="border elevation-0 h-100" :loading="isLoading">
          <VCardText class="d-flex align-center justify-space-between h-100">
            <div>
              <div class="text-overline text-medium-emphasis">Registrados</div>
              <div class="text-h4 font-weight-black text-grey-darken-2">{{ dashboardData.kpis.registered_services }}</div>
            </div>
            <VAvatar color="grey" variant="tonal" rounded size="54">
              <VIcon icon="ri-server-line" size="32" />
            </VAvatar>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" lg>
        <VCard class="border elevation-0 h-100" :loading="isLoading">
          <VCardText class="d-flex align-center justify-space-between h-100">
            <div>
              <div class="text-overline text-medium-emphasis">Activos</div>
              <div class="text-h4 font-weight-black text-success">{{ dashboardData.kpis.operational_services }}</div>
            </div>
            <VAvatar color="success" variant="tonal" rounded size="54">
              <VIcon icon="ri-check-line" size="32" />
            </VAvatar>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" lg>
        <VCard class="border elevation-0 h-100" :loading="isLoading" :color="dashboardData.kpis.critical_incidents > 0 ? 'error' : ''" :variant="dashboardData.kpis.critical_incidents > 0 ? 'tonal' : 'elevated'">
          <VCardText class="d-flex align-center justify-space-between h-100">
            <div>
              <div class="text-overline" :class="dashboardData.kpis.critical_incidents > 0 ? 'text-error' : 'text-medium-emphasis'">Caídos</div>
              <div class="text-h4 font-weight-black" :class="dashboardData.kpis.critical_incidents > 0 ? 'text-error' : 'text-success'">
                {{ dashboardData.kpis.critical_incidents }}
              </div>
            </div>
            <VAvatar :color="dashboardData.kpis.critical_incidents > 0 ? 'error' : 'success'" variant="tonal" rounded size="54">
              <VIcon :icon="dashboardData.kpis.critical_incidents > 0 ? 'ri-alarm-warning-line' : 'ri-check-double-line'" size="32" />
            </VAvatar>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" lg>
        <VCard class="border elevation-0 h-100" :loading="isLoading">
          <VCardText class="d-flex align-center justify-space-between h-100">
            <div>
              <div class="text-overline text-medium-emphasis">Latencia Avg</div>
              <div class="text-h4 font-weight-black text-warning">{{ dashboardData.kpis.avg_latency }}</div>
            </div>
            <VAvatar color="warning" variant="tonal" rounded size="54">
              <VIcon icon="ri-speed-up-line" size="32" />
            </VAvatar>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VCard class="mb-6 border" :loading="isLoading">

      <template v-if="dashboardData.hot_zone.length > 0">
        <VCardTitle class="text-subtitle-1 font-weight-bold pt-4 px-4 text-error">
          <VIcon icon="ri-alert-fill" class="mr-2" />
          Zona Caliente (Incidentes sin resolver)
        </VCardTitle>

        <VTable density="comfortable" class="text-no-wrap">
          <thead>
          <tr>
            <th class="text-uppercase">Servicio</th>
            <th class="text-uppercase">Área</th>
            <th class="text-uppercase">Tipo</th>
            <th class="text-uppercase">Tiempo Caído</th>
            <th class="text-uppercase">Último Error</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="inc in dashboardData.hot_zone" :key="inc.id">
            <td class="font-weight-medium text-error">{{ inc.service_name }}</td>
            <td><VChip size="small" variant="tonal">{{ inc.area }}</VChip></td>
            <td><VIcon :icon="inc.type === 'HTTP' ? 'ri-global-line' : 'ri-database-2-line'" class="mr-1"/> {{ inc.type }}</td>
            <td><VBadge dot color="error" class="mr-2"/> {{ inc.since }}</td>
            <td class="text-medium-emphasis text-truncate" style="max-width: 250px;" :title="inc.error">{{ inc.error }}</td>
          </tr>
          </tbody>
        </VTable>
      </template>

      <template v-else-if="!isLoading">
        <VCardTitle class="text-subtitle-1 font-weight-bold pt-4 px-4 text-success d-flex align-center">
          <VIcon icon="ri-heart-pulse-fill" class="mr-2 pulse-animation" />
          System Heartbeat (Operativo)
        </VCardTitle>

        <VCardText class="pt-4 pb-6">
          <p class="text-medium-emphasis mb-4 text-body-2">Todos los sistemas están respondiendo correctamente sin interrupciones detectadas.</p>

          <div class="d-flex flex-wrap gap-3">
            <VChip
              v-for="service in dashboardData.system_health"
              :key="service.id"
              color="success"
              variant="tonal"
              size="large"
              class="font-weight-medium px-4 py-2"
              elevation="0"
            >
              <VIcon start :icon="service.type === 'HTTP' ? 'ri-global-line' : 'ri-database-2-line'" />
              {{ service.name }}
            </VChip>
          </div>
        </VCardText>
      </template>
    </VCard>

    <VRow>
      <VCol cols="12" md="7">
        <VCard class="h-100 border" :loading="isLoading">
          <VCardText>
            <ClientOnly>
              <VueApexCharts v-if="!isLoading" type="heatmap" height="300" :options="heatmapOptions" :series="heatmapSeries" />
              <VSkeletonLoader v-else type="image" height="300" class="bg-transparent" />
            </ClientOnly>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="5">
        <VCard class="h-100 border" :loading="isLoading">
          <VCardTitle class="text-subtitle-1 font-weight-bold pt-4 px-4">
            <VIcon icon="ri-timer-flash-line" color="warning" class="mr-2" />
            Top 5: Servicios con mayor latencia
          </VCardTitle>
          <VCardText>
            <ClientOnly>
              <VueApexCharts v-if="!isLoading" type="bar" height="260" :options="slowestOptions" :series="slowestSeries" />
              <VSkeletonLoader v-else type="image" height="260" class="bg-transparent" />
            </ClientOnly>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped lang="scss">
.border {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 12px;
}
.pulse-animation {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
