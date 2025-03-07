<script setup lang="ts">
import { onMounted } from 'vue'

const { showToast } = useToastImprove()

onMounted(() => {
  showToast('Hola mundo', 'success', { autoClose: 2000, position: 'bottom-right' })
})
</script>

<template>
</template>
