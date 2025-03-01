<script setup lang="ts">

definePageMeta({
  middleware: 'permissions',
  action: 'listar {{ modelPlural }}', // Acción requerida
  subject: '{{ modelPlural }}',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
});

import {ref} from "vue";
import {can} from "@layouts/plugins/casl";

const { get , deleted } = useClienteRequest();

const { showToastSuccess, showToastError, preguntaEliminar } = useToast()

const currentPage = ref(1) // Página actual
const itemsPerPage = ref(2) // Elementos por página
const totalItems = ref(0) // Total de elementos en el backend
const loading = ref(false) // Indicador de carga
const search = ref('') // Búsqueda de usuarios

const headers =  {{ headers }}

const items = ref([])

const getItems = async (): Promise<object> => {

  try {

    loading.value = true;

    const respuesta: {data: []} = await get('{{ url }}');

    items.value = respuesta.data;

  } catch (error: {message: string}) {

    console.error(error.message);

  }

  loading.value = false;

}

getItems();

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

  <v-card>

    <v-card-title> {{ model }} </v-card-title>

    <v-card-text>

      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="currentPage"
        :items="items"
        :headers="headers"
        :search="search"
        item-value="id"
        :items-length="totalItems"
        :items-per-page-options="[2, 5, 10, 50, -1]"
        :loading="loading"
      >
        <template #item.Acciones="{ item }">
          <VBtn
            v-if="can('ver {{ modelPlural }}', '{{ modelPlural }}')"
            icon
            variant="text"
            color="primary"
            :to="'/{{ directory }}/show/' + item.id "
          >
            <VIcon icon="tabler-eye" />
          </VBtn>
          <VBtn
            v-if="can('editar {{ modelPlural }}', '{{ modelPlural }}')"
            icon
            variant="text"
            color="primary"
            :to="'/{{ directory }}/edit/' + item.id "
          >
            <VIcon icon="tabler-edit" />
          </VBtn>
          <VBtn
            v-if="can('eliminar {{ modelPlural }}', '{{ modelPlural }}')"
            icon
            color="error"
            variant="text"
            @click="deleteItem(item.id)"
          >
            <VIcon icon="tabler-trash" />
          </VBtn>

        </template>
      </VDataTableServer>

    </v-card-text>

  </v-card>

</template>

<style scoped lang="scss">

</style>
