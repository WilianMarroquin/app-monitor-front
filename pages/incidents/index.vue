<script setup lang="ts">
import { ref, watch } from 'vue'
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseSuccessInterface } from '@/types/generales/types'
import type { VForm } from 'vuetify/lib/components/VForm'

definePageMeta({
  middleware: 'permissions',
  action: 'Listar Incidentes',
  subject: 'Incident',
})

const { can } = useAbility()
const { del, post } = useClienteRequest()
const { success, preguntaEliminar } = useToast()

// === AISLAMIENTO DE COMPONENTES (3 Refs distintos) ===
const dataTableOpen = ref<any>(null)
const dataTableResolved = ref<any>(null)
const dataTableAll = ref<any>(null)

const refFormComentario = ref<VForm>()
const isModalVisible = ref(false)
const isFormValid = ref(false)
const isLoading = ref(false)

// === ESTADO DE LOS INPUTS ===
const currentTab = ref('open')
const filterServiceId = ref(null)
const filterDateFrom = ref(null)
const filterDateTo = ref(null)

// === ESTADO DE LA TABLA (Solo variables globales, el status se inyecta en el template) ===
const filtrosTabla = ref({
  service_id: null,
  fecha_inicio: null,
  fecha_fin: null
})

// === APLICAR FILTROS Y RECARGAR TABLA ACTIVA ===
const aplicarFiltros = () => {
  filtrosTabla.value = {
    service_id: filterServiceId.value,
    fecha_inicio: filterDateFrom.value,
    fecha_fin: filterDateTo.value
  }

  // Refrescamos SOLO la tabla de la pestaña actual
  setTimeout(() => {
    if (currentTab.value === 'open' && dataTableOpen.value) dataTableOpen.value.getItems()
    if (currentTab.value === 'resolved' && dataTableResolved.value) dataTableResolved.value.getItems()
    if (currentTab.value === 'all' && dataTableAll.value) dataTableAll.value.getItems()
  }, 50) // Un pequeñísimo delay para que Vue alcance a renderizar la pestaña
}

const comentarioData = ref({
  incident_id: null as number | null,
  description: ''
})

const abrirModalComentario = (id: number) => {
  comentarioData.value.incident_id = id
  comentarioData.value.description = ''
  isModalVisible.value = true
}

const cerrarModal = () => {
  isModalVisible.value = false
  comentarioData.value.incident_id = null
  comentarioData.value.description = ''
  refFormComentario.value?.resetValidation()
}

// Al cambiar de tab, aplicamos los filtros y refrescamos la tabla correspondiente
watch(currentTab, () => {
  aplicarFiltros()
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

    // Recargar solo la tabla activa
    aplicarFiltros()

  } catch (errorCapturado) {
    manejaError(errorCapturado)
  } finally {
    isLoading.value = false
  }
}

const limpiarFiltros = () => {
  filterServiceId.value = null
  filterDateFrom.value = null
  filterDateTo.value = null
  aplicarFiltros()
}

