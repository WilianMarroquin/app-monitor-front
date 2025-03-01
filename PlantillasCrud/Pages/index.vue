<script setup lang="ts">
//
//definePageMeta({
//  middleware: 'permissions',
//  action: 'listar {{ modelPlural }}', // Acción requerida
//  subject: '{{ modelPlural }}',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
//});

import {can} from "@layouts/plugins/casl";

const { get , deleted } = useClienteRequest();

const { showToastSuccess, showToastError, preguntaEliminar } = useToast()

const headers =  {{ headers }}

const deleteItem = async (id: number) => {

  const confirm = await preguntaEliminar('¿Desea Eliminar {{ model }}?' );

  if (!confirm) return;

    try {

      const respuesta = await deleted('{{ url }}/' + id);

      showToastSuccess(respuesta.message);

      await getItems();

    } catch (error) {

      showToastError(error.message);

    }

}

</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <VBtn
      v-if="can('crear {{ modelPlural }}', '{{ modelPlural }}')"
      class="ml-auto"
      color="success"
      to="/{{ directory }}/create"
    >
      Nuev@ {{ model }}
    </VBtn>
  </div>

  <VCard tile="{{ model }}">

    <VCardText>

      <DataTableComponent
        :columnas="headers"
        endpoint="{{ url }}"
        :cantidadPorPagina="10"
        :cantidadPorPaginaOpciones="[10, 20, 30]"
        :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
        titulo="Listado de usuarios"
      />

    </VCardText>

  </VCard>

</template>

<style scoped lang="scss">

</style>
