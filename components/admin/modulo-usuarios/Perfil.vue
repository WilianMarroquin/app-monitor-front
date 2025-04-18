<script setup lang="ts">
import { manejaError } from '@/utils/funcionesComunes'
import type { UsuarioInterface } from '@/types/admin/modulo-usuarios/types'
import type { SendResponseInterface } from '@/types/generales/types'
import DatosGenerales from '@/views/pages/admin/modulo-usuarios/usuarios/perfil/DatosGenerales.vue'

interface PropInterface {
  id: number | null
}

const props = defineProps<PropInterface>()

const { get } = useClienteRequest()

interface PerfilUsuarioInterface {
  datos_usuario: UsuarioInterface
}

const usuario = ref<UsuarioInterface | null>(null)
const userTab = ref(null)
const tabs = [
  { icon: 'ri-group-line', title: 'Overview' },
  { icon: 'ri-lock-2-line', title: 'Security' },
  { icon: 'ri-bookmark-line', title: 'Billing & Plan' },
  { icon: 'ri-notification-4-line', title: 'Notifications' },
  { icon: 'ri-link-m', title: 'Connections' },
]

const getDatosUsuario = async (): Promise<void> => {
  try {
    const res = await get<SendResponseInterface<PerfilUsuarioInterface>>(`api/admin/modulo-usuarios/users/get/data/perfil/${props.id}`)

    if (!res.data)
      return

    usuario.value = res.data.datos_usuario
  }
  catch (error: any) {
    manejaError(error)
  }
}

getDatosUsuario()
</script>

<template>
  <VRow v-if="usuario">
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <DatosGenerales :user-data="usuario" />
    </VCol>

    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <VTabs
        v-model="userTab"
        class="v-tabs-pill"
      >
        <VTab
          v-for="tab in tabs"
          :key="tab.icon"
        >
          <VIcon
            start
            :icon="tab.icon"
          />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>

      <VWindow
        v-model="userTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
<!--        <VWindowItem>-->
<!--          <UserTabOverview />-->
<!--        </VWindowItem>-->

        <VWindowItem>
<!--          <UserTabSecurity />-->
        </VWindowItem>

        <VWindowItem>
<!--          <UserTabBillingsPlans />-->
        </VWindowItem>

        <VWindowItem>
<!--          <UserTabNotifications />-->
        </VWindowItem>

        <VWindowItem>
<!--          <UserTabConnections />-->
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>

<style scoped>

</style>
