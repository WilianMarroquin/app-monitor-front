<style scoped>

</style>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 ">

    <p class="text-2xl">
      Administrar Menu
    </p>

    <VBtn
      class="ms-auto"
      style="inline-size: 18rem;"
      prepend-icon="tabler-plus"
      to="/admin/menu/create"
    >
      Nueva Opción
    </VBtn>
  </div>

  <VCard>

    <VCardText>

      <ListaOpciones :opciones="opcionesMenu"
                     @ItemsActualizadas="actualizarOpciones"
      />

    </VCardText>

  </VCard>

</template>

<script lang="ts" setup>
//
//definePageMeta({
//  middleware: 'permissions',
//  action: 'ver opcion menu', // Acción requerida
//  subject: 'menu opcion', // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
//})

const {post} = useClienteRequest();
const {showToastSuccess, showToastError} = useToast();
const {paginaEspera} = useCargandoPagina();

import ListaOpciones from '@/views/pages/admin/menu-opciones/components/ListaOpciones.vue';
import type {MenuOpcionInterface} from "@/types/admin/MenuOpcionInterface";

const opcionesMenu = <[]>useState('menu');

const actualizarOpciones = async (opciones: MenuOpcionInterface[]): Promise<void> => {

  let opcionesAplanadas: MenuOpcionInterface[] = flattenOptions(opciones);

  try {

    let data = {
      opciones: opcionesAplanadas
    };

    paginaEspera.value = true;

    const respuesta = await post('api/menu_opciones/actualizar/orden', data);

    opcionesMenu.value = respuesta.data;

    showToastSuccess(respuesta.message);

  } catch (error: { message: string }) {

    showToastError(error.message);

  } finally {

    paginaEspera.value = false;

  }

};

function flattenOptions(options: MenuOpcionInterface[]): MenuOpcionInterface[] {

  let flattened: MenuOpcionInterface[] = [];

  for (const option of options) {

    const {children, ...currentOption} = option;
    flattened.push(currentOption as MenuOpcionInterface);

    if (children && Array.isArray(children)) {
      flattened = flattened.concat(flattenOptions(children));
    }
  }

  return flattened;

}

</script>
