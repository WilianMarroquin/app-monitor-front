<script setup lang="ts">
import Fields from '@/views/pages/services/fields.vue'
import type { ServiceInterface } from '@/types/services/types'
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseInterface } from '@/types/generales/types'

definePageMeta({
  navActiveLink: 'services',
  middleware: 'permissions',
  action: 'Editar Services',
  subject: 'Service',
})

const { put, get } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params.id

const actualizarService = async (Service: ServiceInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta = await put<SendResponseInterface<ServiceInterface>>(`api/services/${id}/`, Service)

    success(respuesta.message)
    navigateTo('/services')
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

const itemService = ref<ServiceInterface>(
{ name: null,
description: null,
type: null,
is_active: null,
testMethod: null,
httpMethod: null }
)

const getService = async () => {
  paginaEspera.value = true
  try {
    const respuesta = await get<SendResponseInterface<ServiceInterface>>(`api/services/${id}/`)
    itemService.value = respuesta.data
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

getService()

const puedeMostrarDatos = computed(() => {
  return Object.values(itemService .value).some(valor => valor !== null && valor !== undefined)
})
</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Editar Service'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/services/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>
    <VCardText>
      <Fields
        v-if="puedeMostrarDatos"
        :item="itemService"
        @emitir-datos="actualizarService"
      />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
