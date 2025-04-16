<script setup lang="ts">
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import { useConfiguracionStore } from '@/stores/admin/useConfiguracionStore'
import { manejaError } from '@/utils/funcionesComunes'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginMaskDark from '@images/pages/auth-v2-login-mask-dark.png'
import authV2LoginMaskLight from '@images/pages/auth-v2-login-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

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

const onSubmit = async (): Promise<void> => {
  try {
    await login(form.value as LoginForm)
  }
  catch (e: any) {
    manejaError(e)
  }
}

const isPasswordVisible = ref(false)
const authV2LoginMask = useGenerateImageVariant(authV2LoginMaskLight, authV2LoginMaskDark)
const authV2LoginIllustration = useGenerateImageVariant(configuracionStore.configuracionesGenerales.fondo_login_tema_claro, configuracionStore.configuracionesGenerales.fondo_login_tema_oscuro, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)

onMounted(() => {
  configuracionStore.cargarGenerales()
})
</script>

<template>
  <a href="javascript:void(0)">
    <div class="app-logo auth-logo">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
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
            Welcome to <span class="text-capitalize">{{ configuracionStore.configuracionesGenerales.nombre_aplicacion }}! 👋🏻</span>
          </h4>

          <p class="mb-0">
            {{ configuracionStore.configuracionesGenerales.eslogan_aplicacion }}
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="form.usuario"
                  autofocus
                  label="Email"
                  type="email"
                  placeholder="johndoe@email.com"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <!-- remember me checkbox -->
                <!--                <div class="d-flex align-center justify-space-between flex-wrap my-6 gap-x-2"> -->
                <!--                  <VCheckbox -->
                <!--                    v-model="form.remember" -->
                <!--                    label="Remember me" -->
                <!--                  /> -->

                <!--                  <a -->
                <!--                    class="text-primary" -->
                <!--                    href="javascript:void(0)" -->
                <!--                  > -->
                <!--                    Forgot Password? -->
                <!--                  </a> -->
                <!--                </div> -->

                <!-- login button -->
                <VBtn
                  class="mt-4"
                  block
                  type="submit"
                >
                  Iniciar Sesión
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-body-1 text-center"
              >
                <span class="d-inline-block">
                  New on our platform?
                </span>
                <a
                  class="text-primary ms-1 d-inline-block text-body-1"
                  href="javascript:void(0)"
                >
                  Create an account
                </a>
              </VCol>

              <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />
                <span class="mx-4 text-high-emphasis">or</span>
                <VDivider />
              </VCol>

              <!-- auth providers -->
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
