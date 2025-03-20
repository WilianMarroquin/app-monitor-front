<script setup lang="ts">

// definePageMeta({
//   middleware: 'permissions',
//   action: 'ver users', // Acción requerida
//   subject: 'users',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
// });

import type { UserInterface } from '@/types/useres/types.ts';

import {ref} from "vue";

const { get } = useClienteRequest();

const { showToastSuccess, showToastError } = useToast();

const route = useRoute();

const id = route.params.id;

const { paginaEspera } = useCargandoPagina();

const item = ref( <UserInterface>
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

    item.value = respuesta.data;


  } catch (error: { message: string }) {

    showToastError(error.message);

  }

  paginaEspera.value = false;

}

const puedeMostrarDatos = computed(() => {

  return Object.values(item.value).some(valor => valor !== null && valor !== undefined);

});

getUser();

</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Visualizar User'"/>
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

      <VList class="card-list mt-2" v-if="puedeMostrarDatos">

        
              <VListItemTitle>
                <h6 class="text-h6">
                    Primer Nombre:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.primer_nombre }}
                  </div>
                </h6>
              </VListItemTitle>
            
              <VListItemTitle>
                <h6 class="text-h6">
                    Segundo Nombre:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.segundo_nombre }}
                  </div>
                </h6>
              </VListItemTitle>
            
              <VListItemTitle>
                <h6 class="text-h6">
                    Primer Apellido:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.primer_apellido }}
                  </div>
                </h6>
              </VListItemTitle>
            
              <VListItemTitle>
                <h6 class="text-h6">
                    Segundo Apellido:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.segundo_apellido }}
                  </div>
                </h6>
              </VListItemTitle>
            
              <VListItemTitle>
                <h6 class="text-h6">
                    Usuario:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.usuario }}
                  </div>
                </h6>
              </VListItemTitle>
            
              <VListItemTitle>
                <h6 class="text-h6">
                    Email:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.email }}
                  </div>
                </h6>
              </VListItemTitle>
            
              <VListItemTitle>
                <h6 class="text-h6">
                    Email Verified At:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.email_verified_at }}
                  </div>
                </h6>
              </VListItemTitle>
            
              <VListItemTitle>
                <h6 class="text-h6">
                    Password:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.password }}
                  </div>
                </h6>
              </VListItemTitle>
            
              <VListItemTitle>
                <h6 class="text-h6">
                    Remember Token:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.remember_token }}
                  </div>
                </h6>
              </VListItemTitle>
            

      </VList>

    </VCardText>

  </VCard>

</template>

<style scoped lang="scss">

</style>
