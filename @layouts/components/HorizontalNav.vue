<script lang="ts" setup>
import { HorizontalNavGroup, HorizontalNavLink } from '@layouts/components'
import type { MenuOpcionInterface } from '@/types/admin/configuraciones/types'

defineProps<{
  navItems: MenuOpcionInterface[]
}>()

const resolveNavItemComponent = (item: MenuOpcionInterface) => {
  if (item?.children?.length > 0)
    return HorizontalNavGroup

  return HorizontalNavLink
}
</script>

<template>
  <ul class="nav-items">
    <Component
      :is="resolveNavItemComponent(item)"
      v-for="(item, index) in navItems"
      :key="index"
      data-allow-mismatch
      :item="item"
    />
  </ul>
</template>

<style lang="scss">
.layout-wrapper.layout-nav-type-horizontal {
  .nav-items {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
