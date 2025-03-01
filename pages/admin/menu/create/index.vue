<script lang="ts" setup>

definePageMeta({
  middleware: 'permissions',
  action: 'crear opcion menu',
  subject: 'menu opcion',
})

import Fields from '@/views/admin/menuOpciones/fields.vue';
import type {MenuOpcion, RespuestaRequest} from "@/types/admin/menu-opciones/types";
import type {Permission} from "@/types/admin/permisos/types";

const {post, get} = useClienteRequest();
const {paginaEspera} = useCargandoPagina();
const {showToastError, showToastSuccess} = useToast();
const menu = useState('menu');

const guardarOpcion = async (data: MenuOpcion) => {

  paginaEspera.value = true;

  try {

    let res: RespuestaRequest = await post('api/menu_opciones', data);

    menu.value = res.data;

    showToastSuccess(res.message);

    navigateTo('/admin/menu');

  } catch (error: { message: string }) {

    showToastError(error.message);

  } finally {

    paginaEspera.value = false;

  }

};

const permisos = ref<Permission>({} as Permission);

const getPermisos = async (): Promise<void> => {

  try {

    paginaEspera.value = true;

    const response: { data: Permission } = await get('api/permisos', {
      params: {
        'page[size]': -1
      }
    });

    permisos.value = response.data.data;

    console.log('El valor de los permisos: ', permisos.value);

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
      Crear Opción Menu
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
              :item="{}"
              :mostrar-titulo-seccion="true"
              :parentId="null"
              :permisos="permisos"
              @datos="guardarOpcion"
      />

    </VCardText>

  </VCard>


</template>
