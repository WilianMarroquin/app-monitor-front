<script setup lang="ts">

// definePageMeta({
//   middleware: 'permissions',
//   action: 'editar users', // Acción requerida
//   subject: 'users',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
// });

import fields from '@/views/pages/useres/fields.vue'

import type { UserInterface } from '@/types/useres/types.ts';

import {ref} from "vue";

const { put, get  } = useClienteRequest();

const { showToastSuccess, showToastError } = useToast();

const route = useRoute();

const id = route.params.id;

const User = ref(fields);

const { paginaEspera } = useCargandoPagina();
const requestInProgress = ref(false); // Evitar solicitudes concurrentes

const actualizarUser = async ( User: UserInterface ): Promise<void> => {

  if (!requestInProgress.value) {

    paginaEspera.value = true;
    requestInProgress.value = true;

    try {

      const respuesta = await put('api/admin/users/' + id, User );

      showToastSuccess(respuesta.message);

      navigateTo('/admin/users');

    } catch (error) {

      showToastError(error.message);

    } finally {

      paginaEspera.value = false;
      requestInProgress.value = false;

    }

  }

}

const itemUser = ref( <UserInterface>
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

const getUser = async () => {

  try {

    paginaEspera.value = true;

    const respuesta: { data: UserInterface } = await get('api/admin/users/' + id );

    itemUser.value = respuesta.data;

  } catch (error: { message: string }) {

    showToastError(error.message);

  }

  paginaEspera.value = false;

}

getUser();

const puedeMostrarDatos = computed(() => {

  return Object.values(itemUser .value).some(valor => valor !== null && valor !== undefined);

});

</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Editar User'"/>
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
                v-if="puedeMostrarDatos"
                :item="itemUser"
                @emitirDatos="actualizarUser"
        />

      </VCardText>

  </VCard>

</template>

<style scoped lang="scss">

</style>
