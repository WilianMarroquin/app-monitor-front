<script setup lang="ts">

import type {VForm} from "vuetify/lib/components/VForm";

const isFormValid = ref(false)

const refForm = ref<VForm>()

import type { IncidentInterface } from '@/types/incidentes/types.ts';

const data = ref( <IncidentInterface>
  { description: null,
status: null,
opened_at: null,
resolved_at: null,
service_id: null,
ping_id: null }
)

interface Emit {

  (e: 'emitirDatos', value: IncidentInterface ): void

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
        v-model="data.description"
        :rules="[requiredValidator]"
        label="Description"
        placeholder="Ingrese Description"
      />
    </VCol>
  
    <VCol cols="12" md="6">
      <VTextField
        v-model="data.status"
        :rules="[requiredValidator]"
        label="Status"
        placeholder="Ingrese Status"
      />
    </VCol>
  
    <VCol cols="12" md="6">
      <VTextField
        v-model="data.opened_at"
        :rules="[requiredValidator]"
        label="Opened At"
        placeholder="Ingrese Opened At"
      />
    </VCol>
  
    <VCol cols="12" md="6">
      <VTextField
        v-model="data.resolved_at"
        :rules="[requiredValidator]"
        label="Resolved At"
        placeholder="Ingrese Resolved At"
      />
    </VCol>
  
    <VCol cols="12" md="6">
      <VTextField
        v-model="data.service_id"
        :rules="[requiredValidator]"
        label="Service"
        placeholder="Ingrese Service"
      />
    </VCol>
  
    <VCol cols="12" md="6">
      <VTextField
        v-model="data.ping_id"
        :rules="[requiredValidator]"
        label="Ping"
        placeholder="Ingrese Ping"
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
          to="/incidents"
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
