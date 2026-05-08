<script setup lang="ts">
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseSuccessInterface } from '@/types/generales/types'

definePageMeta({
  middleware: 'permissions',
  action: 'Listar Services',
  subject: 'Service',
})

const { can } = useAbility()
const { del } = useClienteRequest()
const { success, preguntaEliminar } = useToast()
const dataTable = ref<any>(null)

const headers = [
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Description',
    key: 'description',
  },
  {
    title: 'Type',
    key: 'type',
  },
  {
    title: 'Estado',
    key: 'is_active',
  },
  {
    title: 'HttpMethod',
    key: 'httpMethod',
  },
  {
    title: 'Acciones',
    key: 'Acciones',
    sortable: false,
  }
]

const deleteItem = async (id: number) => {
  const confirm = await preguntaEliminar('¿Desea Eliminar Service?')
  if (!confirm)
    return
  try {
    const respuesta = await del<SendResponseSuccessInterface>(`api/services/${id}`)

    success(respuesta.message)
    if (dataTable.value)
      dataTable.value.getItems()
  }
  catch (errorCarpturado) {
    manejaError(errorCarpturado)
  }
}
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-4">
    <h1 v-text="'Listado de Services'"/>
    <VBtn
      v-if="can('Crear Services', 'Service')"
      class="ml-auto"
      to="/services/create"
    >
      <VIcon class="mr-2 ri-add-large-fill"/>
      Nuevo Servicio
    </VBtn>
  </div>
  <DataTableComponent
    ref="dataTable"
    :columnas="headers"
    endpoint="api/services"
    :cantidad-por-pagina="10"
    :cantidad-por-pagina-opciones="[10, 20, 30]"
    :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
  >
    <template #item.is_active="{ item }">
      <VChip
        :color="item.is_active ? 'success' : 'error'"
        variant="tonal"
      >
        {{ item.is_active ? 'Activo' : 'Inactivo' }}
      </VChip>
    </template>
    <template #item.Acciones="{ item }">
      <VBtn
        v-if="can('Ver Services', 'Service')"
        icon="ri-eye-line"
        variant="tonal"
        color="info"
        :to="`/services/show/${item.id}` "
        class="mr-1"
      />
      <VBtn
        v-if="can('Editar Services', 'Service')"
        icon="ri-edit-box-line"
        variant="tonal"
        color="warning"
        :to="`/services/edit/${item.id}`"
        class="mr-1"
      />
      <VBtn
        v-if="can('Eliminar Services', 'Service')"
        icon="ri-delete-bin-line"
        variant="tonal"
        color="error"
        @click="deleteItem(item.id)"
      />
    </template>
  </DataTableComponent>
</template>

<style scoped lang="scss">

</style>
