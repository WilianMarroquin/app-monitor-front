<script lang="ts" setup>
import type { MenuOpcionInterface } from '@/types/admin/configuraciones/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'
import { useConfigStore } from '@core/stores/config'
import { AppContentLayoutNav } from '@layouts/enums'
import { switchToVerticalNavOnLtOverlayNavBreakpoint } from '@layouts/utils'

const DefaultLayoutWithHorizontalNav = defineAsyncComponent(() => import('./components/DefaultLayoutWithHorizontalNav.vue'))
const DefaultLayoutWithVerticalNav = defineAsyncComponent(() => import('./components/DefaultLayoutWithVerticalNav.vue'))

const { layoutAttrs, injectSkinClasses } = useSkins()
const { paginaEspera } = useCargandoPagina()
const { get } = useClienteRequest()

const configStore = useConfigStore()

injectSkinClasses()

const opcionesMenu = useState<MenuOpcionInterface[]>('menu', () => [])

const obtenerOpcionesMenu = async (): Promise<void> => {
  try {
    paginaEspera.value = true

    const respuesta: SendResponseInterface<MenuOpcionInterface[]> = await get('api/admin/configuraciones/menu-opciones/get/menu-opciones')

    opcionesMenu.value = respuesta.data ?? []
  }
  catch (error: any) {
    manejaError(error)
  }
  finally {
    paginaEspera.value = false
  }
}

obtenerOpcionesMenu()

switchToVerticalNavOnLtOverlayNavBreakpoint()
</script>

<template>
  <Component
    v-bind="layoutAttrs"
    :is="configStore.appContentLayoutNav === AppContentLayoutNav.Vertical ? DefaultLayoutWithVerticalNav : DefaultLayoutWithHorizontalNav"
  >
    <slot />
  </Component>

  <VOverlay
    v-model="paginaEspera"
    contained
    persistent
    scroll-strategy="none"
    class="align-center justify-center"
  >
    <VProgressCircular indeterminate />
  </VOverlay>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";

:root {
  --toastify-color-light: #fff;
  --toastify-color-dark: #1A1B35;
}
</style>
