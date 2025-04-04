<script lang="ts" setup>
import Sortable from 'sortablejs'
import Opcion from './Opcion.vue'
import type { MenuOpcionInterface } from '@/types/admin/configuraciones/types'

interface Props {
  opciones: MenuOpcionInterface[]
}

interface Emit {
  (e: string, value: MenuOpcionInterface[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const parentList = ref(null)

onMounted(() => {
  if (parentList.value instanceof HTMLElement) {
    new Sortable(parentList.value, {
      group: "parents", // Solo los padres se pueden mover entre sí
      animation: 150,
      onEnd: (event) => {
        const [moved] = props.opciones.splice(event.oldIndex, 1)
        props.opciones.splice(event.newIndex, 0, moved)
        emit('itemsActualizadas', props.opciones)
      },
    })
  }
})

const actualizacion = () => {
  emit('itemsActualizadas', props.opciones)
}
</script>

<template>
  <ul
    ref="parentList"
    class="parent-list"
    style="list-style-type: none"
  >
    <Opcion
      v-for="item in opciones"
      :key="item.id ?? 'default-key'"
      :item="item"
      @update="actualizacion"
    />
  </ul>
</template>

<style scoped>
/* Agrega tus estilos personalizados si es necesario */
</style>
