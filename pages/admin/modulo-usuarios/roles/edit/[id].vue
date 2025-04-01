<script setup lang="ts">
import fields from '@/views/pages/admin/modulo-usuarios/roles/fields.vue'
import type { RolInterface } from '@/types/admin/modulo-usuarios/types';
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'admin-modulo-usuarios-roles',
//   middleware: 'permissions',
//   action: 'editar roles', // Acción requerida
//   subject: 'roles',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
});

const { put, get } = useClienteRequest();
const { success } = useToast();
const { paginaEspera } = useCargandoPagina();

const route = useRoute();
const id = route.params.id;

const actualizarRol = async (Rol: RolInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta = await put('api/admin/modulo-usuarios/roles/' + id, Rol);

    success(respuesta.message);
    navigateTo('/admin/modulo-usuarios/roles');
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false;
  }
}

const itemRol = ref(<RolInterface>
{ name: null,
guard_name: null }
)

const getRol = async () => {
  paginaEspera.value = true;
  try {
    const respuesta: {data: RolInterface } = await get(`api/admin/modulo-usuarios/roles/${id}/`);
    itemRol.value = respuesta.data;

  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
      paginaEspera.value = false
  }
}

getRol();

const puedeMostrarDatos = computed(() => {
  return Object.values(itemRol .value).some(valor => valor !== null && valor !== undefined);
});
</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Editar Rol'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/admin/modulo-usuarios/roles/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>

      <VCardText>

        <fields :fields="fields"
                v-if="puedeMostrarDatos"
                :item="itemRol"
                @emitirDatos="actualizarRol"
        />

      </VCardText>

  </VCard>

</template>

<style scoped lang="scss">

</style>
