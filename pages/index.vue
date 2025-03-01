<script lang="ts" setup>
// const data = ref([
//   {
//     title: 'id',
//     key: 'id',
//   },
//   {
//     title: 'nombre',
//     key: 'nombre',
//   },
//   {
//     title: 'descripcion',
//     key: 'descripcion',
//   },
// ])

const requiredValidator = (v: string) => !!v || 'Este campo es requerido'

const data = ref({
  nombre: '',
  descripcion: '',
})


</script>

<template>
<!--  <DataTableComponent-->
<!--    :columnas="data"-->
<!--    endpoint="api/pruebas"-->
<!--    :cantidadPorPagina="10"-->
<!--    :cantidadPorPaginaOpciones="[10, 20, 30]"-->
<!--    :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"-->
<!--    titulo="Listado de usuarios"-->
<!--  />-->

  <h1>hola</h1>



</template>
