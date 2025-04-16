<script setup lang="ts">
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  middleware: 'permissions',
  action: 'Listar Permisos', // Acción requerida
  subject: 'Permission',
})

const { del } = useClienteRequest()
const { success, preguntaEliminar } = useToast()
const { can } = useAbility()

const dataTable = ref<any>(null)

const headers = [
  {
    title: 'id',
    key: 'id',
  },
  {
    title: 'Nombre',
    key: 'name',
  },
  {
    title: 'Sujeto',
    key: 'subject',
  },
  {
    title: 'Acciones',
    key: 'Acciones',
    sortable: false,
  },
]

const deleteItem = async (id: number) => {
  const confirm = await preguntaEliminar('¿Desea Eliminar Permission?')
  if (!confirm)
    return
  try {
    const respuesta = await del(`api/admin/modulo-usuarios/permissions${id}`)

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
    <h1 v-text="'Listado de permisos'"/>
    <VBtn
      v-if="can('Crear Permisos', 'Permission')"
      class="ml-auto"
      to="/admin/modulo-usuarios/permisos/create"
    >
      <VIcon class="mr-2 ri-add-large-fill"/>
      Nuev@ Permission
    </VBtn>
  </div>
  <DataTableComponent
    ref="dataTable"
    :columnas="headers"
    endpoint="api/admin/modulo-usuarios/permissions"
    :cantidad-por-pagina="10"
    :cantidad-por-pagina-opciones="[10, 20, 30]"
    :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
  >
    <template #item.Acciones="{ item }">
      <VBtn
        v-if="can('Ver Permisos', 'Permission')"
        icon="ri-eye-line"
        variant="tonal"
        color="info"
        :to="`/admin/modulo-usuarios/permisos/show/${item.id}` "
        class="mr-1"
      />
      <VBtn
        v-if="can('Editar Permisos', 'Permission')"
        icon="ri-edit-box-line"
        variant="tonal"
        color="warning"
        :to="`/admin/modulo-usuarios/permisos/edit/${item.id}`"
        class="mr-1"
      />
      <VBtn
        v-if="can('Eliminar Permisos', 'Permission')"
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
