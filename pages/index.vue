<script lang="ts" setup>
import {can} from "@layouts/plugins/casl";

const data = ref([
  {
    title: 'id',
    key: 'id',
  },
  {
    title: 'nombre',
    key: 'nombre',
  },
  {
    title: 'descripcion',
    key: 'descripcion',
  },
  {
    title: 'Acciones',
    key: 'Acciones',
  },
])


</script>

<template>
  <VBtn
    icon="ri-edit-box-line"
    variant="tonal"
    color="warning"
  />

  <DataTableComponent
    :columnas="data"
    endpoint="api/pruebas"
    :cantidadPorPagina="10"
    :cantidadPorPaginaOpciones="[10, 20, 30]"
    :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
    titulo="Listado de usuarios"
  >
    <template #item.Acciones="{ item }">

      <VBtn
        icon
        variant="text"
        color="primary"
        :to="'/pruebas/show/' + item.id "
      >
        jeje
      </VBtn>
      <VBtn
        v-if="can('editar pruebas', 'pruebas')"
        icon
        variant="text"
        color="primary"
        :to="'/pruebas/edit/' + item.id "
      >
        <VIcon icon="tabler-edit" />
      </VBtn>
      <VBtn
        v-if="can('eliminar pruebas', 'pruebas')"
        icon
        color="error"
        variant="text"
        @click="deleteItem(item.id)"
      >
        <VIcon icon="tabler-trash" />
      </VBtn>

    </template>
  </DataTableComponent>

</template>
