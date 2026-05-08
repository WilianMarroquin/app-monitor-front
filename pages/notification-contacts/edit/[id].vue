<script setup lang="ts">
import Fields from '@/views/pages/notification-contacts/fields.vue'
import type { NotificationContactInterface } from '@/types/notification-contacts/types'
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseInterface } from '@/types/generales/types'

definePageMeta({
  navActiveLink: 'notification-contacts',
  middleware: 'permissions',
  action: 'Editar Notification Contactes',
  subject: 'NotificationContact',
})

const { put, get } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = route.params.id

const actualizarNotificationContact = async (NotificationContact: NotificationContactInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta = await put<SendResponseInterface<NotificationContactInterface>>(`api/notification_contacts/${id}/`, NotificationContact)

    success(respuesta.message)
    navigateTo('/notification-contacts')
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

const itemNotificationContact = ref<NotificationContactInterface>(
{ nombres: null,
apellidos: null,
telefono: null }
)

const getNotificationContact = async () => {
  paginaEspera.value = true
  try {
    const respuesta = await get<SendResponseInterface<NotificationContactInterface>>(`api/notification_contacts/${id}/`)
    itemNotificationContact.value = respuesta.data
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
  return Object.values(itemNotificationContact .value).some(valor => valor !== null && valor !== undefined)
})
</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Editar Contacto'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/notification-contacts/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>
    <VCardText>
      <Fields
        v-if="puedeMostrarDatos"
        :item="itemNotificationContact"
        @emitir-datos="actualizarNotificationContact"
      />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
