<script setup lang="ts">
import fields from '@/views/pages/admin/modulo-usuarios/usuario-estados/fields.vue'
import type { UserEstadoInterface } from '@/types/admin/modulo-usuarios/types';
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'admin-modulo-usuarios-usuario-estados',
  middleware: 'permissions',
  action: 'Editar Usuario Estados',
  subject: 'UserEstado',
})

const { put, get } = useClienteRequest();
const { success } = useToast();
const { paginaEspera } = useCargandoPagina();

const route = useRoute();
const id = route.params.id;

const actualizarUserEstado = async (UserEstado: UserEstadoInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta = await put('api/admin/modulo-usuarios/users/estados/' + id, UserEstado);

    success(respuesta.message);
    navigateTo('/admin/modulo-usuarios/usuario-estados');
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false;
  }
}

const itemUserEstado = ref(<UserEstadoInterface>
{ nombre: null }
)

const getUserEstado = async () => {
  paginaEspera.value = true;
  try {
    const respuesta: {data: UserEstadoInterface } = await get(`api/admin/modulo-usuarios/users/estados/${id}/`);
    itemUserEstado.value = respuesta.data;

  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
      paginaEspera.value = false
  }
}

getUserEstado();

const puedeMostrarDatos = computed(() => {
  return Object.values(itemUserEstado .value).some(valor => valor !== null && valor !== undefined);
});
</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Editar Estado de Usuario'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/admin/modulo-usuarios/usuario-estados/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>

      <VCardText>

        <fields :fields="fields"
                v-if="puedeMostrarDatos"
                :item="itemUserEstado"
                @emitirDatos="actualizarUserEstado"
        />

      </VCardText>

  </VCard>

</template>

<style scoped lang="scss">

</style>
