<script setup lang="ts">
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseSuccessInterface } from '@/types/generales/types'

definePageMeta({
  middleware: 'permissions',
  action: 'Listar Notification Contactes',
  subject: 'NotificationContact',
})

const { can } = useAbility()
const { del } = useClienteRequest()
const { success, preguntaEliminar } = useToast()
const dataTable = ref<any>(null)

const headers = [
  {
    title: 'Nombres',
    key: 'nombres',
  },
  {
    title: 'Apellidos',
    key: 'apellidos',
  },
  {
    title: 'Telefono',
    key: 'telefono',
  },
  {
    title: 'Acciones',
    key: 'Acciones',
  }
]

const deleteItem = async (id: number) => {
  const confirm = await preguntaEliminar('¿Desea Eliminar NotificationContact?')
  if (!confirm)
    return
  try {
    const respuesta = await del<SendResponseSuccessInterface>(`api/notification_contacts/${id}`)

    success(respuesta.message)
    if (dataTable.value)
      dataTable.value.getItems()
  }
  catch (errorCarpturado) {
    manejaError(errorCarpturado)
  }
}
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-4">
    <h1 v-text="'Listado de Notification Contactes'"/>
    <VBtn
      v-if="can('Crear Notification Contactes', 'NotificationContact')"
      class="ml-auto"
      color="success"
      to="/notification-contacts/create"
    >
      <VIcon class="mr-2 ri-add-large-fill"/>
      Nuev@ NotificationContact
    </VBtn>
  </div>
  <DataTableComponent
    ref="dataTable"
    :columnas="headers"
    endpoint="api/notification_contacts"
    :cantidad-por-pagina="10"
    :cantidad-por-pagina-opciones="[10, 20, 30]"
    :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
  >
    <template #item.Acciones="{ item }">
      <VBtn
        v-if="can('Ver Notification Contactes', 'NotificationContact')"
        icon="ri-eye-line"
        variant="tonal"
        color="info"
        :to="`/notification-contacts/show/${item.id}` "
        class="mr-1"
      />
      <VBtn
        v-if="can('Editar Notification Contactes', 'NotificationContact')"
        icon="ri-edit-box-line"
        variant="tonal"
        color="warning"
        :to="`/notification-contacts/edit/${item.id}`"
        class="mr-1"
      />
      <VBtn
        v-if="can('Eliminar Notification Contactes', 'NotificationContact')"
        icon="ri-delete-bin-line"
        variant="tonal"
        color="error"
        @click="deleteItem(item.id)"
      />
    </template>
  </DataTableComponent>
</template>

<style scoped lang="scss">

</style>
