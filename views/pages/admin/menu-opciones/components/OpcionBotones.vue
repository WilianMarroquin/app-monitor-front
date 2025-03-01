<template>
  <div>

    <VBtn
      v-if="!esTituloSeccion"
      :to="`/admin/menu/create/${id}`"
      color="success"
      icon="tabler-plus"
      size="extra-small"
      variant="tonal"
    />

    <VBtn
      :to="`/admin/menu/edit/${id}`"
      color="warning"
      icon="tabler-edit"
      size="extra-small"
      variant="tonal"
    />

    <VBtn
      color="error"
      icon="tabler-trash"
      size="extra-small"
      variant="tonal"
      @click="eliminar"
    />

  </div>
</template>

<script lang="ts" setup>

interface Props {
  id: string | number;
  esTituloSeccion: boolean;
}

const {showToastSuccess, showToastError, preguntaEliminar} = useToast();

const {paginaEspera} = useCargandoPagina();

const {id, esTituloSeccion} = defineProps<Props>();

const {deleted, get} = useClienteRequest();

import type {RespuestaRequest} from "@/types/admin/menu-opciones/types";

const menu = <object>useState('menu');

const eliminar = async (): Promise<void> => {

  const confirmar = <boolean>await preguntaEliminar('¿Estás seguro de eliminar esta opción?');

  if (confirmar) {

    try {

      paginaEspera.value = true;

      let res: RespuestaRequest = await deleted(`api/menu_opciones/${id}`);

      await getOpcionesMenu();

      showToastSuccess(res.message);
      
    } catch (error: { message: string }) {

      showToastError(error.message);

    } finally {

      paginaEspera.value = false;

    }

  }

};

const getOpcionesMenu = async (): Promise<void> => {

  try {

    const res = await get("api/menu_opciones");

    menu.value = res.data;

  } catch (error) {

    throw error;

  }
};

</script>
