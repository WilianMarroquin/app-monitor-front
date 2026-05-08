<script setup lang="ts">
import Fields from '@/views/pages/servers/fields.vue'
import type { ServerInterface } from '@/types/servers/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'servers',
  middleware: 'permissions',
  action: 'Crear Serveres',
  subject: 'Server',
})

const { post } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const guardarServer = async (Server: ServerInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta = await post<SendResponseInterface<ServerInterface>>('api/servers', Server)

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
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Crear Server'"/>
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
      <Fields @emitir-datos="guardarServer" />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
