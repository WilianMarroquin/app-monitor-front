<script setup lang="ts">
import { ref, computed } from "vue";
import type { VForm } from "vuetify/lib/components/VForm";
import type { AreaInterface } from '@/types/areas/types.ts';

const isFormValid = ref(false)
const refForm = ref<VForm>()

// Estado para los campos de texto del Área
const data = ref<AreaInterface>({
  name: null,
  description: null
})

// === ESTADO TRANSITORIO ===
const personasAsignadas = ref<any[]>([])
const personaSeleccionada = ref(null)

// === COMPUTED PROPERTY ===
const idsExcluidos = computed(() => {
  return personasAsignadas.value.map(p => p.id).join('-')
})

interface Emit {
  (e: 'emitirDatos', value: any ): void
}

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})

const emit = defineEmits<Emit>()

// === MODO EDICIÓN ===
if (props.item) {
  const { contactos_asignados, ...restData } = props.item;
  data.value = { ...restData };

  if (contactos_asignados && Array.isArray(contactos_asignados)) {
    personasAsignadas.value = [...contactos_asignados]
  }
}

// === NUEVA FUNCIÓN DEL BOTÓN (Explicit Trigger) ===
const agregarPersona = () => {
  // Tomamos a la persona directamente del modelo del buscador
  const persona = personaSeleccionada.value;

  // Si no hay nadie seleccionado, salimos
  if (!persona) return;

  const existe = personasAsignadas.value.some(p => p.id === persona.id)
  if (!existe) {
    personasAsignadas.value.push(persona)
  }

  // Limpiamos el input directamente (al ser un click de botón, Vue lo limpia sin problemas)
  personaSeleccionada.value = null;
}

// Función para eliminar de la tabla
const removerPersona = (id: number) => {
  personasAsignadas.value = personasAsignadas.value.filter(p => p.id !== id)
}

const onSubmit = () => {
  refForm.value?.validate().then(({valid}) => {
    if (valid) {
      const payload = {
        ...data.value,
        personas_asignadas_ids: personasAsignadas.value.map(p => p.id)
      }

      emit('emitirDatos', payload)
    }
  })
}
</script>

<template>
  <VForm
    ref="refForm"
    v-model="isFormValid"
    @submit.prevent="onSubmit"
  >
    <h3 class="text-h6 mb-3">Datos del Área</h3>
    <VRow>
      <VCol cols="12" md="6">
        <VTextField
          v-model="data.name"
          :rules="[requiredValidator]"
          label="Nombre del Área"
          placeholder="Ej: Infraestructura"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="data.description"
          :rules="[requiredValidator]"
          label="Descripción"
          placeholder="Breve descripción del área"
        />
      </VCol>
    </VRow>

    <VDivider class="my-6" />

    <h3 class="text-h6 mb-3">Contactos Asignados</h3>

    <VRow class="align-center">
      <VCol cols="12" md="9">
        <SelectorPro
          v-model="personaSeleccionada"
          clearable
          eager
          return-object
          item-title="nombre_completo"
          item-value="id"
          label="Buscar persona..."
          url="api/notification_contacts"
          :campos-a-filtrar="'buscarPorNombreCompleto'"
          :filtros="{
            sinPersonasAsignadasIds: idsExcluidos
          }"
        />
      </VCol>

      <VCol cols="12" md="3">
        <VBtn
          color="success"
          variant="outlined"
          :disabled="!personaSeleccionada"
          @click="agregarPersona"
        >
          <VIcon class="mr-2 ri-user-add-line"/>
          Agregar
        </VBtn>
      </VCol>
    </VRow>

    <VRow>
      <VCol cols="12">
        <VTable v-if="personasAsignadas.length > 0" class="elevation-1 border rounded">
          <thead>
          <tr>
            <th class="text-left">Nombre Completo</th>
            <th class="text-left">Teléfono</th>
            <th class="text-center">Acción</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="persona in personasAsignadas" :key="persona.id">
            <td>{{ persona.nombre_completo }}</td>
            <td>
              <VIcon size="small" class="mr-1 ri-phone-line" />
              {{ persona.telefono || 'Sin registro' }}
            </td>
            <td class="text-center">
              <VBtn
                icon
                color="error"
                variant="text"
                size="small"
                @click="removerPersona(persona.id)"
              >
                <VIcon class="ri-delete-bin-line" />
              </VBtn>
            </td>
          </tr>
          </tbody>
        </VTable>

        <VAlert
          v-else
          type="info"
          variant="tonal"
          class="mt-2"
          icon="ri-information-line"
        >
          No has asignado personas a esta área todavía. Busca arriba para agregarlas.
        </VAlert>
      </VCol>
    </VRow>

    <VRow class="mt-4">
      <VCol cols="12">
        <VBtn
          type="submit"
          class="me-3"
          color="primary"
        >
          <VIcon class="mr-2 ri-save-3-fill"/>
          Guardar Área
        </VBtn>

        <VBtn
          type="reset"
          variant="tonal"
          color="error"
          to="/areas"
        >
          <VIcon class="mr-2 ri-contract-left-fill"/>
          Cancelar
        </VBtn>
      </VCol>
    </VRow>

  </VForm>
</template>

<style scoped lang="scss">
.border {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
/* Asegura que la fila se alinee bien verticalmente si los campos tienen márgenes de error de Vuetify */
.align-center {
  align-items: flex-start;
}
</style>
