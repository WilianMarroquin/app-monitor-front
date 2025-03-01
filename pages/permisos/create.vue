<script setup lang="ts">

// definePageMeta({
//   middleware: 'permissions',
//   action: 'crear permisos', // Acción requerida
//   subject: 'permisos',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
// });

import fields from '@/views/pages/permissiones/fields.vue'

import type { PermissionInterface } from '@/types/admin/PermisoInterface.ts';

import {ref} from "vue";

const { post  } = useClienteRequest();

const { showToastSuccess, showToastError } = useToast();

const requestInProgress = ref(false) // Evitar solicitudes concurrentes
const { paginaEspera } = useCargandoPagina();

const guardarPermission = async ( Permission: PermissionInterface ): Promise<void> => {

  if (!requestInProgress.value) {

    requestInProgress.value = true // Establecer bandera de solicitud en progreso
    paginaEspera.value = true // Activar indicador de carga

    try {

      const respuesta: { message: string } = await post('api/permissions', Permission );

      showToastSuccess(respuesta.message);

      navigateTo('/permisos');

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
    <h1 v-text="'Crear Permission'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/permisos/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>

    <VCardText>

      <fields :fields="fields"
              @emitirDatos="guardarPermission"
      />

    </VCardText>

  </VCard>

</template>

<style scoped lang="scss">

</style>
