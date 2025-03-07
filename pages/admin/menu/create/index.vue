<script lang="ts" setup>
// definePageMeta({
//   middleware: 'permissions',
//   action: 'crear opcion menu',
//   subject: 'menu opcion',
// })

import Fields from '@/views/pages/admin/menu-opciones/fields.vue'
import type { MenuOpcionInterface } from "@/types/admin/MenuOpcionInterface"
import type { PermisoInterface } from "@/types/admin/PermisoInterface"

const { post, get } = useClienteRequest()
const { paginaEspera } = useCargandoPagina()
const { showToastError, showToastSuccess } = useToast()
const menu = useState('menu')

const guardarOpcion = async (data: MenuOpcionInterface) => {
  paginaEspera.value = true

  try {
    let res = await post('api/menu-opciones', data)
    await obtenerOpcionesMenu()
    showToastSuccess(res.message)
    navigateTo('/admin/menu')
  } catch (error: { message: string }) {
    showToastError(error.message)
  } finally {
    paginaEspera.value = false
  }
}

const permisos = ref<PermisoInterface>({} as PermisoInterface);

const getPermisos = async (): Promise<void> => {

  try {
    paginaEspera.value = true
    const response: { data: PermisoInterface } = await get('api/permissions', {
      params: {
        'page[size]': -1
      }
    });
    permisos.value = response.data.data;
  } catch (error: { message: string }) {
    showToastError(error.message)
  } finally {
    paginaEspera.value = false
  }
}

getPermisos()
console.log(permisos.value)

const obtenerOpcionesMenu = async (): Promise<void> => {
  try {
    const respuesta = await get('api/get/menu-opciones/')
    menu.value = respuesta.data
  } catch (error: { message: string }) {
    showToastError(error.message)
  }
}

const puedeMostrarDatos: ComputedRef<boolean> = computed(() => {
  return Array.isArray(permisos.value) && permisos.value.length > 0
})
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
