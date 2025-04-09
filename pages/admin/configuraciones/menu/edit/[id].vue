<script lang="ts" setup>
import type { MenuOpcionInterface } from '@/types/admin/configuraciones/types'
import type { PermisoInterface } from '@/types/admin/modulo-usuarios/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'
import Fields from '@/views/pages/admin/configuraciones/menu-opciones/fields.vue'

definePageMeta({
  navActiveLink: 'admin-configuraciones-menu',

  // middleware: 'permissions',
  // action: 'editar opcion menu',
  // subject: 'menu opcion',
})

const { put, get } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params?.id as string
const opcion = ref<MenuOpcionInterface>({} as MenuOpcionInterface)
const permisos = ref<PermisoInterface[]>([])
const menu = useState('menu')

const actualizarOpcion = async (opcionActualizada: MenuOpcionInterface): Promise<void> => {
  console.log('opcionActualizada', opcionActualizada)
  try {
    paginaEspera.value = true

    const response = await put(`api/admin/configuraciones/menu-opciones/${id}`, opcionActualizada)

    menu.value = response.data
    success(response.message)
    navigateTo('/admin/configuraciones/menu')
  }
  catch (e: any) {
    manejaError(e)
  }
  finally {
    paginaEspera.value = false
  }
}

const getOpcion = async (): Promise<void> => {
  try {
    paginaEspera.value = true

    const response: SendResponseInterface<MenuOpcionInterface> = await get(`api/admin/configuraciones/menu-opciones/${id}`)

    opcion.value = response.data ?? {} as MenuOpcionInterface
  }
  catch (e: any) {
    manejaError(e)
  }
  finally {
    paginaEspera.value = false
  }
}

getOpcion()

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
  return Object.values(opcion.value).some(valor => valor !== null && valor !== undefined) && Object.values(permisos.value).some(valor => valor !== null && valor !== undefined)
})
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-3">
    <h1>Editar Menu</h1>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/admin/configuraciones/menu"
      prepend-icon="ri-contract-left-fill"
    >
      Regresar
    </VBtn>
  </div>

  <VCard>
    <VCardText>
      <Fields
        v-if="puedeMostrarDatos"
        :item="opcion"
        :mostrar-titulo-seccion="false"
        :parent-id="null"
        :permisos="permisos ?? []"
        @datos="actualizarOpcion"
      />
    </VCardText>
  </VCard>
</template>
