<script setup lang="ts">
const archivos = ref<File[]>([])
</script>

<template>
  <VCard title="Ejemplo de componente de input de archivo: " class="mb-1">
    <VCardText>
      <FileInput
        multiple
        v-model:archivos="archivos"
      />
    </VCardText>
  </VCard>
</template>
