<script setup lang="ts">
import type { ConfiguracionInterface } from '@/types/admin/configuraciones/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'
import Fields from '@/views/pages/admin/configuraciones/configuraciones/fields.vue'

definePageMeta({
  navActiveLink: 'dev-configuraciones',
  middleware: 'permissions',
  action: 'Editar configuraciones',
  subject: 'Configuracion',
})

const { put, get } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params.id

const actualizarConfiguracion = async (Configuracion: ConfiguracionInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta = await put('api/admin/configuraciones/generales/' + id, Configuracion)

    success(respuesta.message)
    navigateTo('/dev/configuraciones')
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

const itemConfiguracion = ref<ConfiguracionInterface>({
  key: null,
  value: null,
  descripcion: null,
})

const getConfiguracion = async () => {
  paginaEspera.value = true
  try {
    const respuesta: SendResponseInterface<ConfiguracionInterface> = await get(`api/admin/configuraciones/generales/${id}/`)

    itemConfiguracion.value = respuesta.data
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

getConfiguracion()

const puedeMostrarDatos = computed(() => {
  return Object.values(itemConfiguracion .value).some(valor => valor !== null && valor !== undefined)
})
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Editar Configuracion'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/dev/configuraciones"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>
    <VCardText>
      <fields
        v-if="puedeMostrarDatos"
        :item="itemConfiguracion"
        @emitirDatos="actualizarConfiguracion"
      />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
