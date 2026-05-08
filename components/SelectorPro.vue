<script setup lang="ts">
import type { SendResponseInterface } from '@/types/sistema/types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PropsInterface>(), {
  itemValue: 'id',
  itemTitle: 'nombre',
  multiple: false,
})

const emit = defineEmits<{
  'update:itemSelected': [value: any]
}>()

interface PropsInterface {
  url?: string
  itemSelected?: any
  initialItems?: any[]
  itemValue?: string
  itemTitle?: string
  camposAFiltrar?: string[]
  multiple?: boolean
  size?: number
  filtros?: object
}

const { get } = useClienteRequest()

const items = ref<any[]>([])
const itemSeleccionada = ref<any>(props.multiple ? [] : null)
const busqueda = ref('')
const loading = ref<boolean>(false)
const escribiendo = ref<boolean>(false)
const size_items = ref<number>(props.size || 7)
const totalItems = ref<number | null>(null)
const esBusquedaActiva = ref(false)
let timeoutBusqueda: ReturnType<typeof setTimeout>

const getItems = async (params: any = {}, append: boolean = false) => {
  if (!props.url)
    return

  if (
    totalItems.value !== null &&
    items.value.length >= totalItems.value &&
    !append
  ) {
    return
  }

  if (!esBusquedaActiva.value && totalItems.value !== null && items.value.length >= totalItems.value) {
    return
  }

  loading.value = true
  try {
    const queryParams = {
      'per_page': 5,
      ...params,
    }
    if (props.filtros) {
      let key = Object.keys(props.filtros);

      for (let i = 0; i < key.length; i++) {
        queryParams[`filter[${key[i]}]`] = props.filtros[key[i]];
      }
    }

    const respuesta = await get<SendResponseInterface<any>>(props.url, queryParams)

    if (!esBusquedaActiva.value) {
      totalItems.value = respuesta.data.total
    }

    if (append) {
      const nuevosItems = respuesta.data.data.filter((nuevo: any) =>
        !items.value.some((existente: any) => existente[props.itemValue] === nuevo[props.itemValue])
      )

      items.value = [...items.value, ...nuevosItems]
    }
    else {
      const nuevos = respuesta.data.data

      items.value = [
        ...items.value,
        ...nuevos.filter(n =>
          !items.value.some(i => i[props.itemValue] === n[props.itemValue])
        )
      ]
    }
  }
  catch (error: any) {
    manejaError(error)
  }
  finally {
    loading.value = false
  }
}

watch(busqueda, (nuevoValor) => {
  escribiendo.value = true
  esBusquedaActiva.value = !!nuevoValor

  // 1. GUARD CLAUSE: Si el buscador está vacío, reseteamos.
  if (!nuevoValor) {
    escribiendo.value = false

    if (itemSeleccionada.value) return

    getItems()
    return
  }

  clearTimeout(timeoutBusqueda)

  // 2. CHECK INTELIGENTE:
  // Verificamos si el texto actual coincide EXACTAMENTE con el título del ítem seleccionado.
  // Si es así, significa que acabamos de seleccionar, NO estamos buscando.
  if (itemSeleccionada.value) {
    // Buscamos el objeto completo en la lista para comparar
    const itemObj = items.value.find(i => i[props.itemValue] === itemSeleccionada.value) || itemSeleccionada.value;

    // Si el texto de búsqueda es igual al título del item seleccionado, ABORTAMOS la búsqueda.
    // Usamos props.itemTitle para que sea dinámico (ej. 'nombre_completo')
    if (itemObj && nuevoValor === itemObj[props.itemTitle]) {
      escribiendo.value = false
      return
    }
  }

  const textoBusqueda = nuevoValor.toLowerCase()

  console.log('Items: ', items.value)
  console.log('Valor del props: ', props.itemTitle)
  const existeLocalmente = items.value.some((item: any) =>
    item[props.itemTitle]?.toLowerCase().includes(textoBusqueda),
  )

  if (!esBusquedaActiva.value && existeLocalmente) {
    escribiendo.value = false
    return
  }


  timeoutBusqueda = setTimeout(() => {
    escribiendo.value = false

    let filtroEspecifico = []

    if (props.camposAFiltrar) {

      filtroEspecifico = props.camposAFiltrar.reduce((acc: any, campo: string) => {
        acc[`filter[${campo.trim()}]`] = nuevoValor

        return acc

      }, {})

    }

    getItems(filtroEspecifico)
  }, 500)
})


watch(itemSeleccionada, (newValue) => {
  emit('update:itemSelected', newValue)
  if (props.multiple) {
    busqueda.value = ''
  }
})

watch(() => props.itemSelected, (newVal) => {
  itemSeleccionada.value = newVal
  
  // Si el nuevo valor es nulo, también limpiamos la búsqueda visual
  if (!newVal || (Array.isArray(newVal) && newVal.length === 0)) {
    busqueda.value = ''
  }
})

watch(() => props.filtros,
  async (newFiltros, oldFiltros) => {

    if (!newFiltros) return

    if (JSON.stringify(newFiltros) === JSON.stringify(oldFiltros)) return

    const filtrosVacios = Object.values(newFiltros).every(v => !v)

    if (filtrosVacios) {
      items.value = []
      itemSeleccionada.value = props.multiple ? [] : null
      busqueda.value = ''
      return
    }

    itemSeleccionada.value = props.multiple ? [] : null

    items.value = []
    await getItems({}, false)
  },
  { deep: true }
)


onMounted(async () => {
  if (props.initialItems && props.initialItems.length > 0)
    items.value = [...props.initialItems]
  else if (props.url)
    await getItems()
  if (props.itemSelected) {
    itemSeleccionada.value = props.itemSelected

    const estaEnLista = items.value.some((i: any) => i[props.itemValue] === props.itemSelected)
    if (!estaEnLista && props.url) {
      const filtroEspecifico = {
        [`filter[${props.itemValue}]`]: props.itemSelected,
      }

      await getItems(filtroEspecifico, true)
    }
  }
})

</script>

<template>
  <VAutocomplete
    v-bind="$attrs"
    v-model="itemSeleccionada"
    v-model:search="busqueda"
    :items="items"
    :loading="loading"
    :item-value="props.itemValue"
    :item-title="props.itemTitle"
    :multiple="props.multiple"
    :chips="props.multiple"
    :closable-chips="props.multiple"
    :clearable="!props.multiple"
    :clear-on-select="!props.multiple"
  >
    <template #item="{ props: itemProps, item }">
      <VListItem
        v-bind="itemProps"
        :title="item.raw[props.itemTitle]"
      />
    </template>
    <template v-slot:no-data>
      <div class="pa-2 text-center text-grey">
        <span v-if="loading">Buscando...</span>
        <span v-else-if="!escribiendo">No encontramos "{{ busqueda }}"</span>
      </div>
    </template>
    <template v-slot:append-item>
      <div
        v-if="items.length > 0 && !loading && !escribiendo"
        class="pa-2 text-caption text-center text-grey"
      >
        Escribe para ver más resultados...
      </div>
    </template>
  </VAutocomplete>
</template>
