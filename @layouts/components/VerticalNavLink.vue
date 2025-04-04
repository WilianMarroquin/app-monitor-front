<script lang="ts" setup>
import { NuxtLink } from '#components'

import { layoutConfig } from '@layouts'

import { useLayoutConfigStore } from '@layouts/stores/config'
import type { NavLink } from '@layouts/types'
import { getComputedNavLinkToProp, getDynamicI18nProps, isNavLinkActive } from '@layouts/utils'

defineProps<{
  item: NavLink
}>()

const { can } = useAbility()

const configStore = useLayoutConfigStore()
const hideTitleAndBadge = configStore.isVerticalNavMini()
</script>

<template>
  <li
    v-if="can(item.action, item.subject)"
    class="nav-link"
    :class="{ disabled: item.disable }"
  >
    <Component
      :is="item.ruta ? NuxtLink : 'a'"
      v-bind="getComputedNavLinkToProp(item)"
      :class="{ 'router-link-active router-link-exact-active': isNavLinkActive(item, $router) }"
    >
<!--      <Component-->
<!--        :is="layoutConfig.app.iconRenderer || 'div'"-->
<!--        v-bind="item.icono || layoutConfig.verticalNav.defaultNavItemIconProps"-->
<!--        class="nav-item-icon"-->
<!--      />-->
      <VIcon :icon="item.icono ?? 'ri-circle-line'"/>

      <TransitionGroup name="transition-slide-x">
        <!-- 👉 Title -->
        <Component
          :is="layoutConfig.app.i18n.enable ? 'i18n-t' : 'span'"
          v-show="!hideTitleAndBadge"
          key="title"
          class="nav-item-title"
          v-bind="getDynamicI18nProps(item.titulo, 'span')"
        >
          {{ item.titulo }}
        </Component>

        <!-- 👉 Badge -->
        <Component
          :is="layoutConfig.app.i18n.enable ? 'i18n-t' : 'span'"
          v-if="item.badgeContent"
          v-show="!hideTitleAndBadge"
          key="badge"
          class="nav-item-badge"
          :class="item.badgeClass"
          v-bind="getDynamicI18nProps(item.badgeContent, 'span')"
        >
          {{ item.badgeContent }}
        </Component>
      </TransitionGroup>
    </Component>
  </li>
</template>

<style lang="scss">
.layout-vertical-nav {
  .nav-link a {
    display: flex;
    align-items: center;
  }
}
</style>
