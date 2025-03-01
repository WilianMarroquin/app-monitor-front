<script setup lang="ts">

// definePageMeta({
//   middleware: 'permissions',
//   action: 'crear {{ modelPlural }}', // Acción requerida
//   subject: '{{ modelPlural }}',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
// });

import fields from '@/views/pages/{{ modelPlural }}/fields.vue'

import type { {{ model }}Interface } from '@/types/{{ modelPlural }}/index.ts';

import {ref} from "vue";

const { post  } = useClienteRequest();

const { showToastSuccess, showToastError } = useToast();

const requestInProgress = ref(false) // Evitar solicitudes concurrentes
const { paginaEspera } = useCargandoPagina();

const guardar{{ model }} = async ( {{ model }}: {{ model }}Interface ): Promise<void> => {

  if (!requestInProgress.value) {

    requestInProgress.value = true // Establecer bandera de solicitud en progreso
    paginaEspera.value = true // Activar indicador de carga

    try {

      const respuesta: { message: string } = await post('{{ url }}', {{ model }} );

      showToastSuccess(respuesta.message);

      navigateTo('/{{ directory }}');

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

    <VBtn
      class="ml-auto"
      color="secondary"
      to="/{{ directory }}/"
    >
      Regresar
    </VBtn>

  </div>

  <VCard>

    <VCardItem>

      <VCardTitle>Crear {{ model }}</VCardTitle>

    </VCardItem>

    <VCardText>

      <fields :fields="fields"
              @emitirDatos="guardar{{ model }}"
      />

    </VCardText>

  </VCard>

</template>

<style scoped lang="scss">

</style>