const headers = [
  { title: 'id', key: 'id' },
  { title: 'Descripción', key: 'description_corta', sortable: false },
  { title: 'Estado', key: 'status' },
  { title: 'Apertura', key: 'opened_at' },
  { title: 'Cierre', key: 'resolved_at' },
  { title: 'Servicio', key: 'service.name', sortable: false  },
  { title: 'Acciones', key: 'Acciones', sortable: false},
]

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
  <div class="d-flex flex-wrap justify-space-between align-center mb-4">
    <h1 class="text-h4 font-weight-bold">Tickets de Incidentes</h1>
  </div>

  <VTabs
    v-model="currentTab"
    color="primary"
    class="mb-4 border-b"
  >
    <VTab value="open">
      <VIcon start icon="ri-error-warning-line" />
      Pendientes
    </VTab>
    <VTab value="resolved">
      <VIcon start icon="ri-checkbox-circle-line" />
      Resueltos
    </VTab>
    <VTab value="all">
      <VIcon start icon="ri-list-check" />
      Todos
    </VTab>
  </VTabs>

  <VCard class="mb-6">
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
          <VTextField
            v-model="filterDateFrom"
            type="date"
            label="Desde"
            hide-details
            clearable
          />
        </VCol>

        <VCol cols="12" md="3">
          <VTextField
            v-model="filterDateTo"
            type="date"
            label="Hasta"
            hide-details
            clearable
          />
        </VCol>

        <VCol cols="12" md="2">
          <VBtn color="primary" block @click="aplicarFiltros">
            <VIcon start icon="ri-filter-line" /> Aplicar
          </VBtn>
        </VCol>

        <VCol cols="12" md="2" v-if="filterServiceId || filterDateFrom || filterDateTo">
          <VBtn variant="tonal" color="error" block @click="limpiarFiltros">
            <VIcon start icon="ri-filter-off-line" /> Limpiar
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <VWindow v-model="currentTab">

    <VWindowItem value="open">
      <DataTableComponent
        ref="dataTableOpen"
        :columnas="headers"
        endpoint="api/incidents"
        :cantidad-por-pagina="10"
        :cantidad-por-pagina-opciones="[10, 20, 30]"
        :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
        :filtros="{ ...filtrosTabla, status: 'open' }"
        :relaciones="['service']"
      >
        <template #item.opened_at="{ item }">
          <div class="text-caption font-weight-medium">
            <VIcon size="small" icon="ri-calendar-line" class="mr-1 text-primary" />
            {{ formatDateTime(item.opened_at) }}
          </div>
        </template>
        <template #item.resolved_at="{ item }">
          <div class="text-caption font-weight-medium">
            <VIcon size="small" icon="ri-time-line" class="mr-1 text-success" v-if="item.resolved_at"/>
            {{ formatDateTime(item.resolved_at) }}
          </div>
        </template>
        <template #item.status="{ item }">
          <VChip :color="item.status === 'open' ? 'error' : 'success'" size="small" class="font-weight-bold text-uppercase">
            {{ item.status === 'open' ? 'Pendiente' : 'Resuelto' }}
          </VChip>
        </template>
        <template #item.Acciones="{ item }">
          <VBtn v-if="can('Ver Incidentes', 'Incident')" icon="ri-eye-line" variant="tonal" color="info" :to="`/incidents/show/${item.id}`" class="mr-1" size="small"/>
          <VBtn v-if="can('Registrar Comentario Incidentes', 'Incident')" icon="ri-message-2-line" variant="tonal" color="warning" @click="abrirModalComentario(item.id)" class="mr-1" size="small"/>
        </template>
      </DataTableComponent>
    </VWindowItem>

    <VWindowItem value="resolved">
      <DataTableComponent
        ref="dataTableResolved"
        :columnas="headers"
        endpoint="api/incidents"
        :cantidad-por-pagina="10"
        :cantidad-por-pagina-opciones="[10, 20, 30]"
        :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
        :filtros="{ ...filtrosTabla, status: 'resolved' }"
        :relaciones="['service']"
      >
        <template #item.opened_at="{ item }">
          <div class="text-caption font-weight-medium">
            <VIcon size="small" icon="ri-calendar-line" class="mr-1 text-primary" />
            {{ formatDateTime(item.opened_at) }}
          </div>
        </template>
        <template #item.resolved_at="{ item }">
          <div class="text-caption font-weight-medium">
            <VIcon size="small" icon="ri-time-line" class="mr-1 text-success" v-if="item.resolved_at"/>
            {{ formatDateTime(item.resolved_at) }}
          </div>
        </template>
        <template #item.status="{ item }">
          <VChip :color="item.status === 'open' ? 'error' : 'success'" size="small" class="font-weight-bold text-uppercase">
            {{ item.status === 'open' ? 'Pendiente' : 'Resuelto' }}
          </VChip>
        </template>
        <template #item.Acciones="{ item }">
          <VBtn v-if="can('Ver Incidentes', 'Incident')" icon="ri-eye-line" variant="tonal" color="info" :to="`/incidents/show/${item.id}`" class="mr-1" size="small"/>
          <VBtn v-if="can('Registrar Comentario Incidentes', 'Incident')" icon="ri-message-2-line" variant="tonal" color="warning" @click="abrirModalComentario(item.id)" class="mr-1" size="small"/>
        </template>
      </DataTableComponent>
    </VWindowItem>

    <VWindowItem value="all">
      <DataTableComponent
        ref="dataTableAll"
        :columnas="headers"
        endpoint="api/incidents"
        :cantidad-por-pagina="10"
        :cantidad-por-pagina-opciones="[10, 20, 30]"
        :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
        :filtros="filtrosTabla"
        :relaciones="['service']"
      >
        <template #item.opened_at="{ item }">
          <div class="text-caption font-weight-medium">
            <VIcon size="small" icon="ri-calendar-line" class="mr-1 text-primary" />
            {{ formatDateTime(item.opened_at) }}
          </div>
        </template>
        <template #item.resolved_at="{ item }">
          <div class="text-caption font-weight-medium">
            <VIcon size="small" icon="ri-time-line" class="mr-1 text-success" v-if="item.resolved_at"/>
            {{ formatDateTime(item.resolved_at) }}
          </div>
        </template>
        <template #item.status="{ item }">
          <VChip :color="item.status === 'open' ? 'error' : 'success'" size="small" class="font-weight-bold text-uppercase">
            {{ item.status === 'open' ? 'Pendiente' : 'Resuelto' }}
          </VChip>
        </template>
        <template #item.Acciones="{ item }">
          <VBtn v-if="can('Ver Incidentes', 'Incident')" icon="ri-eye-line" variant="tonal" color="info" :to="`/incidents/show/${item.id}`" class="mr-1" size="small"/>
          <VBtn v-if="can('Registrar Comentario Incidentes', 'Incident')" icon="ri-message-2-line" variant="tonal" color="warning" @click="abrirModalComentario(item.id)" class="mr-1" size="small"/>
        </template>
      </DataTableComponent>
    </VWindowItem>

  </VWindow>

  <VDialog v-model="isModalVisible" max-width="600" persistent>
    <VCard>
      <VCardItem class="pb-3">
        <template #title>
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-bold">
              <VIcon icon="ri-chat-new-line" class="mr-2 text-primary" />
              Nuevo Comentario
            </span>
            <VBtn icon="ri-close-line" variant="text" density="comfortable" color="secondary" @click="cerrarModal" />
          </div>
        </template>
      </VCardItem>
      <VDivider />
      <VCardText class="pt-5">
        <VAlert type="info" variant="tonal" class="mb-4 text-body-2" icon="ri-information-line">
          Estás agregando un comentario al incidente <strong>#{{ comentarioData.incident_id }}</strong>. Este registro quedará vinculado a tu usuario de forma permanente.
        </VAlert>
        <VForm ref="refFormComentario" v-model="isFormValid" @submit.prevent="guardarComentario">
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
            <VBtn variant="tonal" color="secondary" class="mr-3" @click="cerrarModal" :disabled="isLoading">Cancelar</VBtn>
            <VBtn type="submit" color="primary" :loading="isLoading"><VIcon start icon="ri-save-3-line" /> Guardar Comentario</VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">
.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
