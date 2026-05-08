<script setup lang="ts">
import type { ServerInterface } from '@/types/servers/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'servers',
  middleware: 'permissions',
  action: 'Ver Serveres',
  subject: 'Server',
})

const { get } = useClienteRequest()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params.id
const item = ref<ServerInterface>(
{ name: null,
description: null,
internal_ip: null,
external_ip: null,
entorno: null }
)

const getServer = async () => {
  try {
    paginaEspera.value = true
    const respuesta = await get<SendResponseInterface<ServerInterface>>(`api/servers/${id}/`)
    item.value = respuesta.data
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

getServer()

const puedeMostrarDatos = computed(() => {
  return Object.values(item.value).some(valor => valor !== null && valor !== undefined)
})
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Visualizar Server'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/servers"
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
          Internal Ip:
          <div class="d-inline-block text-capitalize text-body-1">
            {{ item.internal_ip }}
          </div>
        </h6>
      </VListItemTitle>
    
      <VListItemTitle>
        <h6 class="text-h6">
          External Ip:
          <div class="d-inline-block text-capitalize text-body-1">
            {{ item.external_ip }}
          </div>
        </h6>
      </VListItemTitle>
    
      <VListItemTitle>
        <h6 class="text-h6">
          Entorno:
          <div class="d-inline-block text-capitalize text-body-1">
            {{ item.entorno }}
          </div>
        </h6>
      </VListItemTitle>
    
      </VList>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
