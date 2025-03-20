<script setup lang="ts">

import type {VForm} from "vuetify/lib/components/VForm";

const isFormValid = ref(false)

const refForm = ref<VForm>()

import type { UserInterface } from '@/types/useres/types.ts';

const data = ref( <UserInterface>
  { primer_nombre: null,
segundo_nombre: null,
primer_apellido: null,
segundo_apellido: null,
usuario: null,
email: null,
email_verified_at: null,
password: null,
remember_token: null }
)

interface Emit {

  (e: 'emitirDatos', value: UserInterface ): void

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
                    :rules="[requiredValidator]"
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
                    :rules="[requiredValidator]"
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
                    v-model="data.email_verified_at"
                    :rules="[requiredValidator]"
                    label="Email Verified At"
                    placeholder="Ingrese Email Verified At"
                    required
                />
            </VCol>
        
            <VCol cols="12" md="6">
                <VTextField
                    :id="useId()"
                    v-model="data.password"
                    :rules="[requiredValidator]"
                    label="Password"
                    placeholder="Ingrese Password"
                    required
                />
            </VCol>
        
            <VCol cols="12" md="6">
                <VTextField
                    :id="useId()"
                    v-model="data.remember_token"
                    :rules="[requiredValidator]"
                    label="Remember Token"
                    placeholder="Ingrese Remember Token"
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
          to="/admin/users"
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
