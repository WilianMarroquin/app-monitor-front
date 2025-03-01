<template>
  <ul ref="parentList"
      class="parent-list"
      style="list-style-type: none;"
  >
    <opcion
      v-for="item in opciones"
      :key="item.id"
      :item="item"
      @update="actualizacion"
    />
  </ul>
</template>

<script lang="ts" setup>
import Opcion from './Opcion.vue'

import { onMounted, ref } from "vue"
import Sortable from "sortablejs"

interface Props {
  opciones: []
}

interface Emit {
  (e: string, value: any): void
}

const emit = defineEmits<Emit>()
const props = defineProps<Props>()

const parentList = ref(null)

// const items = ref([...props.opciones]);

onMounted(() => {

  new Sortable(parentList.value, {
    group: "parents", // Solo los padres se pueden mover entre sí
    animation: 150,
    onEnd: (event) => {
      const [moved] = props.opciones.splice(event.oldIndex, 1);
      props.opciones.splice(event.newIndex, 0, moved);
      emit("ItemsActualizadas", props.opciones);
    },
  });

});

const actualizacion = (opciones) => {
  emit("ItemsActualizadas", props.opciones)
}

</script>

<style scoped>
/* Agrega tus estilos personalizados si es necesario */
</style>
