<script lang="ts" setup>
import { NuxtLink } from '#components'
import { layoutConfig } from '@layouts'
import { can } from '@layouts/plugins/casl'
import type { MenuOpcionInterface } from '@/types/admin/configuraciones/types'
import { getComputedNavLinkToProp, getDynamicI18nProps, isNavLinkActive } from '@layouts/utils'

interface Props {
  item: MenuOpcionInterface
  isSubItem?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSubItem: false,
})
</script>

<template>
  <li
    v-if="can(item.action, item.subject)"
    class="nav-link"
    :class="[{
      'sub-item': props.isSubItem,
      'disabled': item.disable,
    }]"
  >
    <Component
      :is="item.ruta ? NuxtLink : 'a'"
      v-bind="getComputedNavLinkToProp(item)"
      :class="{ 'router-link-active router-link-exact-active': isNavLinkActive(item, $router) }"
    >
      <VIcon :icon="item.icono ?? 'ri-circle-line'"/>
      <Component
        :is="layoutConfig.app.i18n.enable ? 'i18n-t' : 'span'"
        class="nav-item-title"
        v-bind="getDynamicI18nProps(item.titulo, 'span')"
      >
        {{ item.titulo }}
      </Component>
    </Component>
  </li>
</template>

<style lang="scss">
.layout-horizontal-nav {
  .nav-link a {
    display: flex;
    align-items: center;
  }
}
</style>
