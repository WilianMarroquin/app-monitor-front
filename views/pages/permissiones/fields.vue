<script setup lang="ts">

import type {VForm} from "vuetify/lib/components/VForm";

const isFormValid = ref(false)

const refForm = ref<VForm>()

import type { PermissionInterface } from '@/types/admin/PermisoInterface.ts';

const data = ref( <PermissionInterface>
  { name: null,
subject: null,
guard_name: null }
)

interface Emit {

  (e: 'emitirDatos', value: PermissionInterface ): void

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
                    :id="useId()"
                    v-model="data.name"
                    :rules="[requiredValidator]"
                    label="Name"
                    placeholder="Ingrese Name"
                    required
                />
            </VCol>
        
            <VCol cols="12" md="6">
                <VTextField
                    :id="useId()"
                    v-model="data.subject"
                    :rules="[requiredValidator]"
                    label="Subject"
                    placeholder="Ingrese Subject"
                    required
                />
            </VCol>
        
            <VCol cols="12" md="6">
                <VTextField
                    :id="useId()"
                    v-model="data.guard_name"
                    :rules="[requiredValidator]"
                    label="Guard Name"
                    placeholder="Ingrese Guard Name"
                    required
                />
            </VCol>
        
      <VCol cols="12">
        <VBtn
          type="submit"
          class="me-3"
        >
          <VIcon class="mr-2 ri-save-3-fill"/>
          Submit
        </VBtn>
        <VBtn
          type="reset"
          variant="tonal"
          color="error"
          to="/permissiones"
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
