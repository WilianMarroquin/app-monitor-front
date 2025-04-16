<script setup lang="ts">
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  middleware: 'permissions',
  action: 'Listar Roles',
  subject: 'Rol',
})

const { can } = useAbility()
const { del } = useClienteRequest()
const { success, preguntaEliminar } = useToast()
const dataTable = ref<any>(null)

const headers = [
  {
    title: 'Id',
    key: 'id',
  },
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Permisos',
    key: 'permissions',
  },
  {
    title: 'Acciones',
    key: 'Acciones',
    sortable: false,
  },
]

const deleteItem = async (id: number) => {
  const confirm = await preguntaEliminar('¿Desea Eliminar Rol?')
  if (!confirm)
    return
  try {
    const respuesta = await del(`api/admin/modulo-usuarios/roles/${id}`)

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
    <h1 v-text="'Listado de roles'"/>
    <VBtn
      v-if="can('Crear roles', 'Rol')"
      class="ml-auto"
      to="/admin/modulo-usuarios/roles/create"
    >
      <VIcon class="mr-2 ri-add-large-fill"/>
      Nuevo Rol
    </VBtn>
  </div>
  <DataTableComponent
    ref="dataTable"
    :columnas="headers"
    endpoint="api/admin/modulo-usuarios/roles"
    :cantidad-por-pagina="10"
    :cantidad-por-pagina-opciones="[10, 20, 30]"
    :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
    :relaciones="['permissions']"
  >
    <template #item.permissions="{ item }">
      <VChip
        v-for="permiso in item.permissions"
        :key="permiso.id"
        color="primary"
        class="ma-1"
      >
        {{ permiso.name }}
      </VChip>
    </template>
    <template #item.Acciones="{ item }">
      <VBtn
        v-if="can('Ver roles', 'Rol')"
        icon="ri-eye-line"
        variant="tonal"
        color="info"
        :to="`/admin/modulo-usuarios/roles/show/${item.id}` "
        class="mr-1"
      />
      <VBtn
        v-if="can('Editar roles', 'Rol')"
        icon="ri-edit-box-line"
        variant="tonal"
        color="warning"
        :to="`/admin/modulo-usuarios/roles/edit/${item.id}`"
        class="mr-1"
      />
      <VBtn
        v-if="can('Eliminar roles', 'Rol')"
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
