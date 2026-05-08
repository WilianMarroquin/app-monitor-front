<script setup lang="ts">
import Fields from '@/views/pages/notification-contacts/fields.vue'
import type { NotificationContactInterface } from '@/types/notification-contacts/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'notification-contacts',
  middleware: 'permissions',
  action: 'Crear Notification Contactes',
  subject: 'NotificationContact',
})

const { post } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const guardarNotificationContact = async (NotificationContact: NotificationContactInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta = await post<SendResponseInterface<NotificationContactInterface>>('api/notification_contacts', NotificationContact)

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
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Crear NotificationContact'"/>
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
      <Fields @emitir-datos="guardarNotificationContact" />
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
