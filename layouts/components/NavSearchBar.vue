<script setup lang="ts">
import type { MenuOpcionInterface } from '@/types/admin/configuraciones/types'
import { validaSiExisteDato } from '@/utils/funcionesComunes'
import { useConfigStore } from '@core/stores/config'

defineOptions({
  inheritAttrs: false,
})

const configStore = useConfigStore()

const items = useState<MenuOpcionInterface[]>('menu', () => [])
const isAppSearchBarVisible = ref(false)
const searchQuery = ref('')
const isLoading = ref(false)

const LazyAppBarSearch = defineAsyncComponent(() => import('@core/components/AppBarSearch.vue'))

const flrattenOptions = (options: MenuOpcionInterface[]) => {
  let flattened: MenuOpcionInterface[] = []
  for (const option of options) {
    const { children, ...currentOption } = option

    flattened.push(currentOption as MenuOpcionInterface)
    if (children && Array.isArray(children)) {
      flattened = flattened.concat(flrattenOptions(children))
    }
  }

  return flattened
}

const navegarHaciaRuta = async (item: MenuOpcionInterface) => {
  if (item.ruta) {
    const ruta = {
      name: item.ruta,
    }

    await navigateTo(ruta)

    isAppSearchBarVisible.value = false
    searchQuery.value = ''
  }
}
const itemsAplanadas = flrattenOptions(items.value)
const itemsLink = itemsAplanadas.filter(item => validaSiExisteDato(item.ruta))

const itemsFiltradas = computed(() => {
  if (searchQuery.value.length > 0) {
    return itemsLink.filter(item => {
      const searchTerm = searchQuery.value.toLowerCase()

      return item?.titulo?.toLowerCase().includes(searchTerm)
    })
  }
  else {
    return itemsLink
  }
})
</script>

<template>
  <div
    class="d-flex align-center gap-x-2 cursor-pointer px-2 py-1 rounded hover:bg-surface-hover transition-colors"
    v-bind="$attrs"
    style="user-select: none;"
    @click="isAppSearchBarVisible = !isAppSearchBarVisible"
    aria-label="Buscar en el sistema"
  >
    <IconBtn>
      <VIcon icon="ri-search-line" />
    </IconBtn>

    <div
      v-if="configStore.appContentLayoutNav === 'vertical'"
      class="d-none d-md-flex align-center gap-x-2 text-disabled text-sm font-medium"
    >
      <span>Buscar</span>
      <span class="meta-key">⌘K</span>
    </div>
  </div>

  <LazyAppBarSearch
    v-model:is-dialog-visible="isAppSearchBarVisible"
    :search-results="itemsFiltradas"
    :is-loading="isLoading"
    @search="searchQuery = $event"
  >
    <!-- Sugerencias -->
    <template #suggestions>
      <VList v-if="itemsLink.length > 0 ">
        <VListItem
          v-for="item in itemsLink"
          :key="item"
          tabindex="0"
          class="item-hover"
          @click="navegarHaciaRuta(item)"
        >
          <template #prepend>
            <VIcon
              :icon="item.icono ?? 'ri-file-text-line'"
              size="20"
              class="me-2"
            />
          </template>
          <VListItemTitle class="text-body-1">{{ item.titulo }}</VListItemTitle>
        </VListItem>
      </VList>
    </template>

    <!-- No se encontró nada -->
    <template #noDataSuggestion>
      <div class="mt-6 text-center text-disabled">
        <div class="py-2">No se encontraron coincidencias. Intenta con:</div>
        <div class="flex flex-col items-center gap-1 mt-4">
          <h6
            v-for="suggestion in itemsLink.slice(0, 5)"
            :key="suggestion.titulo"
            class="app-bar-search-suggestion text-body-1 cursor-pointer py-2 px-4 rounded hover:bg-surface-hover transition-colors"
            @click="navegarHaciaRuta(suggestion)"
          >
            <VIcon size="20" :icon="suggestion.icono" class="me-2" />
            {{ suggestion.titulo }}
          </h6>
        </div>
      </div>
    </template>

    <!-- Resultado de búsqueda -->
    <template #searchResult="{ item }">
      <VListItem
        class="item-hover"
        @click="navegarHaciaRuta(item)"
      >
        <template #prepend>
          <VIcon
            size="20"
            :icon="item.icono ?? 'ri-file-text-line'"
            class="me-2"
          />
        </template>
        <VListItemTitle class="text-body-1">
          {{ item.titulo }}
        </VListItemTitle>
        <template #append>
          <VIcon
            size="18"
            icon="ri-corner-down-left-line"
            class="text-disabled"
          />
        </template>
      </VListItem>
    </template>
  </LazyAppBarSearch>
</template>

<style lang="scss">
@use "@styles/variables/vuetify.scss";

.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  padding-block: 0.1rem;
  padding-inline: 0.25rem;
}

.app-bar-search-dialog {
  .custom-letter-spacing {
    letter-spacing: 0.8px;
  }

  .card-list {
    --v-card-list-gap: 8px;
  }
}
.app-bar-search-suggestion {
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: rgba(var(--v-theme-on-surface), 0.04);
  }
}
.item-hover:focus{
  background-color: rgba(var(--v-theme-primary), 0.5);;
}
.item-hover:hover{
  background-color: rgba(var(--v-theme-primary), 0.5);;
}
</style>
