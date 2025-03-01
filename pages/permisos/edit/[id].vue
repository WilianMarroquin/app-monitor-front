<script setup lang="ts">

// definePageMeta({
//   middleware: 'permissions',
//   action: 'editar permisos', // Acción requerida
//   subject: 'permisos',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
// });

import fields from '@/views/pages/permissiones/fields.vue'

import type { PermissionInterface } from '@/types/admin/PermisoInterface.ts';

import {ref} from "vue";

const { put, get  } = useClienteRequest();

const { showToastSuccess, showToastError } = useToast();

const route = useRoute();

const id = route.params.id;

const Permission = ref(fields);

const { paginaEspera } = useCargandoPagina();
const requestInProgress = ref(false); // Evitar solicitudes concurrentes

const actualizarPermission = async ( Permission: PermissionInterface ): Promise<void> => {

  if (!requestInProgress.value) {

    paginaEspera.value = true;
    requestInProgress.value = true;

    try {

      const respuesta = await put('api/permissions/' + id, Permission );

      showToastSuccess(respuesta.message);

      navigateTo('/permisos');

    } catch (error) {

      showToastError(error.message);

    } finally {

      paginaEspera.value = false;
      requestInProgress.value = false;

    }

  }

}

const itemPermission = ref( <PermissionInterface>
{ name: null,
subject: null,
guard_name: null }
)

const getPermission = async () => {

  try {

    paginaEspera.value = true;

    const respuesta: { data: PermissionInterface } = await get('api/permissions/' + id );

    itemPermission.value = respuesta.data;

  } catch (error: { message: string }) {

    showToastError(error.message);

  }

  paginaEspera.value = false;

}

getPermission();

const puedeMostrarDatos = computed(() => {

  return Object.values(itemPermission .value).some(valor => valor !== null && valor !== undefined);

});

</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Editar Permission'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/permissiones/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>

      <VCardText>

        <fields :fields="fields"
                v-if="puedeMostrarDatos"
                :item="itemPermission"
                @emitirDatos="actualizarPermission"
        />

      </VCardText>

  </VCard>

</template>

<style scoped lang="scss">

</style>
