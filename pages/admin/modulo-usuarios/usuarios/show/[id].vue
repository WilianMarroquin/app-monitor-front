<script setup lang="ts">
import type { UsuarioInterface } from '@/types/admin/modulo-usuarios/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'admin-modulo-usuarios-usuarios',
  middleware: 'permissions',
  action: 'Ver Usuarios',
  subject: 'User',
})

const { get } = useClienteRequest()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params.id

const item = ref<UsuarioInterface>({
  primer_nombre: null,
  segundo_nombre: null,
  primer_apellido: null,
  segundo_apellido: null,
  usuario: null,
  email: null,
  password: null,
  remember_token: null,
})

const getUser = async () => {
  try {
    paginaEspera.value = true

    const respuesta: SendResponseInterface<UsuarioInterface> = await get(`api/admin/modulo-usuarios/users/${id}`)

    item.value = respuesta.data
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

getUser()

const puedeMostrarDatos = computed(() => {
  return Object.values(item.value).some(valor => valor !== null && valor !== undefined)
})
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Visualizar Usuario'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/admin/modulo-usuarios/usuarios/"
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
                    Primer Nombre:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.primer_nombre }}
                  </div>
                </h6>
              </VListItemTitle>
            
              <VListItemTitle>
                <h6 class="text-h6">
                    Segundo Nombre:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.segundo_nombre }}
                  </div>
                </h6>
              </VListItemTitle>
            
              <VListItemTitle>
                <h6 class="text-h6">
                    Primer Apellido:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.primer_apellido }}
                  </div>
                </h6>
              </VListItemTitle>
            
              <VListItemTitle>
                <h6 class="text-h6">
                    Segundo Apellido:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.segundo_apellido }}
                  </div>
                </h6>
              </VListItemTitle>
            
              <VListItemTitle>
                <h6 class="text-h6">
                    Usuario:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.usuario }}
                  </div>
                </h6>
              </VListItemTitle>
            
              <VListItemTitle>
                <h6 class="text-h6">
                    Email:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.email }}
                  </div>
                </h6>
              </VListItemTitle>
            
              <VListItemTitle>
                <h6 class="text-h6">
                    Email Verified At:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.email_verified_at }}
                  </div>
                </h6>
              </VListItemTitle>
            
              <VListItemTitle>
                <h6 class="text-h6">
                    Password:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.password }}
                  </div>
                </h6>
              </VListItemTitle>
            
              <VListItemTitle>
                <h6 class="text-h6">
                    Remember Token:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.remember_token }}
                  </div>
                </h6>
              </VListItemTitle>
            
      </VList>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
