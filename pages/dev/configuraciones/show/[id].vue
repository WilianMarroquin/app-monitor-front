<script setup lang="ts">
import type { ConfiguracionInterface } from '@/types/admin/configuraciones/types'
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'dev-configuraciones',
  middleware: 'permissions',
  action: 'Ver Configuraciones',
  subject: 'Configuracion',
})

const { get } = useClienteRequest()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params.id

const item = ref<ConfiguracionInterface>({
  key: null,
  value: null,
  descripcion: null,
})

const getConfiguracion = async () => {
  try {
    paginaEspera.value = true
    const respuesta: { data: ConfiguracionInterface } = await get('api/admin/configuraciones/generales/' + id )
    item.value = respuesta.data
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
  return Object.values(item.value).some(valor => valor !== null && valor !== undefined)
})
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Visualizar Configuracion'"/>
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
      <VList class="card-list mt-2" v-if="puedeMostrarDatos">
        <VListItemTitle>
          <h6 class="text-h6">
              Key:
            <div class="d-inline-block text-capitalize text-body-1">
              {{ item.key }}
            </div>
          </h6>
        </VListItemTitle>
        <VListItemTitle>
          <h6 class="text-h6">
              Value:
            <div class="d-inline-block text-capitalize text-body-1">
              {{ item.value }}
            </div>
          </h6>
        </VListItemTitle>
        <VListItemTitle>
          <h6 class="text-h6">
            Descripción:
            <div class="d-inline-block text-capitalize text-body-1">
              {{ item.descripcion }}
            </div>
          </h6>
        </VListItemTitle>
      </VList>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
