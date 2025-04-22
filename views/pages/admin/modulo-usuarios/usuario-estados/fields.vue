<script setup lang="ts">
import type { VForm } from 'vuetify/lib/components/VForm'
import type { UserEstadoInterface } from '@/types/admin/modulo-usuarios/types'

const isFormValid = ref(false)
const refForm = ref<VForm>()

const data = ref<UserEstadoInterface>({
  nombre: null,
})

interface Emit {
  (e: 'emitirDatos', value: UserEstadoInterface): void
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
          v-model="data.nombre"
          :rules="[requiredValidator]"
          label="Nombre"
          placeholder="Ingrese Nombre"
          required
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
          to="/userestados"
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
