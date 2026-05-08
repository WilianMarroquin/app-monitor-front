<script setup lang="ts">
import Fields from '@/views/pages/servers/fields.vue'
import type { ServerInterface } from '@/types/servers/types'
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseInterface } from '@/types/generales/types'

definePageMeta({
  navActiveLink: 'servers',
  middleware: 'permissions',
  action: 'Editar Serveres',
  subject: 'Server',
})

const { put, get } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params.id

const actualizarServer = async (Server: ServerInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta = await put<SendResponseInterface<ServerInterface>>(`api/servers/${id}/`, Server)

    success(respuesta.message)
    navigateTo('/servers')
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

const itemServer = ref<ServerInterface>(
{ name: null,
description: null,
internal_ip: null,
external_ip: null,
entorno: null }
)

const getServer = async () => {
  paginaEspera.value = true
  try {
    const respuesta = await get<SendResponseInterface<ServerInterface>>(`api/servers/${id}/`)
    itemServer.value = respuesta.data
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
  return Object.values(itemServer .value).some(valor => valor !== null && valor !== undefined)
})
</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Editar Server'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/servers/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>
    <VCardText>
      <Fields
        v-if="puedeMostrarDatos"
        :item="itemServer"
        @emitir-datos="actualizarServer"
      />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
