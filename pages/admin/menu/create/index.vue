<script lang="ts" setup>
import type { MenuOpcionInterface } from '@/types/admin/configuraciones/types'
import type { PermisoInterface } from '@/types/admin/modulo-usuarios/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'
import Fields from '@/views/pages/admin/menu-opciones/fields.vue'

// definePageMeta({
//   middleware: 'permissions',
//   action: 'crear opcion menu',
//   subject: 'menu opcion',
// })

const { post, get } = useClienteRequest()
const { paginaEspera } = useCargandoPagina()
const { success } = useToast()
const menu = useState<MenuOpcionInterface[]>('menu')

const obtenerOpcionesMenu = async (): Promise<void> => {
  try {
    const respuesta: SendResponseInterface<MenuOpcionInterface[]> = await get('api/get/menu-opciones/')

    menu.value = respuesta.data ?? []
  }
  catch (e: any) {
    manejaError(e)
  }
  finally {
    paginaEspera.value = false
  }
}

const guardarOpcion = async (data: MenuOpcionInterface) => {
  paginaEspera.value = true
  try {
    const res: SendResponseInterface<MenuOpcionInterface> = await post('api/menu-opciones', data)

    await obtenerOpcionesMenu()
    success(res.message)
    navigateTo('/admin/menu')
  }
  catch (e: any) {
    manejaError(e)
  }
  finally {
    paginaEspera.value = false
  }
}

const permisos = ref<PermisoInterface[]>([])

const getPermisos = async (): Promise<void> => {
  try {
    paginaEspera.value = true

    const response: SendResponseInterface<PermisoInterface[]> = await get('api/admin/modulo-usuarios/permissions/all')

    permisos.value = response.data ?? []
  }
  catch (e: any) {
    manejaError(e)
  }
  finally {
    paginaEspera.value = false
  }
}

getPermisos()

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
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>
  </div>

  <VCard>
    <VCardText>
      <Fields
        v-if="puedeMostrarDatos"
        :item="null"
        mostrar-titulo-seccion
        :parent-id="null"
        :permisos="permisos"
        @datos="guardarOpcion"
      />
    </VCardText>
  </VCard>
</template>
