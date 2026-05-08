<script setup lang="ts">
import { ref } from "vue";
import type { VForm } from "vuetify/lib/components/VForm";
import type { ServerInterface } from '@/types/serveres/types.ts';

const isFormValid = ref(false)
const refForm = ref<VForm>()

const data = ref<ServerInterface>({
  name: null,
  description: null,
  internal_ip: null,
  external_ip: null,
  entorno: null
})

// === OPCIONES DEL SELECTOR ===
const entornos = ['Desarrollo', 'Producción']

interface Emit {
  (e: 'emitirDatos', value: ServerInterface ): void
}

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})

const emit = defineEmits<Emit>()

if (props.item) {
  data.value = { ...props.item }
}

const onSubmit = () => {
  refForm.value?.validate().then(({valid}) => {
    if (valid) {
      emit('emitirDatos', data.value)
    }
  })
}
</script>

<template>
  <VForm
    ref="refForm"
    v-model="isFormValid"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <VCol cols="12" md="6">
        <VTextField
          v-model="data.name"
          :rules="[requiredValidator]"
          label="Nombre"
          placeholder="Ej: Servidor DB Principal"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="data.description"
          :rules="[requiredValidator]"
          label="Descripción"
          placeholder="Breve descripción del servidor"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="data.internal_ip"
          :rules="[requiredValidator]"
          label="IP Interna"
          placeholder="Ej: 192.168.1.10"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="data.external_ip"
          label="IP Externa"
          placeholder="Ej: 10.12.203.21 (Opcional)"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VSelect
          v-model="data.entorno"
          :items="entornos"
          :rules="[requiredValidator]"
          label="Entorno"
          placeholder="Seleccione el entorno"
        />
      </VCol>

      <VCol cols="12">
        <VBtn
          type="submit"
          class="me-3"
          color="primary"
        >
          <VIcon class="mr-2 ri-save-3-fill"/>
          Guardar
        </VBtn>
        <VBtn
          type="reset"
          variant="tonal"
          color="error"
          to="/servers"
        >
          <VIcon class="mr-2 ri-contract-left-fill"/>
          Cancelar
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<style scoped lang="scss">
</style>
