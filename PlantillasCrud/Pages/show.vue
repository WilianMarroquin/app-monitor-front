<script setup lang="ts">

// definePageMeta({
//   middleware: 'permissions',
//   action: 'ver {{ modelPlural }}', // Acción requerida
//   subject: '{{ modelPlural }}',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
// });

import type { {{ model }}Interface } from '@/types/{{ modelPlural }}/index.ts';

import {ref} from "vue";

const { get } = useClienteRequest();

const { showToastSuccess, showToastError } = useToast();

const route = useRoute();

const id = route.params.id;

const { paginaEspera } = useCargandoPagina();

const item = ref( <{{ model }}Interface>
{{ camposFormCreate }}
)

const get{{ model }} = async () => {

  try {

    paginaEspera.value = true;

    const respuesta: { data: {{ model }}Interface } = await get('{{ url }}/' + id );

    item.value = respuesta.data;


  } catch (error: { message: string }) {

    showToastError(error.message);

  }

  paginaEspera.value = false;

}

const puedeMostrarDatos = computed(() => {

  return Object.values(item.value).some(valor => valor !== null && valor !== undefined);

});

get{{ model }}();

</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Visualizar {{ model }}'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/{{ directory }}/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>
  </div>

  <VCard>

    <VCardText>

      <VList class="card-list mt-2" v-if="puedeMostrarDatos">

        {{ camposForm }}

      </VList>

    </VCardText>

  </VCard>

</template>

<style scoped lang="scss">

</style>
