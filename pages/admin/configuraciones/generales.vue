<script lang="ts" setup>
import type { VForm } from 'vuetify/components/VForm'
import { useConfiguracionStore } from '@/stores/admin/useConfiguracionStore'
import type { ConfiguracionGeneralInterface } from '@/types/admin/configuraciones/types'
import { manejaError } from '@/utils/funcionesComunes'

definePageMeta({
  navActiveLink: 'dev-configuraciones-generales',
  middleware: 'permissions',
  action: 'Listar Configuraciones Generales',
  subject: 'Configuracion',
})

const { can } = useAbility()

const storeConfiguracion = useConfiguracionStore()
const formOpcion = ref<InstanceType<typeof VForm>>()

const configuracionGeneral = ref<ConfiguracionGeneralInterface>({
  nombre_aplicacion: '',
  email_aplicacion: '',
  telefono_aplicacion: '',
  eslogan_aplicacion: '',
  fondo_login_tema_claro: [],
  fondo_login_tema_oscuro: [],
  logo: [],
})

const guardarConfiguraciones = async (): Promise<void> => {
  try {
    await storeConfiguracion.guardarGenerales(configuracionGeneral.value)
  }
  catch (error) {
    manejaError(error)
  }
}

const onSubmit = (): void => {
  formOpcion.value?.validate().then(({ valid }) => {
    if (valid)
      guardarConfiguraciones()
  })
}

onMounted(() => {
  configuracionGeneral.value = storeConfiguracion.configuracionesGenerales
})
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-3">
    <h1>Configuraciones Generales</h1>
  </div>
  <VCard>
    <VCardText>

      <VForm
        ref="formOpcion"
        @submit.prevent="onSubmit"
      >
        <VCol
          class="d-flex flex-wrap"
          cols="12"
        >
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              :id="useId()"
              v-model="configuracionGeneral.nombre_aplicacion"
              placeholder="Ingrese Nombre de la Aplicación"
              label="Título"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              :id="useId()"
              v-model="configuracionGeneral.email_aplicacion"
              placeholder="Ingrese Email de la Aplicación"
              label="Email"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              :id="useId()"
              v-model="configuracionGeneral.telefono_aplicacion"
              placeholder="Ingrese Telefono de la Aplicación"
              label="Teléfono"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              :id="useId()"
              v-model="configuracionGeneral.eslogan_aplicacion"
              placeholder="Ingrese Eslogan de la Aplicación"
              label="Eslogan"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VLabel class="mb-3">
              Fondo Login Claro:
            </VLabel>
            <FileInput
              v-model:archivos="configuracionGeneral.fondo_login_tema_claro"
              :multiple="false"
              name="fondoClaro"
              :previsualizar-archivos="[storeConfiguracion.configuracionesGenerales.fondo_login_tema_claro]"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VLabel class="mb-3">
              Fondo Login Oscuro:
            </VLabel>
            <FileInput
              v-model:archivos="configuracionGeneral.fondo_login_tema_oscuro"
              :multiple="false"
              name="fondoClaro"
              :previsualizar-archivos="[storeConfiguracion.configuracionesGenerales.fondo_login_tema_oscuro]"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VLabel class="mb-3">
              Logo:
            </VLabel>
            <FileInput
              v-model:archivos="configuracionGeneral.logo"
              :multiple="false"
              name="fondoClaro"
              :previsualizar-archivos="[storeConfiguracion.configuracionesGenerales.logo]"
            />
          </VCol>

          <VCol
            class="text-end"
            cols="12"
          >
            <VBtn
              class="mr-2"
              color="secondary"
              type="reset"
              variant="tonal"
              @click="formOpcion?.value?.reset()"
            >
              <VIcon class="mr-2 ri-filter-off-fill" />
              Limpiar
            </VBtn>
            <VBtn
              v-if="can('Actualizar Configuraciones generales', 'Configuracion')"
              type="submit"
            >
              <VIcon class="mr-2 ri-save-3-fill" />
              Guardar
            </VBtn>
          </VCol>
        </VCol>
      </VForm>
    </VCardText>
  </VCard>
</template>
