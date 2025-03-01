<script lang="ts" setup>

definePageMeta({
  middleware: 'permissions',
  action: 'editar opcion menu',
  subject: 'menu opcion',
})

import Fields from '@/views/admin/menuOpciones/fields.vue';
import type {MenuOpcion, RespuestaRequest} from "@/types/admin/menu-opciones/types";

import type {Permission} from "@/types/admin/permisos/types";

const {put, get} = useClienteRequest();

const {showToastSuccess, showToastError} = useToast();

const {paginaEspera} = useCargandoPagina();

const route = useRoute<{ id: number }>();

const id = <number>route.params.id;

const opcion = ref<MenuOpcion>({} as MenuOpcion);

const permisos = ref<Permission>({} as Permission);

const menu = useState('menu');

const actualizarOpcion = async (opcion: MenuOpcion): Promise<void> => {

  try {

    paginaEspera.value = true;

    const response: RespuestaRequest = await put(`api/menu_opciones/${id}`, opcion);

    menu.value = response.data;

    showToastSuccess(response.message);

    navigateTo("/admin/menu");

  } catch (error: any) {

    showToastError(error.message);

  } finally {

    paginaEspera.value = false;

  }

};

const getOpcion = async (): Promise<void> => {

  try {

    paginaEspera.value = true;

    const response: { data: MenuOpcion } = await get(`api/menu_opciones/${id}`);

    opcion.value = response.data;

  } catch (error: { message: string }) {

    showToastError(error.message);

  } finally {

    paginaEspera.value = false;

  }


};

const getPermisos = async (): Promise<void> => {

  try {

    paginaEspera.value = true;

    const response: { data: Permission } = await get('api/permisos', {
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

getOpcion();

getPermisos();

const puedeMostrarDatos = computed(() => {

  return Object.values(opcion.value).some(valor => valor !== null && valor !== undefined) && Object.values(permisos.value).some(valor => valor !== null && valor !== undefined);

});

</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6">

    <p class="text-2xl">
      Editar Menu
    </p>

    <VBtn
      class="ml-auto"
      color="secondary"
      to="/admin/menu"
    >
      Regresar
    </VBtn>
  </div>

  <VCard>

    <VCardText>

      <Fields v-if="puedeMostrarDatos"
              :item="opcion"
              :mostrar-titulo-seccion="false"
              :parent-id="null"
              :permisos="permisos"
              @datos="actualizarOpcion"
      />

    </VCardText>

  </VCard>

</template>

<style lang="scss" scoped>

</style>
