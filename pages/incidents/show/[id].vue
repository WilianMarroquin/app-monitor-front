<script setup lang="ts">
import { ref, computed } from 'vue'
import type { VForm } from 'vuetify/lib/components/VForm'
import type {SendResponseInterface, SendResponseSuccessInterface} from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'
import { useRoute } from 'vue-router'

definePageMeta({
  navActiveLink: 'incidents',
  middleware: 'permissions',
  action: 'Ver Incidentes',
  subject: 'Incident',
})

const { get, post } = useClienteRequest()
const { paginaEspera } = useCargandoPagina()
const { success } = useToast()

const route = useRoute()
const id = route.params.id

const comentarioData = ref({
  incident_id: null as number | null,
  description: ''
})
const refFormComentario = ref<VForm>()
const isModalVisible = ref(false)
const isLoading = ref(false)
const isFormValid = ref(false)

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
  comentarios: [],
  contactos_notificados: []
})

const getIncident = async () => {
  try {
    // Si tu useCargandoPagina() bloquea toda la pantalla, puedes quitar esta línea
    // para que se luzcan los Skeletons. De lo contrario, funcionarán en conjunto.
    // paginaEspera.value = true

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

// ==========================================
// 🧮 DERIVED STATE (Agrupación de Notificaciones)
// ==========================================
const notificacionesCaida = computed(() => {
  if (!item.value.contactos_notificados) return []
  return item.value.contactos_notificados.filter((c: any) =>
    ['open', 'down'].includes(c.pivot?.status)
  )
})

const notificacionesRegreso = computed(() => {
  if (!item.value.contactos_notificados) return []
  return item.value.contactos_notificados.filter((c: any) =>
    ['resolved', 'up', 'follow-up'].includes(c.pivot?.status)
  )
})

const abrirModalComentario = (id: number) => {
  comentarioData.value.incident_id = id
  comentarioData.value.description = ''
  isModalVisible.value = true
}

const puedeMostrarDatos = computed(() => {
  return item.value.id !== null
})

const guardarComentario = async () => {
  const { valid } = await refFormComentario.value?.validate() || { valid: false }

  if (!valid) return

  try {
    isLoading.value = true
    const respuesta = await post<SendResponseSuccessInterface>(
      'api/incidents/registrar/Comentario',
      comentarioData.value
    )
    success(respuesta.message || 'Comentario registrado con éxito')
    cerrarModal()
    await getIncident()
  } catch (errorCapturado) {
    manejaError(errorCapturado)
  } finally {
    isLoading.value = false
  }
}

const cerrarModal = () => {
  isModalVisible.value = false
  comentarioData.value.incident_id = null
  comentarioData.value.description = ''
  refFormComentario.value?.resetValidation()
}

// === FUNCIÓN PARA FORMATEAR FECHAS ===
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
    <div>
      <VBtn
        prepend-icon="ri-message-2-line"
        color="info"
        @click="abrirModalComentario(item.id)"
        class="mr-1"
        variant="outlined"
        :disabled="!puedeMostrarDatos"
      >
        Registrar Comentario
      </VBtn>
      <VBtn
        color="secondary"
        variant="tonal"
        to="/incidents"
      >
        <VIcon class="mr-2 ri-arrow-left-line"/>
        Regresar
      </VBtn>
    </div>
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
                variant="tonal"
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
            :type="item.status === 'open' ? 'warning' : 'info'"
            variant="tonal"
            icon="ri-alert-line"
            class="text-body-1"
          >
            {{ item.description }}
          </VAlert>
        </VCardText>
      </VCard>

      <VCard class="mb-6 elevation-2 border">
        <VCardItem class="bg-light-secondary pb-3">
          <template #title>
            <span class="text-h6 font-weight-bold">
              <VIcon icon="ri-broadcast-line" class="mr-2" />
              Auditoría de Notificaciones
            </span>
          </template>
        </VCardItem>
        <VDivider />

        <VCardText class="pt-5">
          <div class="mb-6">
            <div class="d-flex align-center mb-3">
              <VIcon icon="ri-arrow-down-circle-fill" color="error" class="mr-2" />
              <h4 class="text-subtitle-1 font-weight-bold text-error">Alertas de Sitio Caído</h4>
            </div>

            <VList v-if="notificacionesCaida.length > 0" lines="two" border class="rounded">
              <VListItem v-for="contacto in notificacionesCaida" :key="contacto.id">
                <template #prepend>
                  <VAvatar color="error" variant="tonal" class="mr-3">
                    <VIcon icon="ri-whatsapp-line" />
                  </VAvatar>
                </template>
                <VListItemTitle class="font-weight-bold">{{ contacto.nombre_completo || 'Usuario Desconocido' }}</VListItemTitle>
                <VListItemSubtitle class="mt-1">
                  <div class="d-flex flex-wrap gap-4 text-caption">
                    <span><strong>Registrado:</strong> {{ contacto.telefono || 'N/A' }}</span>
                    <span><strong>Notificado a:</strong> <span class="text-primary">{{ contacto.pivot?.number || 'N/A' }}</span></span>
                  </div>
                </VListItemSubtitle>
              </VListItem>
            </VList>
            <p v-else class="text-body-2 text-medium-emphasis font-italic px-2">No se enviaron alertas de caída para este incidente.</p>
          </div>

          <div>
            <div class="d-flex align-center mb-3">
              <VIcon icon="ri-arrow-up-circle-fill" color="success" class="mr-2" />
              <h4 class="text-subtitle-1 font-weight-bold text-success">Alertas de Sitio Recuperado</h4>
            </div>

            <VList v-if="notificacionesRegreso.length > 0" lines="two" border class="rounded">
              <VListItem v-for="contacto in notificacionesRegreso" :key="contacto.id">
                <template #prepend>
                  <VAvatar color="success" variant="tonal" class="mr-3">
                    <VIcon icon="ri-whatsapp-line" />
                  </VAvatar>
                </template>
                <VListItemTitle class="font-weight-bold">{{ contacto.nombre_completo || 'Usuario Desconocido' }}</VListItemTitle>
                <VListItemSubtitle class="mt-1">
                  <div class="d-flex flex-wrap gap-4 text-caption">
                    <span><strong>Registrado:</strong> {{ contacto.telefono || 'N/A' }}</span>
                    <span><strong>Notificado a:</strong> <span class="text-primary">{{ contacto.pivot?.number || 'N/A' }}</span></span>
                  </div>
                </VListItemSubtitle>
              </VListItem>
            </VList>
            <p v-else class="text-body-2 text-medium-emphasis font-italic px-2">No se han enviado alertas de recuperación todavía.</p>
          </div>
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

  <VRow v-else>
    <VCol cols="12" md="7" lg="8">
      <VCard class="mb-6 elevation-2 border">
        <VCardItem class="pb-4">
          <VSkeletonLoader type="heading" />
        </VCardItem>
        <VDivider />
        <VCardText class="pt-6">
          <VSkeletonLoader type="image" height="80" class="mb-4 rounded" />
          <VSkeletonLoader type="paragraph" />
        </VCardText>
      </VCard>

      <VCard class="mb-6 elevation-2 border">
        <VCardItem class="pb-3">
          <VSkeletonLoader type="heading" />
        </VCardItem>
        <VDivider />
        <VCardText class="pt-5">
          <VSkeletonLoader type="subtitle" class="mb-4" width="40%" />
          <VSkeletonLoader type="list-item-avatar-two-line@2" class="mb-6" />

          <VSkeletonLoader type="subtitle" class="mb-4" width="40%" />
          <VSkeletonLoader type="list-item-avatar-two-line" />
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="5" lg="4">
      <VCard class="elevation-2 border h-100">
        <VCardItem class="pb-3">
          <VSkeletonLoader type="heading" />
        </VCardItem>
        <VDivider />
        <VCardText class="pt-5">
          <VSkeletonLoader type="list-item-two-line@4" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <VDialog
    v-model="isModalVisible"
    max-width="600"
    persistent
  >
    <VCard>
      <VCardItem class="pb-3">
        <template #title>
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-bold">
              <VIcon icon="ri-chat-new-line" class="mr-2 text-primary" />
              Nuevo Comentario
            </span>
            <VBtn
              icon="ri-close-line"
              variant="text"
              density="comfortable"
              color="secondary"
              @click="cerrarModal"
            />
          </div>
        </template>
      </VCardItem>

      <VDivider />

      <VCardText class="pt-5">
        <VAlert
          type="info"
          variant="tonal"
          class="mb-4 text-body-2"
          icon="ri-information-line"
        >
          Estás agregando un comentario al incidente <strong>#{{ comentarioData.incident_id }}</strong>. Este registro quedará vinculado a tu usuario de forma permanente.
        </VAlert>

        <VForm
          ref="refFormComentario"
          v-model="isFormValid"
          @submit.prevent="guardarComentario"
        >
          <VTextarea
            v-model="comentarioData.description"
            label="Descripción del comentario"
            placeholder="Ej: Se reinició el servicio y se monitorea estabilidad..."
            :rules="[v => !!v || 'Debes escribir un comentario para poder guardar.']"
            rows="4"
            variant="outlined"
            auto-grow
          />

          <div class="d-flex justify-end mt-4">
            <VBtn
              variant="tonal"
              color="secondary"
              class="mr-3"
              @click="cerrarModal"
              :disabled="isLoading"
            >
              Cancelar
            </VBtn>
            <VBtn
              type="submit"
              color="primary"
              :loading="isLoading"
            >
              <VIcon start icon="ri-save-3-line" />
              Guardar Comentario
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
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
