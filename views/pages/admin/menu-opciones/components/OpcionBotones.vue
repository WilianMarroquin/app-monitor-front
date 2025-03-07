<template>
  <div>

    <VBtn
      v-if="!esTituloSeccion"
      :to="`/admin/menu/create/${id}`"
      color="success"
      icon="ri-add-line"
      variant="tonal"
      size="small"
    />

    <VBtn
      :to="`/admin/menu/edit/${id}`"
      color="warning"
      icon="ri-edit-box-line"
      size="small"
      variant="tonal"
    />

    <VBtn
      color="error"
      icon="ri-delete-bin-line"
      size="small"
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

const { deleted, get} = useClienteRequest();

const menu = <object>useState('menu');

const eliminar = async (): Promise<void> => {

  const confirmar = <boolean>await preguntaEliminar('¿Estás seguro de eliminar esta opción?');

  if (confirmar) {

    try {

      paginaEspera.value = true;

      let res = await deleted(`api/menu-opciones/${id}`);

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

    const res = await get("api/menu-opciones");

    menu.value = res.data.data;

  } catch (error) {

    throw error;

  }
};

</script>
