<script lang="ts" setup>

// definePageMeta({
//   middleware: 'permissions',
//   action: 'crear opcion menu',
//   subject: 'menu opcion',
// })

import Fields from '@/views/pages/admin/menu-opciones/fields.vue'
import type { MenuOpcionInterface } from "@/types/admin/MenuOpcionInterface"
import type { PermisoInterface } from "@/types/admin/PermisoInterface"

const route = useRoute<{ parentId: string }>();

const parentId = <string>route.params.parentId;

const {post, get} = useClienteRequest();
const {paginaEspera} = useCargandoPagina();
const {showToastError, showToastSuccess} = useToast();

const menu = useState('menu');

const guardarOpcion = async (data: MenuOpcionInterface) => {

  paginaEspera.value = true;

  let datos = {
    ...data,
    parent_id: parentId
  };

  try {

    let res = await post('api/menu-opciones', datos);

    showToastSuccess(res.message);

    menu.value = res.data;

    navigateTo('/admin/menu');

  } catch (error: { message: string }) {

    showToastError(error.message);

  } finally {

    paginaEspera.value = false;

  }

};

const permisos = ref<PermisoInterface>({} as PermisoInterface);

const getPermisos = async (): Promise<void> => {

  try {

    paginaEspera.value = true;

    const response: { data: PermisoInterface } = await get('api/permissions', {
      params: {
        'page[size]': -1
      }
    });

    permisos.value = response.data.data;

  } catch (error: { message: string }) {

    showToastError(error.message);

  } finally {

    paginaEspera.value = false;

  }

};

getPermisos();


const puedeMostrarDatos = computed(() => {


  return Array.isArray(permisos.value) && permisos.value.length > 0

});

</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6">

    <p class="text-2xl">
      Agregar Subopción
    </p>

    <VBtn
      class="ml-auto"
      color="secondary"
      @click="navigateTo('/admin/menu')"
    >
      Regresar
    </VBtn>
  </div>

  <VCard>

    <VCardText>

      <Fields v-if="puedeMostrarDatos"
              :item="{}"
              :mostrar-titulo-seccion="false"
              :parentId="parentId"
              :permisos="permisos"
              @datos="guardarOpcion"
      />

    </VCardText>

  </VCard>


</template>
