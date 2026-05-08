<script setup lang="ts">
import { manejaError } from '@/utils/funcionesComunes'
import type { SendResponseSuccessInterface } from '@/types/generales/types'

definePageMeta({
  middleware: 'permissions',
  action: 'Listar Areas',
  subject: 'Area',
})

const { can } = useAbility()
const { del } = useClienteRequest()
const { success, preguntaEliminar } = useToast()
const dataTable = ref<any>(null)

const headers = [
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Description',
    key: 'description',
  },
  {
    title: 'Contactos Asignados',
    key: 'contactos_asignados',
  },
  {
    title: 'Acciones',
    key: 'Acciones',
  }
]

const deleteItem = async (id: number) => {
  const confirm = await preguntaEliminar('¿Desea Eliminar Area?')
  if (!confirm)
    return
  try {
    const respuesta = await del<SendResponseSuccessInterface>(`api/areas/${id}`)

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
    <h1 v-text="'Listado de Areas'"/>
    <VBtn
      v-if="can('Crear Areas', 'Area')"
      class="ml-auto"
      color="success"
      to="/areas/create"
    >
      <VIcon class="mr-2 ri-add-large-fill"/>
      Nuev@ Area
    </VBtn>
  </div>
  <DataTableComponent
    ref="dataTable"
    :columnas="headers"
    endpoint="api/areas"
    :cantidad-por-pagina="10"
    :cantidad-por-pagina-opciones="[10, 20, 30]"
    :botones="['xlsx', 'pdf', 'csv', 'reiniciar']"
    :relaciones="['contactosAsignados']"
  >
    <template #item.contactos_asignados="{ item }">
      <div class="d-flex flex-wrap">
        <VChip
          v-if="item.contactos_asignados.length > 0"
          v-for="contacto in item.contactos_asignados"
          :key="contacto.id"
          size="small"
          color="primary"
          variant="tonal"
          class="ma-1"
        >
          <VIcon start icon="ri-user-smile-line" size="small" />
          {{ contacto.nombre_completo }}
        </VChip>
        <span v-else class="text-grey">Sin contactos asignados</span>
      </div>
    </template>
    <template #item.Acciones="{ item }">
      <VBtn
        v-if="can('Ver Areas', 'Area')"
        icon="ri-eye-line"
        variant="tonal"
        color="info"
        :to="`/areas/show/${item.id}` "
        class="mr-1"
      />
      <VBtn
        v-if="can('Editar Areas', 'Area')"
        icon="ri-edit-box-line"
        variant="tonal"
        color="warning"
        :to="`/areas/edit/${item.id}`"
        class="mr-1"
      />
      <VBtn
        v-if="can('Eliminar Areas', 'Area')"
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
