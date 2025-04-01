<script setup lang="ts">
import { can } from '@layouts/plugins/casl'
import { manejaError } from '@/utils/funcionesComunes'
//definePageMeta({
//  middleware: 'permissions',
//  action: 'listar roles', // Acción requerida
//  subject: 'roles',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
//});

const { deleted } = useClienteRequest()
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
  },
]

const deleteItem = async (id: number) => {
  const confirm = await preguntaEliminar('¿Desea Eliminar Rol?')
  if (!confirm)
    return
  try {
    const respuesta = await deleted(`api/admin/modulo-usuarios/roles/${id}`)

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
      v-if="can('crear roles', 'roles')"
      class="ml-auto"
      color="success"
      to="/admin/modulo-usuarios/roles/create"
    >
      <VIcon class="mr-2 ri-add-large-fill"/>
      Nuev@ Rol
    </VBtn>
  </div>
  <DataTableComponent
    :columnas="headers"
    endpoint="api/admin/modulo-usuarios/roles"
    :cantidadPorPagina="10"
    :cantidadPorPaginaOpciones="[10, 20, 30]"
    :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
    ref="dataTable"
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
        v-if="can('ver roles', 'roles')"
        icon="ri-eye-line"
        variant="tonal"
        color="info"
        :to="`/admin/modulo-usuarios/roles/show/${item.id}` "
        class="mr-1"
      />
      <VBtn
        v-if="can('editar roles', 'roles')"
        icon="ri-edit-box-line"
        variant="tonal"
        color="warning"
        :to="`/admin/modulo-usuarios/roles/edit/${item.id}`"
        class="mr-1"
      />
      <VBtn
        v-if="can('eliminar roles', 'roles')"
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
