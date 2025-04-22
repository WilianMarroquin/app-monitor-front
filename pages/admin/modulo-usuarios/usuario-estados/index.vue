<script setup lang="ts">
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  middleware: 'permissions',
  action: 'Listar Usuario Estados',
  subject: 'UserEstado',
})

const { del } = useClienteRequest()
const { success, preguntaEliminar } = useToast()
const { can } = useAbility()

const dataTable = ref<any>(null)

const headers = [
  {
    title: 'Nombre',
    key: 'nombre',
  },
  {
    title: 'Acciones',
    key: 'Acciones',
  },
]

const deleteItem = async (id: number) => {
  const confirm = await preguntaEliminar('¿Desea Eliminar UserEstado?')
  if (!confirm)
    return
  try {
    const respuesta = await del(`api/admin/modulo-usuarios/users/estados/${id}`)

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
    <h1 v-text="'Listado de Estados de Usuarios'"/>
    <VBtn
      v-if="can('Crear Usuario Estados', 'UserEstado')"
      class="ml-auto"
      to="/admin/modulo-usuarios/usuario-estados/create"
    >
      <VIcon class="mr-2 ri-add-large-fill"/>
      Nueno Estado
    </VBtn>
  </div>
  <DataTableComponent
    ref="dataTable"
    :columnas="headers"
    endpoint="api/admin/modulo-usuarios/users/estados"
    :cantidad-por-pagina="10"
    :cantidad-por-pagina-opciones="[10, 20, 30]"
    :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
  >
    <template #item.Acciones="{ item }">
      <VBtn
        v-if="can('Ver Usuario Estados', 'UserEstado')"
        icon="ri-eye-line"
        variant="tonal"
        color="info"
        :to="`/admin/modulo-usuarios/usuario-estados/show/${item.id}` "
        class="mr-1"
      />
      <VBtn
        v-if="can('Editar Usuario Estados', 'UserEstado')"
        icon="ri-edit-box-line"
        variant="tonal"
        color="warning"
        :to="`/admin/modulo-usuarios/usuario-estados/edit/${item.id}`"
        class="mr-1"
      />
      <VBtn
        v-if="can('Eliminar Usuario Estados', 'UserEstado')"
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
