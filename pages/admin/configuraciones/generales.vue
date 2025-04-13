<script lang="ts" setup>
import { useConfiguracionStore } from '@/stores/admin/useConfiguracionStore'
import type { ConfiguracionGeneralInterface } from '@/types/admin/configuraciones/types'
import { manejaError } from '@/utils/funcionesComunes'
import type { VForm } from 'vuetify/components/VForm'

const store = useConfiguracionStore()
const formOpcion = ref<InstanceType<typeof VForm>>()
const configuracionGeneral: ConfiguracionGeneralInterface = ref({
  nombre_aplicacion: '',
  email_aplicacion: '',
  telefono_aplicacion: '',
  eslogan_aplicacion: '',
  fondoLoginOscuro: null,
  fondoLoginClaro: null,
})

const guardarConfiguraciones = async (): Promise<void> => {
  try {
    await store.guardarGenerales(configuracionGeneral.value)
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
            <VLabel class="mb-3">Fondo Login Claro:</VLabel>
            <FileInput
              v-model:archivos="configuracionGeneral.fondoLoginClaro"
              :multiple="false"
              name="fondoClaro"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VLabel class="mb-3">Fondo Login Oscuro:</VLabel>
            <FileInput
              v-model:archivos="configuracionGeneral.fondoLoginOscuro"
              :multiple="false"
              name="fondoClaro"
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
            <VBtn type="submit">
              <VIcon class="mr-2 ri-save-3-fill" />
              Guardar
            </VBtn>
          </VCol>
        </VCol>
      </VForm>
    </VCardText>
  </VCard>
</template>
