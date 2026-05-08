<script setup lang="ts">
import type { NotificationContactInterface } from '@/types/notification-contacts/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'notification-contacts',
  middleware: 'permissions',
  action: 'Ver Notification Contactes',
  subject: 'NotificationContact',
})

const { get } = useClienteRequest()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params.id
const item = ref<NotificationContactInterface>(
{ nombres: null,
apellidos: null,
telefono: null }
)

const getNotificationContact = async () => {
  try {
    paginaEspera.value = true
    const respuesta = await get<SendResponseInterface<NotificationContactInterface>>(`api/notification_contacts/${id}/`)
    item.value = respuesta.data
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

getNotificationContact()

const puedeMostrarDatos = computed(() => {
  return Object.values(item.value).some(valor => valor !== null && valor !== undefined)
})
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Visualizar NotificationContact'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/notification-contacts"
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
          Nombres:
          <div class="d-inline-block text-capitalize text-body-1">
            {{ item.nombres }}
          </div>
        </h6>
      </VListItemTitle>
    
      <VListItemTitle>
        <h6 class="text-h6">
          Apellidos:
          <div class="d-inline-block text-capitalize text-body-1">
            {{ item.apellidos }}
          </div>
        </h6>
      </VListItemTitle>
    
      <VListItemTitle>
        <h6 class="text-h6">
          Telefono:
          <div class="d-inline-block text-capitalize text-body-1">
            {{ item.telefono }}
          </div>
        </h6>
      </VListItemTitle>
    
      </VList>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
