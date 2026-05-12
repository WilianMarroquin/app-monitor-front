<script setup lang="ts">
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import { useConfiguracionStore } from '@/stores/admin/useConfiguracionStore'
import { manejaError, validaSiExisteDato } from '@/utils/funcionesComunes'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginMaskDark from '@images/pages/auth-v2-login-mask-dark.png'
import authV2LoginMaskLight from '@images/pages/auth-v2-login-mask-light.png'
import { ref, onMounted } from 'vue'

const configuracionStore = useConfiguracionStore()

definePageMeta({
  layout: 'blank',
})

const { login } = useSanctumAuth()

const form = ref({
  usuario: '',
  password: '',
})

interface LoginForm {
  usuario: string
  password: string
}

// Nuevos estados para manejar la interfaz
const errorMessage = ref<string | null>(null)
const isLoading = ref(false)

const onSubmit = async (): Promise<void> => {
  try {
    errorMessage.value = null // Limpiamos errores previos al reintentar
    isLoading.value = true    // Encendemos el botón de carga

    const res = await login(form.value as LoginForm)
  }
  catch (e: any) {
    // Capturamos el mensaje de Laravel (suele venir en data.message)
    errorMessage.value = e?.data?.message || e?.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.'

    // Mantenemos tu manejador global por si registra logs u otras cosas
    manejaError(e)
  } finally {
    isLoading.value = false   // Apagamos el botón de carga sin importar si falló o no
  }
}

await configuracionStore.cargarGenerales()

const fondoLoginTemaClaro = validaSiExisteDato(configuracionStore?.configuracionesGenerales?.fondo_login_tema_claro) ? configuracionStore.configuracionesGenerales.fondo_login_tema_claro : authV2LoginIllustrationBorderedLight
const fondoLoginTemaOscuro = validaSiExisteDato(configuracionStore?.configuracionesGenerales?.fondo_login_tema_oscuro) ? configuracionStore.configuracionesGenerales.fondo_login_tema_oscuro : authV2LoginIllustrationBorderedDark
const logo = validaSiExisteDato(configuracionStore?.configuracionesGenerales?.logo) ? configuracionStore.configuracionesGenerales.logo : '/img/sysbase/logo.png'

const isPasswordVisible = ref(false)
const authV2LoginMask = useGenerateImageVariant(authV2LoginMaskLight, authV2LoginMaskDark)
const authV2LoginIllustration = useGenerateImageVariant(fondoLoginTemaClaro, fondoLoginTemaOscuro, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)

onMounted(() => {
  console.log(authV2LoginIllustration.value)
})
</script>

<template>
  <a href="javascript:void(0)">
    <div class="app-logo auth-logo">
      <img
        :src="logo"
        alt="Logo"
        height="50"
        class="mx-auto"
      />
      <h1 class="app-logo-title">
        {{ configuracionStore.configuracionesGenerales.nombre_aplicacion }}
      </h1>
    </div>
  </a>

  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      md="8"
      class="d-none d-md-flex align-center justify-center position-relative"
    >
      <div class="d-flex align-center justify-center pa-10">
        <img
          :src="authV2LoginIllustration"
          class="auth-illustration w-100"
          alt="auth-illustration"
        >
      </div>
      <VImg
        :src="authV2LoginMask"
        class="d-none d-md-flex auth-footer-mask"
        alt="auth-mask"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface));"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-5 pa-lg-7"
      >
        <VCardText>
          <h4 class="text-h4 mb-1">
            Bienvenid@ a <span class="text-capitalize">{{ configuracionStore.configuracionesGenerales.nombre_aplicacion }}! 👋🏻</span>
          </h4>

          <p class="mb-0">
            {{ configuracionStore.configuracionesGenerales.eslogan_aplicacion }}
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="onSubmit">
            <VRow>

              <VCol cols="12" v-if="errorMessage" class="pb-0">
                <VAlert
                  type="error"
                  variant="tonal"
                  density="compact"
                  closable
                  @click:close="errorMessage = null"
                  class="mb-2 text-body-2"
                >
                  {{ errorMessage }}
                </VAlert>
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="form.usuario"
                  autofocus
                  label="Email"
                  type="email"
                  placeholder="johndoe@email.com"
                  :error="!!errorMessage"
                  @input="errorMessage = null"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  :error="!!errorMessage"
                  @input="errorMessage = null"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <VBtn
                  class="mt-4"
                  block
                  type="submit"
                  :loading="isLoading"
                >
                  Iniciar Sesión
                </VBtn>
              </VCol>

              <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
