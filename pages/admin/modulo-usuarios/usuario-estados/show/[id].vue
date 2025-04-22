<script setup lang="ts">
import type { UserEstadoInterface } from '@/types/admin/modulo-usuarios/types'
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'admin-modulo-usuarios-usuario-estados',
  middleware: 'permissions',
  action: 'Ver Usuario Estados',
  subject: 'UserEstado',
})

const { get } = useClienteRequest()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params.id

const item = ref<UserEstadoInterface>({
  nombre: null,
})

const getUserEstado = async () => {
  try {
    paginaEspera.value = true
    const respuesta: { data: UserEstadoInterface } = await get('api/admin/modulo-usuarios/users/estados/' + id)
    item.value = respuesta.data
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

getUserEstado()

const puedeMostrarDatos = computed(() => {
  return Object.values(item.value).some(valor => valor !== null && valor !== undefined)
})
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Visualizar Estado de Usuario'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/admin/modulo-usuarios/usuario-estados/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>
  </div>

  <VCard>
    <VCardText>
      <VList v-if="puedeMostrarDatos" class="card-list mt-2" >

        <VListItemTitle>
          <h6 class="text-h6">
            Nombre:
            <div class="d-inline-block text-capitalize text-body-1">
              {{ item.nombre }}
            </div>
          </h6>
        </VListItemTitle>

      </VList>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
