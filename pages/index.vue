<script lang="ts" setup>
const { showToastSuccess, showToastError, showToastWarning, showToastInfo } = useToast()
</script>

<template>
  <VBtn @click="showToastSuccess('listo')">Show Success Toast</VBtn>
  <VBtn @click="showToastError('Error')">Show Error Toast</VBtn>
  <VBtn @click="showToastWarning('warnign')">Show Warning Toast</VBtn>
  <VBtn @click="showToastInfo('info')">Show Info Toast</VBtn>
</template>
