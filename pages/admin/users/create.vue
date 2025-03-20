<script setup lang="ts">

// definePageMeta({
//   middleware: 'permissions',
//   action: 'crear users', // Acción requerida
//   subject: 'users',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
// });

import fields from '@/views/pages/useres/fields.vue'

import type { UserInterface } from '@/types/useres/types.ts';

import {ref} from "vue";

const { post  } = useClienteRequest();

const { showToastSuccess, showToastError } = useToast();

const requestInProgress = ref(false) // Evitar solicitudes concurrentes
const { paginaEspera } = useCargandoPagina();

const guardarUser = async ( User: UserInterface ): Promise<void> => {

  if (!requestInProgress.value) {

    requestInProgress.value = true // Establecer bandera de solicitud en progreso
    paginaEspera.value = true // Activar indicador de carga

    try {

      const respuesta: { message: string } = await post('api/admin/users', User );

      showToastSuccess(respuesta.message);

      navigateTo('/admin/users');

    } catch (error: any) {

      showToastError(error.message);

    }  finally {

      paginaEspera.value = false // Desactivar indicador de carga
      requestInProgress.value = false // Liberar la bandera

    }
  }

}

</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Crear User'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/admin/users/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>

    <VCardText>

      <fields :fields="fields"
              @emitirDatos="guardarUser"
      />

    </VCardText>

  </VCard>

</template>

<style scoped lang="scss">

</style>
