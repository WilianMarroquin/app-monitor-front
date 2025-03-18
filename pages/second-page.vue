<script setup>
const { can } = useAbility()
const usuarioAutenticado = useSanctumUser()

console.log(usuarioAutenticado.value)
</script>

<template>
  <div>
    <h1>Bienvenido</h1>
    <VBtn v-if="can('create', 'post')">Crear Post</VBtn>
    <VBtn v-if="can('delete', 'user')">Eliminar Usuario</VBtn>
  </div>
</template>
