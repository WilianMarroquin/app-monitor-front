<script setup lang="ts">
import type { RolInterface } from '@/types/admin/modulo-usuarios/types'
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'admin-modulo-usuarios-roles',
  middleware: 'permissions',
  action: 'Ver roles',
  subject: 'Rol',
})

const { get } = useClienteRequest()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params.id

const item = ref<RolInterface>({
  name: null,
  guard_name: null,
})

const getRol = async () => {
  try {
    paginaEspera.value = true

    const respuesta: { data: RolInterface } = await get(`api/admin/modulo-usuarios/roles/${id}`)

    item.value = respuesta.data
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

getRol()

const puedeMostrarDatos = computed(() => {
  return Object.values(item.value).some(valor => valor !== null && valor !== undefined)
})
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Visualizar Rol'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/admin/modulo-usuarios/roles/"
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
            Name:
            <div class="d-inline-block text-capitalize text-body-1">
              {{ item.name }}
            </div>
          </h6>
        </VListItemTitle>

        <VListItemTitle>
          <h6 class="text-h6">
            Guard Name:
            <div class="d-inline-block text-capitalize text-body-1">
              {{ item.guard_name }}
            </div>
          </h6>
        </VListItemTitle>

      </VList>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
