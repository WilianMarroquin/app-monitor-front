<script setup lang="ts">
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseSuccessInterface } from '@/types/generales/types'

definePageMeta({
  middleware: 'permissions',
  action: 'Listar Serveres',
  subject: 'Server',
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
    title: 'Internal Ip',
    key: 'internal_ip',
  },
  {
    title: 'External Ip',
    key: 'external_ip',
  },
  {
    title: 'Entorno',
    key: 'entorno',
  },
  {
    title: 'Acciones',
    key: 'Acciones',
  }
]

const deleteItem = async (id: number) => {
  const confirm = await preguntaEliminar('¿Desea Eliminar Server?')
  if (!confirm)
    return
  try {
    const respuesta = await del<SendResponseSuccessInterface>(`api/servers/${id}`)

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
    <h1 v-text="'Listado de Serveres'"/>
    <VBtn
      v-if="can('Crear Serveres', 'Server')"
      class="ml-auto"
      color="success"
      to="/servers/create"
    >
      <VIcon class="mr-2 ri-add-large-fill"/>
      Nuev@ Server
    </VBtn>
  </div>
  <DataTableComponent
    ref="dataTable"
    :columnas="headers"
    endpoint="api/servers"
    :cantidad-por-pagina="10"
    :cantidad-por-pagina-opciones="[10, 20, 30]"
    :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
  >
    <template #item.Acciones="{ item }">
      <VBtn
        v-if="can('Ver Serveres', 'Server')"
        icon="ri-eye-line"
        variant="tonal"
        color="info"
        :to="`/servers/show/${item.id}` "
        class="mr-1"
      />
      <VBtn
        v-if="can('Editar Serveres', 'Server')"
        icon="ri-edit-box-line"
        variant="tonal"
        color="warning"
        :to="`/servers/edit/${item.id}`"
        class="mr-1"
      />
      <VBtn
        v-if="can('Eliminar Serveres', 'Server')"
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
