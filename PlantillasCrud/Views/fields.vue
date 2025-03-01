<script setup lang="ts">

import type {VForm} from "vuetify/lib/components/VForm";

const isFormValid = ref(false)

const refForm = ref<VForm>()

import type { {{ model }}Interface } from '@/types/{{ modelPlural }}/index.ts';

const data = ref( <{{ model }}Interface>
  {{ camposFormCreate }}
)

interface Emit {

  (e: 'emitirDatos', value: {{ model }}Interface ): void

}

const props = defineProps({
    item: {
      type: Object || null,
      default: null
    }
  }
)
const emit = defineEmits<Emit>()

if (props.item) {
  data.value = props.item
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
    {{ inputsFormulario }}
      <VCol cols="12">
        <VBtn
          type="submit"
          class="me-3"
        >
          Submit
        </VBtn>
        <VBtn
          type="reset"
          variant="tonal"
          color="error"
          to="/{{ directory }}"
        >
          Cancel
        </VBtn>
      </VCol>
    </VRow>

  </VForm>

</template>

<style scoped lang="scss">

</style>
