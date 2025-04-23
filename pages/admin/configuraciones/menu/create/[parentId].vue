<script lang="ts" setup>
import type { MenuOpcionInterface } from '@/types/admin/configuraciones/types'
import type { PermisoInterface } from '@/types/admin/modulo-usuarios/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'
import Fields from '@/views/pages/admin/configuraciones/menu-opciones/fields.vue'

definePageMeta({
  navActiveLink: 'admin-configuraciones-menu',
  middleware: 'permissions',
  action: 'Crear Menu Opciones',
  subject: 'Menu Opcion',
})

const { post, get } = useClienteRequest()
const { paginaEspera } = useCargandoPagina()
const { success } = useToast()

const route = useRoute()
const parentId = route.params?.parentId as number
const menu = useState('menu')
const permisos = ref<PermisoInterface[]>([])

const obtenerOpcionesMenu = async (): Promise<void> => {
  try {
    const respuesta: SendResponseInterface<MenuOpcionInterface[]> = await get('api/admin/configuraciones/menu-opciones/get/menu-opciones')

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

  const datos = {
    ...data,
    parent_id: parentId,
  }

  try {
    const res = await post('api/admin/configuraciones/menu-opciones', datos)

    success(res.message)
    await obtenerOpcionesMenu()
    navigateTo('/admin/configuraciones/menu')
  }
  catch (e: any) {
    manejaError(e)
  }
  finally {
    paginaEspera.value = false
  }
}

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

const puedeMostrarDatos = computed(() => {
  return Array.isArray(permisos.value) && permisos.value.length > 0
})
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-4">
    <h1 v-text="'Agregar Subopción'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      @click="navigateTo('/admin/configuraciones/menu')"
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
        :mostrar-titulo-seccion="false"
        :parent-id="parentId"
        :permisos="permisos"
        @datos="guardarOpcion"
      />
    </VCardText>
  </VCard>
</template>
