<template>
  <div>
    <button @click="confirmarEliminacion">Eliminar Item</button>
  </div>
</template>

<script setup>
const { preguntaEliminar } = useToast()

const confirmarEliminacion = async () => {
  const respuesta = await preguntaEliminar()
  if (respuesta) {
    console.log('Eliminación confirmada')
    // Aquí puedes agregar la lógica para eliminar el elemento
  } else {
    console.log('Eliminación cancelada')
  }
}
</script>
