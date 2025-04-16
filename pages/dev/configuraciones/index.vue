<script setup lang="ts">
import { manejaError } from '@/utils/funcionesComunes'

const { can } = useAbility()

definePageMeta({
  navActiveLink: 'dev-configuraciones',
  middleware: 'permissions',
  action: 'Listar Configuraciones',
  subject: 'Configuracion',
})

const { del } = useClienteRequest()
const { success, preguntaEliminar } = useToast()
const dataTable = ref<any>(null)

const headers = [
  {
    title: 'Key',
    key: 'key',
  },
  {
    title: 'Value',
    key: 'value',
  },
  {
    title: 'Descripcion',
    key: 'descripcion',
  },
  {
    title: 'Acciones',
    key: 'Acciones',
  },
]

const deleteItem = async (id: number) => {
  const confirm = await preguntaEliminar('¿Desea Eliminar Configuracion?')
  if (!confirm)
    return
  try {
    const respuesta = await del(`api/admin/configuraciones/generales/${id}`)

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
    <h1 v-text="'Listado de configuraciones'" />
    <VBtn
      v-if="can('Crear Configuraciones', 'Configuracion')"
      class="ml-auto"
      to="/dev/configuraciones/create"
    >
      <VIcon class="mr-2 ri-add-large-fill" />
      Nueva Configuración
    </VBtn>
  </div>
  <DataTableComponent
    ref="dataTable"
    :columnas="headers"
    endpoint="api/admin/configuraciones/generales"
    :cantidad-por-pagina="10"
    :cantidad-por-pagina-opciones="[10, 20, 30]"
    :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
  >
    <template #item.Acciones="{ item }">
      <VBtn
        v-if="can('Ver Configuraciones', 'Configuracion')"
        icon="ri-eye-line"
        variant="tonal"
        color="info"
        :to="`/dev/configuraciones/show/${item.id}` "
        class="mr-1"
      />
      <VBtn
        v-if="can('Editar Configuraciones', 'Configuracion')"
        icon="ri-edit-box-line"
        variant="tonal"
        color="warning"
        :to="`/dev/configuraciones/edit/${item.id}`"
        class="mr-1"
      />
      <VBtn
        v-if="can('Eliminar Configuraciones', 'Configuracion')"
        icon="ri-delete-bin-line"
        variant="tonal"
        color="error"
        @click="deleteItem(item.id)"
      />
    </template>
  </DataTableComponent>
</template>
