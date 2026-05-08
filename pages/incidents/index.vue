<script setup lang="ts">
import { ref, watch } from 'vue' // <-- Importamos watch
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseSuccessInterface } from '@/types/generales/types'

definePageMeta({
  middleware: 'permissions',
  action: 'Listar Incidentes',
  subject: 'Incident',
})

const { can } = useAbility()
const { del } = useClienteRequest()
const { success, preguntaEliminar } = useToast()
const dataTable = ref<any>(null)

// === ESTADO DE LOS INPUTS (Lo que el usuario ve) ===
const currentTab = ref('open')
const filterServiceId = ref(null)
const filterDateFrom = ref(null)
const filterDateTo = ref(null)

// === ESTADO DE LA TABLA (Lo que realmente se manda a la API) ===
// Lo inicializamos con el valor por defecto de la pestaña
const filtrosTabla = ref({
  status: 'open',
  service_id: null,
  fecha_inicio: null,
  fecha_fin: null
})

// === DEFERRED FILTERING (Ejecución Manual) ===
const aplicarFiltros = () => {
  // Copiamos los valores de los inputs hacia el objeto de la tabla
  filtrosTabla.value = {
    status: currentTab.value === 'all' ? null : currentTab.value,
    service_id: filterServiceId.value,
    fecha_inicio: filterDateFrom.value,
    fecha_fin: filterDateTo.value
  }

  // Opcional: Si tu componente DataTableComponent no recarga automáticamente
  // al cambiar los filtros, forzamos la recarga aquí:
  if (dataTable.value) {
    dataTable.value.getItems()
  }
}

// Truco de UX: Normalmente queremos que las Pestañas (Tabs) sí cambien de inmediato
// sin tener que darle al botón "Aplicar". Con este watch lo logramos:
watch(currentTab, () => {
  aplicarFiltros()
})

const limpiarFiltros = () => {
  filterServiceId.value = null
  filterDateFrom.value = null
  filterDateTo.value = null
  aplicarFiltros() // Aplicamos los filtros en blanco para reiniciar la tabla
}

const headers = [
  { title: 'id', key: 'id' },
  { title: 'Descripción', key: 'description' },
  { title: 'Estado', key: 'status' },
  { title: 'Apertura', key: 'opened_at' },
  { title: 'Cierre', key: 'resolved_at' },
  { title: 'Servicio', key: 'service_id' },
  { title: 'Acciones', key: 'Acciones' }
]

const formatDateTime = (timestamp: number | null) => {
  if (!timestamp) return '---'

  // Multiplicamos x1000 para pasar de segundos (PHP) a milisegundos (JS)
  const date = new Date(timestamp * 1000)

  // Formateo nativo de JS (puedes ajustarlo a tu gusto)
  return date.toLocaleString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true // Para que salga en formato AM/PM
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
          <VBtn
            color="primary"
            block
            @click="aplicarFiltros"
          >
            <VIcon start icon="ri-filter-line" />
            Aplicar
          </VBtn>
        </VCol>

        <VCol cols="12" md="2" >
          <VBtn
            v-if="filterServiceId || filterDateFrom || filterDateTo"
            variant="tonal"
            color="error"
            block
            @click="limpiarFiltros"
          >
            <VIcon start icon="ri-filter-off-line" />
            Limpiar
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <DataTableComponent
    ref="dataTable"
    :columnas="headers"
    endpoint="api/incidents"
    :cantidad-por-pagina="10"
    :cantidad-por-pagina-opciones="[10, 20, 30]"
    :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
    :filtros="filtrosTabla"
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
      <VChip
        :color="item.status === 'open' ? 'error' : 'success'"
        size="small"
        class="font-weight-bold text-uppercase"
      >
        {{ item.status === 'open' ? 'Pendiente' : 'Resuelto' }}
      </VChip>
    </template>

    <template #item.Acciones="{ item }">
      <VBtn
        v-if="can('Ver Incidentes', 'Incident')"
        icon="ri-eye-line"
        variant="tonal"
        color="info"
        :to="`/incidents/show/${item.id}`"
        class="mr-1"
        size="small"
      />
      <VBtn
        v-if="can('Editar Incidentes', 'Incident')"
        icon="ri-edit-box-line"
        variant="tonal"
        color="warning"
        :to="`/incidents/edit/${item.id}`"
        class="mr-1"
        size="small"
      />
    </template>
  </DataTableComponent>
</template>

<style scoped lang="scss">
.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
