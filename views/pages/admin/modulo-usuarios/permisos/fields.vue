<script setup lang="ts">
import type { VForm } from 'vuetify/lib/components/VForm'
import type { PermisoInterface } from '@/types/admin/modulo-usuarios/types'

const isFormValid = ref(false)
const refForm = ref<VForm>()
const data = ref<PermisoInterface>({
  name: null,
  subject: null,
  guard_name: null,
})

interface Emit {
  (e: 'emitirDatos', value: PermisoInterface): void
}

const props = defineProps({
    item: {
      type: Object || null,
      default: null,
    },
  },
)
const emit = defineEmits<Emit>()

if (props.item) {
  data.value = props.item
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
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
      <VCol cols="12" class="text-end">
        <VBtn
          type="reset"
          variant="outlined"
          color="secondary"
          class="mr-1"
          @click="refForm.value?.reset()"
        >
          <VIcon class="mr-2 ri-contract-left-fill"/>
          Limpiar Campos
        </VBtn>
        <VBtn
          type="submit"
          class="me-3"
        >
          <VIcon class="mr-2 ri-save-3-fill"/>
          Guardar
        </VBtn>
      </VCol>
    </VRow>

  </VForm>

</template>

<style scoped lang="scss">

</style>
