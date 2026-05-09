<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseInterface } from '@/types/generales/types'

definePageMeta({
  action: 'Ver Dashboards',
  subject: 'Dashboard',
})

const { get } = useClienteRequest()

const isInitialLoad = ref(true) // <-- Controla el Skeleton loader inicial
const isLoading = ref(true)
const lastUpdate = ref<Date>(new Date())
let pollingInterval: ReturnType<typeof setInterval> | null = null
let clockInterval: ReturnType<typeof setInterval> | null = null
const currentTime = ref(Date.now())

const liveData = ref({
  summary: { total: 0, up: 0, down: 0, status_color: 'success' },
  active_alerts: [] as any[]
})

const fetchLiveStatus = async () => {
  try {
    isLoading.value = true
    const respuesta = await get<SendResponseInterface<any>>(`api/analytics/live-status`)
    if (respuesta.success) {
      liveData.value = respuesta.data
      lastUpdate.value = new Date()
    }
  } catch (errorCapturado) {
    console.error('Error actualizando monitor:', errorCapturado)
  } finally {
    isLoading.value = false
    isInitialLoad.value = false // Apagamos el esqueleto después de la primera carga
  }
}

// === CICLO DE VIDA ===
onMounted(() => {
  fetchLiveStatus()

  // 1. POLLING: Consultar al servidor cada 20 segundos (Ajustado)
  pollingInterval = setInterval(fetchLiveStatus, 20000)

  // 2. RELOJ EN VIVO:
  clockInterval = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
  if (clockInterval) clearInterval(clockInterval)
})

// === CÁLCULO DE TIEMPO EN VIVO ===
const calcularDuracion = (openedAtTimestamp: number) => {
  const start = openedAtTimestamp * 1000
  const diffMs = currentTime.value - start

  const totalSeconds = Math.floor(diffMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  return `${minutes}m ${seconds}s`
}

// === COLORES SOFT UI ===
const matteColor = computed(() => {
  // Retornamos colores menos brillantes para evitar fatiga visual
  return liveData.value.summary.status_color === 'success'
    ? '#2E7D32' // Verde mate (Green Darken-3)
    : '#C62828' // Rojo mate (Red Darken-3)
})
</script>

<template>
  <div class="d-flex justify-space-between align-center mb-6">
    <div>
      <h1 class="text-h3 font-weight-black text-uppercase tracking-wide d-flex align-center">
        <VIcon icon="ri-radar-line" class="mr-3" /> NOC Monitor
      </h1>
      <div class="text-subtitle-1 text-medium-emphasis mt-2 d-flex align-center">
        Última actualización: {{ lastUpdate.toLocaleTimeString('es-GT') }}
        <span class="ml-3 text-caption bg-grey-200 text-grey-800 px-3 py-1 rounded-xl font-weight-bold">
          Auto-refresh: 20s
        </span>
      </div>
    </div>

    <VBtn
      color="primary"
      variant="tonal"
      @click="fetchLiveStatus"
      :loading="isLoading && !isInitialLoad"
      :disabled="isLoading"
    >
      <VIcon start icon="ri-refresh-line" />
      Actualizar Ahora
    </VBtn>
  </div>

  <VRow v-if="isInitialLoad">
    <VCol cols="12" md="4">
      <VSkeletonLoader type="card" class="h-100" height="300" />
    </VCol>
    <VCol cols="12" md="8">
      <VSkeletonLoader type="list-item-avatar-three-line, list-item-avatar-three-line" class="h-100" />
    </VCol>
  </VRow>

  <VRow v-else>
    <VCol cols="12" md="4" class="d-flex flex-column">
      <VCard
        class="h-100 d-flex flex-column justify-center align-center text-center py-10 text-white transition-swing"
        :color="matteColor"
        elevation="3"
      >
        <VIcon
          :icon="liveData.summary.status_color === 'success' ? 'ri-shield-check-fill' : 'ri-alert-fill'"
          size="100"
          class="mb-4 opacity-90"
        />
        <h2 class="text-h2 font-weight-black mb-2">
          {{ liveData.summary.status_color === 'success' ? 'ESTABLE' : 'ALERTA' }}
        </h2>
        <div class="text-h5 opacity-90 font-weight-medium">
          Sistemas Operativos: {{ liveData.summary.up }} / {{ liveData.summary.total }}
        </div>
      </VCard>
    </VCol>

    <VCol cols="12" md="8">
      <VCard class="h-100" elevation="2">
        <VCardTitle class="bg-grey-100 text-uppercase font-weight-bold py-4 text-grey-800">
          Incidentes en Curso ({{ liveData.summary.down }})
        </VCardTitle>
        <VDivider />

        <VCardText class="pa-0 h-100 bg-grey-50">
          <VList v-if="liveData.active_alerts.length > 0" lines="three" class="bg-transparent">
            <template v-for="(alert, index) in liveData.active_alerts" :key="alert.id">
              <VListItem class="py-4 px-6">
                <template #prepend>
                  <VAvatar color="#EF5350" variant="flat" size="56" class="mr-4 pulse-animation">
                    <VIcon icon="ri-wifi-off-line" size="30" color="white" />
                  </VAvatar>
                </template>

                <VListItemTitle class="text-h6 font-weight-bold text-grey-900 mb-1">
                  {{ alert.service_name }}
                </VListItemTitle>

                <VListItemSubtitle class="text-body-1 text-grey-700">
                  {{ alert.description }}
                </VListItemSubtitle>

                <template #append>
                  <div class="d-flex flex-column align-end ml-4">
                    <span class="text-caption text-uppercase font-weight-bold text-grey-500 mb-1">Tiempo de Caída</span>
                    <VChip color="#E53935" variant="elevated" size="large" class="font-weight-black text-h6 text-white">
                      {{ calcularDuracion(alert.timestamp) }}
                    </VChip>
                  </div>
                </template>
              </VListItem>
              <VDivider v-if="index < liveData.active_alerts.length - 1" />
            </template>
          </VList>

          <div v-else class="h-100 d-flex flex-column align-center justify-center py-16">
            <VIcon icon="ri-thumb-up-fill" size="80" color="#66BB6A" class="mb-4 opacity-60" />
            <h3 class="text-h5 font-weight-bold text-grey-800">Todo bajo control</h3>
            <p class="text-grey-600">No hay interrupciones de servicio detectadas en la red.</p>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style scoped lang="scss">
.tracking-wide {
  letter-spacing: 2px;
}

/* Transición suave cuando la tarjeta gigante cambia de color */
.transition-swing {
  transition: background-color 0.5s ease;
}

/* Animación de latido usando colores mate */
@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(229, 57, 53, 0.6); }
  70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(229, 57, 53, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(229, 57, 53, 0); }
}

.pulse-animation {
  animation: pulse 2s infinite;
}
</style>
