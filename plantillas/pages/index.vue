<script lang="ts" setup>

const columnas = {{ headers }}
</script>

<template>
  <DataTableComponent
    :columnas="columnas"
    endpoint="api/users"
    :cantidadPorPagina="10"
    :cantidadPorPaginaOpciones="[10, 20, 30]"
    titulo="Listado de usuarios"
  />
</template>

<style scoped lang="scss">

</style>
