<template>
  <li
    :id="props.item.id"
    style="margin-bottom: 10px; list-style-type: none; "
  >
    <option-text :item="props.item"/>

    <ul
      v-if="props.item.children && props.item.children.length > 0"
      :ref="el => (refs['childrenList' + props.item.id] = el)"
      class="parent-list"
    >
      <opcion
        v-for="child in props.item.children"
        :key="child.id"
        :item="child"
        style="margin-left: 35px; margin-top: 10px;"
        @update="updateChild"
      />
    </ul>
  </li>
</template>

<script lang="ts" setup>
import OptionText from './OpcionTexto.vue'
import { onMounted, reactive } from "vue"
import Sortable from "sortablejs"

// Interfaz del item
interface Item {
  id: string | number
  children?: Item[]
}

const emit = defineEmits(["update"])

// Props del componente
interface Props {
  item: Item
}

const props = defineProps<Props>()

// Referencias dinámicas para Sortable
const refs = reactive<Record<string, HTMLElement | null>>({})

onMounted(() => {
  const refKey = `childrenList${props.item.id}`; // Generar la clave de la referencia
  const el = refs[refKey]; // Acceder al elemento DOM

  if (el) {
    new Sortable(el, {
      group: `group-${props.item.id}`, // Grupo único basado en el ID del padre
      animation: 150,
      onEnd: (event) => {
        const [moved] = props.item.children.splice(event.oldIndex, 1);
        props.item.children.splice(event.newIndex, 0, moved);
        emit("update", props.item);
      },
    });
  }
});

const updateChild = (updatedChild) => {
  emit("update", props.item);
};
</script>

<style scoped>
li {
  margin-bottom: 10px;
  list-style-type: none;
}

ul {
  margin-left: 35px;
  margin-top: 10px;
}
</style>
