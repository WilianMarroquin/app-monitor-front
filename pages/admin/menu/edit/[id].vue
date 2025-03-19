<script lang="ts" setup>

// definePageMeta({
//   middleware: 'permissions',
//   action: 'editar opcion menu',
//   subject: 'menu opcion',
// })

import Fields from '@/views/pages/admin/menu-opciones/fields.vue'
import type { MenuOpcionInterface } from "@/types/admin/MenuOpcionInterface"
import type { PermisoInterface } from "@/types/admin/PermisoInterface"

const {put, get} = useClienteRequest();

const {success, error} = useToast();

const {paginaEspera} = useCargandoPagina();

const route = useRoute<{ id: number }>();

const id = <number>route.params.id;

const opcion = ref<MenuOpcionInterface>({} as MenuOpcionInterface);

const permisos = ref<PermisoInterface>({} as PermisoInterface);

const menu = useState('menu');

const actualizarOpcion = async (opcion: MenuOpcionInterface): Promise<void> => {

  try {

    paginaEspera.value = true;

    const response = await put(`api/menu-opciones/${id}`, opcion);

    menu.value = response.data;

    success(response.message);

    navigateTo("/admin/menu");

  } catch (e: any) {

    error(e.message);

  } finally {

    paginaEspera.value = false;

  }

};

const getOpcion = async (): Promise<void> => {

  try {

    paginaEspera.value = true;

    const response: { data: MenuOpcionInterface } = await get(`api/menu-opciones/${id}`);

    opcion.value = response.data;

  } catch (e: { message: string }) {

    error(e.message);

  } finally {

    paginaEspera.value = false;

  }


};

const getPermisos = async (): Promise<void> => {

  try {
    paginaEspera.value = true
    const response: { data: PermisoInterface } = await get('api/permissions', {
      params: {
        'page[size]': -1
      }
    });
    permisos.value = response.data.data;
  } catch (e: { message: string }) {
    error(e.message)
  } finally {
    paginaEspera.value = false
  }
}

getPermisos()
console.log(permisos.value)

getOpcion();

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
