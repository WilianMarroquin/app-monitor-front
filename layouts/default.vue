<script lang="ts" setup>
import { useConfigStore } from '@core/stores/config'
import { AppContentLayoutNav } from '@layouts/enums'
import { switchToVerticalNavOnLtOverlayNavBreakpoint } from '@layouts/utils'

const DefaultLayoutWithHorizontalNav = defineAsyncComponent(() => import('./components/DefaultLayoutWithHorizontalNav.vue'))
const DefaultLayoutWithVerticalNav = defineAsyncComponent(() => import('./components/DefaultLayoutWithVerticalNav.vue'))

const configStore = useConfigStore()

switchToVerticalNavOnLtOverlayNavBreakpoint()

const { layoutAttrs, injectSkinClasses } = useSkins()

injectSkinClasses()

const {paginaEspera} = useCargandoPagina()

const opcionesMenu = <[]>useState('menu', () => []);

const {get} = useClienteRequest()

const {showToastError} = useToast()

const obtenerOpcionesMenu = async (): Promise<void> => {
  try {
    paginaEspera.value = true
    const respuesta = await get('api/get/menu-opciones/')
    opcionesMenu.value = respuesta.data
  } catch (error: { message: string }) {
    showToastError(error.message)
  } finally {
    paginaEspera.value = false
  }
}

obtenerOpcionesMenu()


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
</style>
