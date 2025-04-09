<script setup lang="ts">
import type { ConfiguracionInterface } from '@/types/admin/configuraciones/types'
import type { VForm } from 'vuetify/lib/components/VForm'

const props = defineProps({
  item: {
    type: Object || null,
    default: null,
  },
},
)

const emit = defineEmits<Emit>()
const isFormValid = ref(false)
const refForm = ref<VForm>()

const data = ref<ConfiguracionInterface>(
  {
    key: null,
    value: null,
    descripcion: null,
  },
)

interface Emit {

  (e: 'emitirDatos', value: ConfiguracionInterface): void

}

if (props.item)
  data.value = props.item

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid)
      emit('emitirDatos', data.value)
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
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          :id="useId()"
          v-model="data.key"
          :rules="[requiredValidator]"
          label="Key"
          placeholder="Ingrese Key"
          required
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          :id="useId()"
          v-model="data.value"
          :rules="[requiredValidator]"
          label="Value"
          placeholder="Ingrese Value"
          required
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          :id="useId()"
          v-model="data.descripcion"
          :rules="[requiredValidator]"
          label="Descripcion"
          placeholder="Ingrese Descripcion"
          required
        />
      </VCol>

      <VCol cols="12">
        <VBtn
          type="submit"
          class="me-3"
        >
          <VIcon class="mr-2 ri-save-3-fill" />
          Guardar
        </VBtn>
        <VBtn
          type="reset"
          variant="tonal"
          color="error"
          to="/configuraciones"
        >
          <VIcon class="mr-2 ri-contract-left-fill" />
          Cancel
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
