<script setup lang="ts">

import type {VForm} from "vuetify/lib/components/VForm";

const isFormValid = ref(false)

const refForm = ref<VForm>()

import type { NotificationContactInterface } from '@/types/notificationcontactes/types.ts';

const data = ref( <NotificationContactInterface>
  { nombres: null,
apellidos: null,
telefono: null }
)

interface Emit {

  (e: 'emitirDatos', value: NotificationContactInterface ): void

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
        v-model="data.nombres"
        :rules="[requiredValidator]"
        label="Nombres"
        placeholder="Ingrese Nombres"
      />
    </VCol>
  
    <VCol cols="12" md="6">
      <VTextField
        v-model="data.apellidos"
        :rules="[requiredValidator]"
        label="Apellidos"
        placeholder="Ingrese Apellidos"
      />
    </VCol>
  
    <VCol cols="12" md="6">
      <VTextField
        v-model="data.telefono"
        :rules="[requiredValidator]"
        label="Telefono"
        placeholder="Ingrese Telefono"
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
          to="/notification-contacts"
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
