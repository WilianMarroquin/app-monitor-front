<script setup lang="ts">

definePageMeta({
  middleware: 'permissions',
  action: 'editar {{ modelPlural }}', // Acción requerida
  subject: '{{ modelPlural }}',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
});

import fields from '@/views/pages/{{ modelPlural }}/fields.vue'

import type { {{ model }}Interface } from '@/types/{{ modelPlural }}/index.ts';

import {ref} from "vue";

const { put, get  } = useClienteRequest();

const { showToastSuccess, showToastError } = useToast();

const route = useRoute();

const id = route.params.id;

const {{ model }} = ref(fields);

const { paginaEspera } = useCargandoPagina();
const requestInProgress = ref(false); // Evitar solicitudes concurrentes

const actualizar{{ model }} = async ( {{ model }}: {{ model }}Interface ): Promise<void> => {

  if (!requestInProgress.value) {

    paginaEspera.value = true;
    requestInProgress.value = true;

    try {

      const respuesta = await put('{{ url }}/' + id, {{ model }} );

      showToastSuccess(respuesta.message);

      navigateTo('/{{ directory }}');

    } catch (error) {

      showToastError(error.message);

    } finally {

      paginaEspera.value = false;
      requestInProgress.value = false;

    }

  }

}

const item{{ model }} = ref( <{{ model }}Interface>
{{ camposFormCreate }}
)

const get{{ model }} = async () => {

  try {

    paginaEspera.value = true;

    const respuesta: { data: {{ model }}Interface } = await get('{{ url }}/' + id );

    item{{ model }}.value = respuesta.data;

  } catch (error: { message: string }) {

    showToastError(error.message);

  }

  paginaEspera.value = false;

}

get{{ model }}();

const puedeMostrarDatos = computed(() => {

  return Object.values(item{{ model }} .value).some(valor => valor !== null && valor !== undefined);

});

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

      <VCardTitle>Editar {{ model }}</VCardTitle>

    </VCardItem>

      <VCardText>

        <fields :fields="fields"
                v-if="puedeMostrarDatos"
                :item="item{{ model }}"
                @emitirDatos="actualizar{{ model }}"
        />

      </VCardText>

  </VCard>

</template>

<style scoped lang="scss">

</style>
