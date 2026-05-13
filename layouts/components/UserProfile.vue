<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import avatar1 from '@images/avatars/avatar-1.png'
import type { UsuarioInterface } from '@/types/admin/modulo-usuarios/types'

const usuarioAutenticado = useSanctumUser<UsuarioInterface>()
const { user, logout } = useSanctumAuth()
const { post } = useClienteRequest()
const { success } = useToast()

const userProfileList = [
  { type: 'divider' },
  {
    type: 'navItem',
    icon: 'ri-user-line',
    title: 'Perfil',
    href: '/admin/modulo-usuarios/usuarios/perfil',
  },
  {
    type: 'navItem',
    icon: 'ri-settings-4-line',
    title: 'Settings',
    href: '#',
  },
]

// const cerrarSecion = async () => {
//   try {
//     const res = await post('api/logout', {})
//     success(res?.message || 'Sesión cerrada exitosamente')
//     user.value = null
//     navigateTo('/login')
//   }
//   catch (e) {
//     manejaError(e)
//   }
// }
</script>

<template>
  <VBadge
    dot
    bordered
    location="bottom right"
    offset-x="2"
    offset-y="2"
    color="success"
    class="user-profile-badge"
  >
    <VAvatar
      class="cursor-pointer"
      size="38"
    >
      <VImg :src="usuarioAutenticado?.avatar_thumb24 ?? avatar1" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="15px"
      >
        <VList>
          <VListItem class="px-4">
            <div class="d-flex gap-x-2 align-center">
              <VAvatar>
                <VImg :src="usuarioAutenticado?.avatar_thumb24 ?? avatar1" />
              </VAvatar>

              <div>
                <div class="text-body-2 font-weight-medium text-high-emphasis">
                  {{ usuarioAutenticado?.primer_nombre }} {{ usuarioAutenticado?.primer_apellido }}
                </div>
                <div class="text-capitalize text-caption text-disabled">
                  {{ usuarioAutenticado?.roles[0] }}
                </div>
              </div>
            </div>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template
              v-for="item in userProfileList"
              :key="item.title"
            >
              <VListItem
                @click="item.href ? $router.push(item.href) : null"
                v-if="item.type === 'navItem'"
                class="px-4"
              >
                <template #prepend>
                  <VIcon
                    :icon="item.icon"
                    size="22"
                  />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>

<!--                <template-->
<!--                  v-if="item.chipsProps"-->
<!--                  #append-->
<!--                >-->
<!--                  <VChip-->
<!--                    v-bind="item.chipsProps"-->
<!--                    variant="elevated"-->
<!--                  />-->
<!--                </template>-->
              </VListItem>

              <VDivider
                v-else
                class="my-1"
              />
            </template>

            <VListItem class="px-4">
              <VBtn
                block
                color="error"
                size="small"
                append-icon="ri-logout-box-r-line"
                @click="logout"
              >
                Logout
              </VBtn>
            </VListItem>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>

<style lang="scss">
.user-profile-badge {
  &.v-badge--bordered.v-badge--dot .v-badge__badge::after {
    color: rgb(var(--v-theme-background));
  }
}
</style>
