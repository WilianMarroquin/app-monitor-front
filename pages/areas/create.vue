<script setup lang="ts">
import Fields from '@/views/pages/areas/fields.vue'
import type { AreaInterface } from '@/types/areas/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'areas',
  middleware: 'permissions',
  action: 'Crear Areas',
  subject: 'Area',
})

const { post } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const guardarArea = async (Area: AreaInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta = await post<SendResponseInterface<AreaInterface>>('api/areas', Area)

    success(respuesta.message)
    navigateTo('/areas')
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
    <h1 v-text="'Crear Area'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/areas"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>
  </div>

  <VCard>
    <VCardText>
      <Fields @emitir-datos="guardarArea" />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
