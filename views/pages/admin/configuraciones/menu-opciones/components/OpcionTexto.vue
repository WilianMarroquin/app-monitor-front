<script lang="ts" setup>
import type { MenuOpcionInterface } from '@/types/admin/configuraciones/types'
import { computed } from 'vue'
import OptionBotones from './OpcionBotones.vue'

const props = defineProps<{ item: MenuOpcionInterface }>()
const esTituloSeccion = computed(() => props.item.titulo_seccion !== null)

const iconClass = computed(() => {
  if (!props.item.icono)
    return 'tabler-circle'

  return props.item.icono || ''
})
</script>

<template>
  <div>
    <template v-if="esTituloSeccion">
      <div style="display: flex; ">
        <span class="heading"
              style="cursor: pointer"
              v-text="props.item.titulo_seccion">
        </span>
        <OptionBotones :id="props.item.id"
                       :esTituloSeccion="true"
        />
      </div>

    </template>

    <template v-else>
      <div class="item-container">
        <i
          v-if="!esTituloSeccion"
          :class="iconClass"
          class="item-icon">
        </i>
        <span style="cursor: pointer" v-text="props.item.titulo"></span>
        <OptionBotones :id="props.item.id"
                       :esTituloSeccion="false"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.heading {
  font-weight: bold;
  font-size: 1.2em;
  //margin-bottom: 8px;
  margin-right: 8px;
}

.item-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-icon {
  width: 25px;
  height: 25px;
}
</style>
