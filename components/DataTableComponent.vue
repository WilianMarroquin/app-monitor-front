<script lang="ts" setup>
import {
  exportarDataFormatoCSV,
  exportarDataFormatoPDF,
  exportarDataFormatoXLSX,
} from '@/utils/dataTable/exports'
import { manejaError } from '@/utils/funcionesComunes'

interface Columna {
  title: string
  key: string
}

interface DataTableProps {
  endpoint: string
  columnas: Columna[]
  cantidadPorPagina?: number
  cantidadPorPaginaOpciones?: number[]
  botones?: string[]
  titulo?: string
  filtros?: object
  relaciones?: string[]
  nombreArchivoExport?: string
}

interface PaginatedResponse {
  current_page: number
  data: []
  last_page: number
  per_page: number
  total: number
}

interface QueryParams {
  'page[number]'?: number
  'page[size]'?: number
  sort?: string
  include?: string

  [key: string]: string | number | undefined
}

const { get } = useClienteRequest()

const props = defineProps<DataTableProps>()
const cantidadPorPaginaValorDefault: number[] = [10, 20, 30]
const botonesDefault: string[] = ['xlsx', 'pdf', 'csv', 'reiniciar']
const fecha = new Date()

let {
  columnas,
  endpoint,
  cantidadPorPagina = 10,
  cantidadPorPaginaOpciones = cantidadPorPaginaValorDefault,
  botones = botonesDefault,
  relaciones,
  titulo = '',
  nombreArchivoExport = 'reporte_data' + fecha.getTime(),

} = props

let { filtros } = toRefs(props)

const items = ref<[]>([])
const currentPage = ref<number>(1)
const totalItems = ref<number>(0)
const loading = ref<boolean>(false)
const search = ref<string>('')
let itemsbyPage = ref<number>(cantidadPorPagina)
let itemsbyPageOptions = ref<number[]>(cantidadPorPaginaOpciones)

const orden = ref([{ key: columnas[0].key, order: 'desc' }] as const)

const getItems = async (): Promise<void> => {

  const sortParam = orden.value.length ? (orden.value[0].order === 'asc' ? orden.value[0].key : `-${orden.value[0].key}`) : ''

  let data: QueryParams = {
    'page[number]': currentPage.value,
    'page[size]': itemsbyPage.value,
    'sort': sortParam,
    'include': relaciones?.join(','),
  }

  if (filtros.value) {
    let key = Object.keys(filtros.value)

    for (let i = 0; i < key.length; i++) {
      data[`filter[${key[i]}]`] = filtros.value[key[i]]
    }
  }

  try {
    loading.value = true

    const respuesta: { data: PaginatedResponse } = await get(endpoint, {
      ...data,
      search: search.value,
    })

    items.value = respuesta.data.data
    totalItems.value = respuesta.data.total
  } catch (error: any) {
    manejaError(error)
  } finally {
    loading.value = false
  }
}

getItems()
watch([currentPage, itemsbyPage, filtros], getItems, { deep: true })

const reiniciar = () => {
  // currentPage.value = 1
  // itemsbyPage.value = cantidadPorPagina
  // filtros.value = {}
  // orden.value = [{ key: columnas[0].key, order: 'desc' }]

  getItems()
}

defineExpose({
  getItems,
})
</script>

<template>
  <VCard :title="titulo">

    <VCardText>
      <VRow
        class="mb-0"
        justify="end"
      >
        <VMenu>
          <template #activator="{ props: props }">
            <VBtn v-bind="props">
              <VIcon class="mr-2 ri-upload-2-fill" />
              Exportar
            </VBtn>
          </template>
          <VList
            dense
            class="pa-1 ma-1"
          >
            <VBtn
              v-if="botones.includes('csv')"
              class="mb-1"
              variant="tonal"
              block
              @click="exportarDataFormatoCSV(items, nombreArchivoExport, columnas)"
            >
              <VIcon class="ri-file-text-line"/>
              CSV
            </VBtn>

            <VBtn
              v-if="botones.includes('xlsx')"
              class="mb-1"
              variant="tonal"
              block
              @click="exportarDataFormatoXLSX(items, nombreArchivoExport, columnas)"
            >
              <VIcon class="ri-file-excel-2-line"/>
              Excel
            </VBtn>

            <VBtn
              v-if="botones.includes('pdf')"
              class="mb-1"
              variant="tonal"
              block
              @click="exportarDataFormatoPDF(items, nombreArchivoExport, columnas)"
            >
              <VIcon
                icon="ri-file-pdf-2-line"
                start
              />
              PDF
            </VBtn>
          </VList>
        </VMenu>
        <VBtn
          v-if="botones.includes('reiniciar')"
          class="mr-2 mb-3 ml-2"
          variant="tonal"
          @click="reiniciar"
        >
          <VTooltip
            activator="parent"
            location="top"
            start
          >
            <span>Reiniciar</span>
          </VTooltip>
          <VIcon class="mr-2 ri-loop-left-fill"/>
          Recargar
        </VBtn>
      </VRow>
      <VRow>
        <VDataTableServer
          v-model:sort-by="orden"
          v-model:items-per-page="itemsbyPage"
          v-model:page="currentPage"
          :headers="columnas"
          :items="items"
          :items-length="totalItems"
          :items-per-page-options="itemsbyPageOptions"
          :loading="loading"
          :search="search"
          item-value="id"
          @update:sort-by="getItems"
          @update:search="getItems"
        >
          <template
            v-for="(slot, name) in $slots"
            :key="name"
            #[name]="slotProps"
          >
            <slot
              :name="name"
              v-bind="slotProps"
            />
          </template>

        </VDataTableServer>
      </VRow>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
/* Estilos personalizados */
</style>
