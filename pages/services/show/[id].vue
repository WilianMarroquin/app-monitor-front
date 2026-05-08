<script setup lang="ts">
import type { ServiceInterface } from '@/types/services/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'services',
  middleware: 'permissions',
  action: 'Ver Services',
  subject: 'Service',
})

const { get } = useClienteRequest()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params.id
const item = ref<ServiceInterface>(
{ name: null,
description: null,
type: null,
is_active: null,
testMethod: null,
httpMethod: null }
)

const getService = async () => {
  try {
    paginaEspera.value = true
    const respuesta = await get<SendResponseInterface<ServiceInterface>>(`api/services/${id}/`)
    item.value = respuesta.data
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
  return Object.values(item.value).some(valor => valor !== null && valor !== undefined)
})
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Visualizar Service'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/services"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>
  </div>

  <VCard>
    <VCardText>
      <VList
        v-if="puedeMostrarDatos"
        class="card-list mt-2"
      >
  
      <VListItemTitle>
        <h6 class="text-h6">
          Name:
          <div class="d-inline-block text-capitalize text-body-1">
            {{ item.name }}
          </div>
        </h6>
      </VListItemTitle>
    
      <VListItemTitle>
        <h6 class="text-h6">
          Description:
          <div class="d-inline-block text-capitalize text-body-1">
            {{ item.description }}
          </div>
        </h6>
      </VListItemTitle>
    
      <VListItemTitle>
        <h6 class="text-h6">
          Type:
          <div class="d-inline-block text-capitalize text-body-1">
            {{ item.type }}
          </div>
        </h6>
      </VListItemTitle>
    
      <VListItemTitle>
        <h6 class="text-h6">
          Is Active:
          <div class="d-inline-block text-capitalize text-body-1">
            {{ item.is_active }}
          </div>
        </h6>
      </VListItemTitle>
    
      <VListItemTitle>
        <h6 class="text-h6">
          TestMethod:
          <div class="d-inline-block text-capitalize text-body-1">
            {{ item.testMethod }}
          </div>
        </h6>
      </VListItemTitle>
    
      <VListItemTitle>
        <h6 class="text-h6">
          HttpMethod:
          <div class="d-inline-block text-capitalize text-body-1">
            {{ item.httpMethod }}
          </div>
        </h6>
      </VListItemTitle>
    
      </VList>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
