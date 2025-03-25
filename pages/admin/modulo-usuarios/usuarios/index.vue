<script setup lang="ts">
import { can } from '@layouts/plugins/casl'
import { manejaError } from '@/utils/funcionesComunes'

//definePageMeta({
//  middleware: 'permissions',
//  action: 'listar usuarios', // Acción requerida
//  subject: 'usuarios',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
//});

const { deleted } = useClienteRequest()
const { success, preguntaEliminar } = useToast()
const dataTable = ref<any>(null)

const headers = [
  {
    title: 'Usuario',
    key: 'usuario',
  },
  {
    title: 'Roles',
    key: 'roles',
    orderable: false,
  },
  {
    title: 'Email',
    key: 'email',
  },
  {
    title: 'Acciones',
    key: 'Acciones',
  },
]

const deleteItem = async (id: number) => {
  const confirm = await preguntaEliminar('¿Desea Eliminar User?')
  if (!confirm) {
    return
  }
  try {
    const respuesta = await deleted(`api/admin/modulo-usuarios/users/${id}`)

    success(respuesta.message)
    if (dataTable.value) {
      dataTable.value.getItems()
    }
  } catch (errorCarpturado) {
    manejaError(errorCarpturado)
  }
}
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-4">
    <h1 v-text="'Listado de usuarios'"/>
    <VBtn
      v-if="can('crear usuarios', 'usuarios')"
      class="ml-auto"
      color="success"
      to="/admin/modulo-usuarios/usuarios/create"
    >
      <VIcon class="mr-2 ri-add-large-fill"/>
      Nuev@ User
    </VBtn>
  </div>
  <DataTableComponent
    :columnas="headers"
    endpoint="api/admin/modulo-usuarios/users"
    :cantidadPorPagina="10"
    :cantidadPorPaginaOpciones="[10, 20, 30]"
    :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
    ref="dataTable"
    :relaciones="['roles']"
  >
    <template #item.roles="{ item }">
      <VChip
        v-for="rol in item.roles"
        :key="rol.id"
        color="primary"
        class="ma-1"
      >
        {{ rol.name }}
      </VChip>
    </template>

    <template #item.Acciones="{ item }">
      <VBtn
        v-if="can('ver usuarios', 'usuarios')"
        icon="ri-eye-line"
        variant="tonal"
        color="info"
        :to="`/admin/modulo-usuarios/usuarios/show/${item.id}` "
        class="mr-1"
      />
      <VBtn
        v-if="can('editar usuarios', 'usuarios')"
        icon="ri-edit-box-line"
        variant="tonal"
        color="warning"
        :to="`/admin/modulo-usuarios/usuarios/edit/${item.id}`"
        class="mr-1"
      />
      <VBtn
        v-if="can('eliminar usuarios', 'usuarios')"
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
