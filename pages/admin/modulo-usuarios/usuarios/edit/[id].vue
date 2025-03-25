<script setup lang="ts">
import fields from '@/views/pages/admin/modulo-usuarios/usuarios/fields.vue'
import type { UsuarioInterface } from '@/types/admin/modulo-usuarios/types';
import { manejaError } from '@/utils/funcionesComunes'

// definePageMeta({
//   middleware: 'permissions',
//   action: 'editar usuarios', // Acción requerida
//   subject: 'usuarios',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
// });

const { put, get } = useClienteRequest();
const { success } = useToast();
const { paginaEspera } = useCargandoPagina();

const route = useRoute();
const id = route.params.id;

const actualizarUser = async (User: UsuarioInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta = await put('api/admin/modulo-usuarios/users/' + id, User);

    success(respuesta.message);
    navigateTo('/admin/modulo-usuarios/usuarios');
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false;
  }
}

const itemUser = ref(<UsuarioInterface>
{ primer_nombre: null,
segundo_nombre: null,
primer_apellido: null,
segundo_apellido: null,
usuario: null,
email: null,
email_verified_at: null,
password: null,
remember_token: null }
)

const getUser = async () => {
  paginaEspera.value = true;
  try {
    const respuesta: {data: UsuarioInterface } = await get(`api/admin/modulo-usuarios/users/${id}/`);
    itemUser.value = respuesta.data;

  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
      paginaEspera.value = false
  }
}

getUser();

const puedeMostrarDatos = computed(() => {
  return Object.values(itemUser .value).some(valor => valor !== null && valor !== undefined);
});
</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Editar Usuario'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/admin/modulo-usuarios/usuarios/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>

      <VCardText>

        <fields :fields="fields"
                v-if="puedeMostrarDatos"
                :item="itemUser"
                @emitirDatos="actualizarUser"
        />

      </VCardText>

  </VCard>

</template>

<style scoped lang="scss">

</style>
