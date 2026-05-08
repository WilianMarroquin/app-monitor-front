<script setup lang="ts">
import Fields from '@/views/pages/areas/fields.vue'
import type { AreaInterface } from '@/types/areas/types'
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseInterface } from '@/types/generales/types'

definePageMeta({
  navActiveLink: 'areas',
  middleware: 'permissions',
  action: 'Editar Areas',
  subject: 'Area',
})

const { put, get } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params.id

const actualizarArea = async (Area: AreaInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta = await put<SendResponseInterface<AreaInterface>>(`api/areas/${id}/`, Area)

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

const itemArea = ref<AreaInterface>(
{ name: null,
description: null }
)

const getArea = async () => {
  paginaEspera.value = true
  try {
    const respuesta = await get<SendResponseInterface<AreaInterface>>(`api/areas/${id}/`)
    itemArea.value = respuesta.data
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

getArea()

const puedeMostrarDatos = computed(() => {
  return Object.values(itemArea .value).some(valor => valor !== null && valor !== undefined)
})
</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Editar Area'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/areas/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>
    <VCardText>
      <Fields
        v-if="puedeMostrarDatos"
        :item="itemArea"
        @emitir-datos="actualizarArea"
      />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
