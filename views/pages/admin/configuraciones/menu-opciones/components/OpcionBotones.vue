<template>
  <div>

    <VBtn
      v-if="!esTituloSeccion && can('Crear Menu Opciones', 'Menu Opcion')"
      :to="`/admin/configuraciones/menu/create/${id}`"
      color="success"
      icon="ri-add-line"
      variant="tonal"
      size="small"
    />

    <VBtn
      v-if="can('Editar Menu Opciones', 'Menu Opcion')"
      :to="`/admin/configuraciones/menu/edit/${id}`"
      color="warning"
      icon="ri-edit-box-line"
      size="small"
      variant="tonal"
    />

    <VBtn
      v-if="can('Eliminar Menu Opciones', 'Menu Opcion')"
      color="error"
      icon="ri-delete-bin-line"
      size="small"
      variant="tonal"
      @click="eliminar"
    />

  </div>
</template>

<script lang="ts" setup>
import { manejaError } from '@/utils/funcionesComunes'

interface Props {
  id: string | number;
  esTituloSeccion: boolean;
}

const { success, preguntaEliminar} = useToast();
const { paginaEspera } = useCargandoPagina();
const { id, esTituloSeccion } = defineProps<Props>();
const { deleted, get} = useClienteRequest();
const { can } = useAbility()

const menu = <object>useState('menu');

const eliminar = async (): Promise<void> => {
  const confirmar = <boolean>await preguntaEliminar('¿Estás seguro de eliminar esta opción?');
  if (confirmar) {
    try {
      paginaEspera.value = true;
      let res = await deleted(`api/admin/configuraciones/menu-opciones/${id}`);
      await getOpcionesMenu();
      success(res.message);
    }
    catch (error: any) {
      manejaError(error);
    }
    finally {
      paginaEspera.value = false;
    }
  }
};

const getOpcionesMenu = async (): Promise<void> => {
  try {
    const res = await get("api/admin/configuraciones/menu-opciones/get/menu-opciones");
    menu.value = res.data;
  }
  catch (error) {
    throw error;
  }
};

</script>
