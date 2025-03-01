<script lang="ts" setup>
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
])
</script>

<template>
  <DataTableComponent
    :columnas="data"
    endpoint="api/pruebas"
    :cantidadPorPagina="10"
    :cantidadPorPaginaOpciones="[10, 20, 30]"
    :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
    titulo="Listado de usuarios"
  />
</template>
