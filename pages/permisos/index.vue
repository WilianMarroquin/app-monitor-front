<script setup lang="ts">
//
//definePageMeta({
//  middleware: 'permissions',
//  action: 'listar permisos', // Acción requerida
//  subject: 'permisos',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
//});

import {can} from "@layouts/plugins/casl";

const { get , deleted } = useClienteRequest();

const { showToastSuccess, showToastError, preguntaEliminar } = useToast()

const headers =  [
  {
    "title": "Name",
    "value": "name"
  },
  {
    "title": "Subject",
    "value": "subject"
  },
  {
    "title": "Guard Name",
    "value": "guard_name"
  },
  {
    "title": "Acciones",
    "value": "Acciones"
  }
]

const deleteItem = async (id: number) => {

  const confirm = await preguntaEliminar('¿Desea Eliminar Permission?' );

  if (!confirm) return;

    try {

      const respuesta = await deleted('api/permissions/' + id);

      showToastSuccess(respuesta.message);

      await getItems();

    } catch (error) {

      showToastError(error.message);

    }

}

</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-4">
    <h1 v-text="'Listado de permisos'"/>
    <VBtn
      v-if="can('crear permisos', 'permissiones')"
      class="ml-auto"
      color="success"
      to="/permissiones/create"
    >
      <VIcon class="mr-2 ri-add-large-fill"/>
      Nuev@ Permission
    </VBtn>
  </div>

      <DataTableComponent
        :columnas="headers"
        endpoint="api/permissions"
        :cantidadPorPagina="10"
        :cantidadPorPaginaOpciones="[10, 20, 30]"
        :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
      >
        <template #item.Acciones="{ item }">
          <VBtn
            v-if="can('ver permisos', 'permissiones')"
            icon="ri-eye-line"
            variant="tonal"
            color="info"
            :to="'/permisos/show/' + item.id "
            class="mr-1"
          />
          <VBtn
            v-if="can('editar permisos', 'permissiones')"
            icon="ri-edit-box-line"
            variant="tonal"
            color="warning"
            :to="'/permisos/edit/' + item.id "
            class="mr-1"
          />
          <VBtn
            v-if="can('eliminar permisos', 'permissiones')"
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
