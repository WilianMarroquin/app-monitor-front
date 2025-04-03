<script lang="ts" setup>
import type { MenuOpcionInterface } from '@/types/admin/configuraciones/types'
import type { PermisoInterface } from '@/types/admin/modulo-usuarios/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'
import Fields from '@/views/pages/admin/menu-opciones/fields.vue'

definePageMeta({
  navActiveLink: 'admin-menu',
  // middleware: 'permissions',
  // action: 'editar opcion menu',
  // subject: 'menu opcion',
})

const { put, get } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const route = useRoute<{ id: number }>()
const id = <number>route.params.id
const opcion = ref<MenuOpcionInterface>({} as MenuOpcionInterface)
const permisos = ref<PermisoInterface>({} as PermisoInterface)
const menu = useState('menu')

const actualizarOpcion = async (opcion: MenuOpcionInterface): Promise<void> => {
  try {
    paginaEspera.value = true
    const response = await put(`api/menu-opciones/${id}`, opcion)
    menu.value = response.data

    success(response.message)
    navigateTo("/admin/menu")

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
    const response: SendResponseInterface<MenuOpcionInterface> = await get(`api/menu-opciones/${id}`)
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
    const response = await get<{data: PermisoInterface}>('api/admin/modulo-usuarios/permissions')
    permisos.value = response.data.data
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

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6">

    <p class="text-2xl">
      Editar Menu
    </p>

    <VBtn
      class="ml-auto"
      color="secondary"
      to="/admin/menu"
      prependIcon="ri-contract-left-fill"
    >
      Regresar
    </VBtn>
  </div>

  <VCard>

    <VCardText>

      <Fields v-if="puedeMostrarDatos"
              :item="opcion"
              :mostrar-titulo-seccion="false"
              :parent-id="null"
              :permisos="permisos ?? []"
              @datos="actualizarOpcion"
      />

    </VCardText>

  </VCard>

</template>

<style lang="scss" scoped>

</style>
