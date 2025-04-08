<script setup lang="ts">
import type { MenuOpcionInterface } from '@/types/admin/configuraciones/types'
import { useConfigStore } from '@core/stores/config'
import Shepherd from 'shepherd.js'

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
    if (children && Array.isArray(children))
      flattened = flattened.concat(flrattenOptions(children))
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

const itemsFiltradas = computed(() => {
  if (searchQuery.value.length > 0) {
    return itemsAplanadas.filter(item => {
      const searchTerm = searchQuery.value.toLowerCase()

      return item?.titulo?.toLowerCase().includes(searchTerm)
    })
  }
  else {
    return itemsAplanadas
  }
})
</script>

<template>
  <div
    class="d-flex align-center cursor-pointer gap-x-2"
    v-bind="$attrs"
    style="user-select: none;"
    @click="isAppSearchBarVisible = !isAppSearchBarVisible"
  >
    <IconBtn @click="Shepherd.activeTour?.cancel()">
      <VIcon icon="ri-search-line" />
    </IconBtn>

    <div
      v-if="configStore.appContentLayoutNav === 'vertical'"
      class="d-none d-md-flex text-disabled text-body-1 gap-x-2"
      @click="Shepherd.activeTour?.cancel()"
    >
      <div>
        Search
      </div>
      <div class="meta-key">
        &#8984;K
      </div>
    </div>
  </div>

  <LazyAppBarSearch
    v-model:is-dialog-visible="isAppSearchBarVisible"
    :search-results="itemsFiltradas"
    :is-loading="isLoading"
    @search="searchQuery = $event"
  >
    <!-- suggestion -->
    <template #suggestions>
      <VCardText class="app-bar-search-suggestions pa-12">
        <VRow v-if="items.length > 0 ">
          <VCol
            cols="12"
            sm="6"
          >
            <p class="custom-letter-spacing text-xs text-disabled text-uppercase py-2 px-4 mb-0">
              listado de opciones
            </p>
            <VList class="card-list">
              <VListItem
                v-for="(item, index) in items"
                :key="index"
                link
                class="app-bar-search-suggestion mx-4 mt-2"
                :to="item.ruta ? item.ruta : ''"
              >
                <VListItemTitle>{{ item.titulo }}</VListItemTitle>
                <template #prepend>
                  <VIcon
                    :icon="item.icono ? item.icono : 'ri-file-text-line'"
                    size="20"
                    class="me-n1"
                  />
                </template>
              </VListItem>
            </VList>
          </VCol>
        </VRow>
      </VCardText>
    </template>

    <!--    &lt;!&ndash; no data suggestion &ndash;&gt; -->
    <!-- &lt;!&ndash;    <template #noDataSuggestion>&ndash;&gt; -->
    <!-- &lt;!&ndash;      <div class="mt-6">&ndash;&gt; -->
    <!-- &lt;!&ndash;        <div class="text-center text-disabled py-2">&ndash;&gt; -->
    <!-- &lt;!&ndash;          Try searching for&ndash;&gt; -->
    <!-- &lt;!&ndash;        </div>&ndash;&gt; -->
    <!-- &lt;!&ndash;        <h6&ndash;&gt; -->
    <!-- &lt;!&ndash;          v-for="suggestion in noDataSuggestions"&ndash;&gt; -->
    <!-- &lt;!&ndash;          :key="suggestion.title"&ndash;&gt; -->
    <!-- &lt;!&ndash;          class="app-bar-search-suggestion text-h6 font-weight-regular cursor-pointer py-2 px-4"&ndash;&gt; -->
    <!-- &lt;!&ndash;          @click="redirectToSuggestedOrSearchedPage(suggestion)"&ndash;&gt; -->
    <!-- &lt;!&ndash;        >&ndash;&gt; -->
    <!-- &lt;!&ndash;          <VIcon&ndash;&gt; -->
    <!-- &lt;!&ndash;            size="20"&ndash;&gt; -->
    <!-- &lt;!&ndash;            :icon="suggestion.icon"&ndash;&gt; -->
    <!-- &lt;!&ndash;            class="me-2"&ndash;&gt; -->
    <!-- &lt;!&ndash;          />&ndash;&gt; -->
    <!-- &lt;!&ndash;          <span class="d-inline-block">{{ suggestion.title }}</span>&ndash;&gt; -->
    <!-- &lt;!&ndash;        </h6>&ndash;&gt; -->
    <!-- &lt;!&ndash;      </div>&ndash;&gt; -->
    <!-- &lt;!&ndash;    </template>&ndash;&gt; -->

    <template #searchResult="{ item }">
      <VListItem @click="navegarHaciaRuta(item)">
        <template #prepend>
          <VIcon
            size="20"
            :icon="item.icono ?? 'ri-file-text-line'"
            class="me-n1"
          />
        </template>
        <template #append>
          <VIcon
            size="20"
            icon="ri-corner-down-left-line"
            class="enter-icon text-medium-emphasis"
          />
        </template>
        <VListItemTitle>
          {{ item.titulo }}
        </VListItemTitle>
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
</style>
