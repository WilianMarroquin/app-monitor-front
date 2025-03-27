<script setup lang="ts">
import type { UsuarioInterface } from '@/types/admin/modulo-usuarios/types';
import type { VForm } from 'vuetify/lib/components/VForm'

const isFormValid = ref(false)
const refForm = ref<VForm>()
const data = ref(<UsuarioInterface>
  {
    primer_nombre: null,
    segundo_nombre: null,
    primer_apellido: null,
    segundo_apellido: null,
    usuario: null,
    password: null,
    password_confirmation: null,
  },
)

interface Emit {
  (e: 'emitirDatos', value: UsuarioInterface): void
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
          v-model="data.primer_nombre"
          :rules="[requiredValidator]"
          label="Primer Nombre"
          placeholder="Ingrese Primer Nombre"
          required
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          :id="useId()"
          v-model="data.segundo_nombre"
          label="Segundo Nombre"
          placeholder="Ingrese Segundo Nombre"
          required
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          :id="useId()"
          v-model="data.primer_apellido"
          :rules="[requiredValidator]"
          label="Primer Apellido"
          placeholder="Ingrese Primer Apellido"
          required
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          :id="useId()"
          v-model="data.segundo_apellido"
          label="Segundo Apellido"
          placeholder="Ingrese Segundo Apellido"
          required
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          :id="useId()"
          v-model="data.usuario"
          :rules="[requiredValidator]"
          label="Usuario"
          placeholder="Ingrese Usuario"
          required
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          :id="useId()"
          v-model="data.email"
          :rules="[requiredValidator]"
          label="Email"
          placeholder="Ingrese Email"
          required
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          :id="useId()"
          v-model="data.password"
          :rules="[requiredValidator]"
          label="Contraseña"
          placeholder="Ingrese Password"
          required
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          :id="useId()"
          v-model="data.password_confirmation"
          :rules="[requiredValidator]"
          label="Confirmar Contraseña"
          placeholder=""
          required
        />
      </VCol>

      <VCol cols="12" class="d-flex flex-wrap justify-end ">
        <VBtn
          type="reset"
          variant="tonal"
          color="error"
          to="/admin/modulo-usuarios/usuarios"
          class="me-3"
        >
          <VIcon class="mr-2 ri-contract-left-fill"/>
          Cancel
        </VBtn>
        <VBtn
          type="submit"
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
