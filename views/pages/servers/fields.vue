<script setup lang="ts">

import type {VForm} from "vuetify/lib/components/VForm";

const isFormValid = ref(false)

const refForm = ref<VForm>()

import type { ServerInterface } from '@/types/serveres/types.ts';

const data = ref( <ServerInterface>
  { name: null,
description: null,
internal_ip: null,
external_ip: null,
entorno: null }
)

interface Emit {

  (e: 'emitirDatos', value: ServerInterface ): void

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
        v-model="data.internal_ip"
        :rules="[requiredValidator]"
        label="Internal Ip"
        placeholder="Ingrese Internal Ip"
      />
    </VCol>
  
    <VCol cols="12" md="6">
      <VTextField
        v-model="data.external_ip"
        :rules="[requiredValidator]"
        label="External Ip"
        placeholder="Ingrese External Ip"
      />
    </VCol>
  
    <VCol cols="12" md="6">
      <VTextField
        v-model="data.entorno"
        :rules="[requiredValidator]"
        label="Entorno"
        placeholder="Ingrese Entorno"
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
          to="/servers"
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
