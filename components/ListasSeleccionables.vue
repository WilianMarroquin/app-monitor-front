<script setup>
import { computed, ref, watch } from 'vue'

// Props para el título, items disponibles y seleccionados
const props = defineProps({
  title: {
    type: String,
    default: 'Dual List Box',
  },
  items: {
    type: Array,
    default: () => [],
  },
  selectedItems: {
    type: Array,
    default: () => [],
  },
  tipo: {
    type: String,
    required: true,
  },
})

// Emitir eventos cuando los items seleccionados cambien
const emit = defineEmits(['update:selectedItems'])

// Items disponibles y seleccionados
const availableItems = ref([])
const selectedItems = ref([])

// Campos de búsqueda
const searchAvailable = ref('')
const searchSelected = ref('')

// Inicializar items
const inicializarItems = () => {
  selectedItems.value = [...props.selectedItems]
  availableItems.value = props.items.filter(
    item => !props.selectedItems.some(selected => selected.id === item.id),
  )
}

// Watcher para sincronizar props y estado interno
watch(
  () => [props.items, props.selectedItems],
  () => {
    inicializarItems()
  },
  { immediate: true, deep: true },
)

// Items filtrados según búsqueda
const filteredAvailableItems = computed(() => {
  return availableItems.value.filter(item =>
    item.name.toLowerCase().includes(searchAvailable.value.toLowerCase()),
  )
})

const filteredSelectedItems = computed(() => {
  return selectedItems.value.filter(item =>
    item.name.toLowerCase().includes(searchSelected.value.toLowerCase()),
  )
})

// Función para seleccionar un item
const selectItem = item => {
  selectedItems.value.push(item)
  availableItems.value = availableItems.value.filter(i => i.id !== item.id)
  emit('update:selectedItems', selectedItems.value)
}

// Función para deseleccionar un item
const deselectItem = item => {
  availableItems.value.push(item)
  selectedItems.value = selectedItems.value.filter(i => i.id !== item.id)
  emit('update:selectedItems', selectedItems.value)
}

// Función para mover todos los disponibles a seleccionados
const moveAllToSelected = () => {
  selectedItems.value.push(...availableItems.value)
  availableItems.value = []
  emit('update:selectedItems', selectedItems.value)
}

// Función para mover todos los seleccionados a disponibles
const moveAllToAvailable = () => {
  availableItems.value.push(...selectedItems.value)
  selectedItems.value = []
  emit('update:selectedItems', selectedItems.value)
}
</script>

<template>
  <VContainer fluid>
    <VRow justify="center">
      <VCol cols="12">
        <h2 class="text-h5 text-center font-weight-medium mb-4">
          {{ `Selector de ${props.tipo}` }}
        </h2>
      </VCol>
    </VRow>

    <VRow
      align="stretch"
      justify="center"
      class="flex-wrap"
    >
      <!-- Lista de Disponibles -->
      <VCol cols="12" md="5" class="mb-4 mb-md-0">
        <VCard elevation="3" rounded="lg" class="d-flex flex-column" style="min-height: 400px; max-height: 500px;">
          <VCardTitle class="text-center text-subtitle-1">
            {{ props.tipo }} Disponibles
          </VCardTitle>

          <VCardText class=" flex-column flex-grow-1">
            <VTextField
              v-model="searchAvailable"
              :label="`Buscar en ${props.tipo} Disponibles`"
              prepend-inner-icon="ri-search-line"
              variant="outlined"
              class="mb-3"
            />

            <div class="flex-grow-1 overflow-y-auto">
              <VList
                v-if="filteredAvailableItems.length"
                density="compact"
                class="pr-1"
              >
                <VListItem
                  v-for="item in filteredAvailableItems"
                  :key="item.id"
                  @click="selectItem(item)"
                  class="rounded-lg"
                  :class="'hover:bg-primary-lighten-5'"
                >
                  <VListItemTitle>{{ item.name }}</VListItemTitle>
                </VListItem>
              </VList>

              <div
                v-else
                class="text-center text-medium-emphasis py-2"
              >
                No hay {{ props.tipo }} disponibles.
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Botones -->
      <VCol
        cols="12"
        md="1"
        class="d-flex flex-row flex-md-column align-center justify-center my-2"
      >
        <VBtn
          icon="ri-arrow-right-double-line"
          color="primary"
          variant="outlined"
          class="mb-2 mb-md-4"
          @click="moveAllToSelected"
        />
        <VBtn
          icon="ri-arrow-left-double-line"
          color="primary"
          variant="outlined"
          @click="moveAllToAvailable"
        />
      </VCol>

      <!-- Lista de Seleccionados -->
      <VCol cols="12" md="5">
        <VCard elevation="3" rounded="lg" class="h-100 d-flex flex-column">
          <VCardTitle class="text-center text-subtitle-1">
            {{ props.tipo }} Seleccionados
          </VCardTitle>
          <VCardText class=" flex-column flex-grow-1">
            <VTextField
              v-model="searchAvailable"
              :label="`Buscar en ${props.tipo} Disponibles`"
              prepend-inner-icon="ri-search-line"
              variant="outlined"
              class="mb-3"
            />
            <VList
              v-if="filteredSelectedItems.length"
              density="compact"
              class="overflow-y-auto"
              style="flex-grow: 1; max-height: 300px;"
            >
              <VListItem
                v-for="item in filteredSelectedItems"
                :key="item.id"
                @click="deselectItem(item)"
                class="rounded-lg"
                :class="'hover:bg-primary-lighten-5'"
              >
                <VListItemTitle>{{ item.name }}</VListItemTitle>
              </VListItem>
            </VList>
            <div
              v-else
              class="text-center text-medium-emphasis py-2"
            >
              No hay {{ props.tipo }} seleccionados.
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
.text-center {
  text-align: center;
}

.clickable-text {
  cursor: pointer;
  transition: background-color 0.3s ease;
  padding: 8px;
}

.clickable-text:hover {
  background-color: var(--button-hover-color);
}

.scrollable-list {
  max-height: 300px;
  overflow-y: auto;
  border-radius: 8px;
  padding: 8px;
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 960px) {
  .scrollable-list {
    max-height: 200px; /* Altura reducida para pantallas pequeñas */
  }
}
</style>
