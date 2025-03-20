<script setup lang="ts">
//
//definePageMeta({
//  middleware: 'permissions',
//  action: 'listar users', // Acción requerida
//  subject: 'users',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
//});

import {can} from "@layouts/plugins/casl";

const {get, deleted} = useClienteRequest();

const {showToastSuccess, showToastError, preguntaEliminar} = useToast()

const headers = [
  {
    "title": "Primer Nombre",
    "value": "primer_nombre"
  },
  {
    "title": "Segundo Nombre",
    "value": "segundo_nombre"
  },
  {
    "title": "Primer Apellido",
    "value": "primer_apellido"
  },
  {
    "title": "Segundo Apellido",
    "value": "segundo_apellido"
  },
  {
    "title": "Usuario",
    "value": "usuario"
  },
  {
    "title": "Email",
    "value": "email"
  },
  {
    "title": "Email Verified At",
    "value": "email_verified_at"
  },
  {
    "title": "Password",
    "value": "password"
  },
  {˚
    "title": "Remember Token",
    "value": "remember_token"
  },
  {
    "title": "Acciones",
    "value": "Acciones"
  }
]

const deleteItem = async (id: number) => {

  const confirm = await preguntaEliminar('¿Desea Eliminar User?');

  if (!confirm) return;

  try {

    const respuesta = await deleted('api/admin/users/' + id);

    showToastSuccess(respuesta.message);

    await getItems();

  } catch (error) {

    showToastError(error.message);

  }

}

</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-4">
    <h1 v-text="'Listado de users'"/>
    <VBtn
      v-if="can('crear users', 'users')"
      class="ml-auto"
      color="success"
      to="/admin/users/create"
    >
      <VIcon class="mr-2 ri-add-large-fill"/>
      Nuev@ User
    </VBtn>
  </div>

  <DataTableComponent
    :columnas="headers"
    endpoint="api/admin/users"
    :cantidadPorPagina="10"
    :cantidadPorPaginaOpciones="[10, 20, 30]"
    :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
  >
    <template #item.Acciones="{ item }">
      <VBtn
        v-if="can('ver users', 'users')"
        icon="ri-eye-line"
        variant="tonal"
        color="info"
        :to="'/admin/users/show/' + item.id "
        class="mr-1"
      />
      <VBtn
        v-if="can('editar users', 'users')"
        icon="ri-edit-box-line"
        variant="tonal"
        color="warning"
        :to="'/admin/users/edit/' + item.id "
        class="mr-1"
      />
      <VBtn
        v-if="can('eliminar users', 'users')"
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
