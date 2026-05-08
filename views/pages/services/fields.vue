<script setup lang="ts">

import type {VForm} from "vuetify/lib/components/VForm";

const isFormValid = ref(false)

const refForm = ref<VForm>()

import type { ServiceInterface } from '@/types/services/types.ts';

const data = ref( <ServiceInterface>
  { name: null,
description: null,
type: null,
is_active: null,
testMethod: null,
httpMethod: null }
)

interface Emit {

  (e: 'emitirDatos', value: ServiceInterface ): void

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
    
    <VCol cols="12" md="6">
      <VTextField
        v-model="data.name"
        :rules="[requiredValidator]"
        label="Name"
        placeholder="Ingrese Name"
      />
    </VCol>
  
    <VCol cols="12" md="6">
      <VTextField
        v-model="data.description"
        :rules="[requiredValidator]"
        label="Description"
        placeholder="Ingrese Description"
      />
    </VCol>
  
    <VCol cols="12" md="6">
      <VTextField
        v-model="data.type"
        :rules="[requiredValidator]"
        label="Type"
        placeholder="Ingrese Type"
      />
    </VCol>
  
    <VCol cols="12" md="6">
      <VTextField
        v-model="data.is_active"
        :rules="[requiredValidator]"
        label="Is Active"
        placeholder="Ingrese Is Active"
      />
    </VCol>
  
    <VCol cols="12" md="6">
      <VTextField
        v-model="data.testMethod"
        :rules="[requiredValidator]"
        label="TestMethod"
        placeholder="Ingrese TestMethod"
      />
    </VCol>
  
    <VCol cols="12" md="6">
      <VTextField
        v-model="data.httpMethod"
        :rules="[requiredValidator]"
        label="HttpMethod"
        placeholder="Ingrese HttpMethod"
      />
    </VCol>
  
      <VCol cols="12">
        <VBtn
          type="submit"
          class="me-3"
        >
          <VIcon class="mr-2 ri-save-3-fill"/>
          Guardar
        </VBtn>
        <VBtn
          type="reset"
          variant="tonal"
          color="error"
          to="/services"
        >
          <VIcon class="mr-2 ri-contract-left-fill"/>
          Cancel
        </VBtn>
      </VCol>
    </VRow>

  </VForm>

</template>

<style scoped lang="scss">

</style>
