<script lang="ts" setup>
import type { ConfiguracionInterface } from '@/types/admin/configuraciones/types'
import type { SendResponseIndexInterface, SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'
import type { VForm } from 'vuetify/components/VForm'

const { post, get } = useClienteRequest()
const { success } = useToast()

const formOpcion = ref<InstanceType<typeof VForm>>()

const nombreAplicacion = ref<ConfiguracionInterface>({
  key: 'Nombre Aplicacion',
  value: '',
  descripcion: 'Es el nombre de la aplicación',
})

const emailAplicacion = ref<ConfiguracionInterface>({
  key: 'Email Aplicacion',
  value: '',
  descripcion: 'Es el email de la aplicación',
})

const telefonoAplicacion = ref<ConfiguracionInterface>({
  key: 'Telefono Aplicacion',
  value: '',
  descripcion: 'Es el telefono de la aplicación',
})

const guardarConfiguraciones = async (): Promise<void> => {
  try {
    const configuraciones = [
      nombreAplicacion.value,
      emailAplicacion.value,
      telefonoAplicacion.value,
    ]

    const res: SendResponseInterface<ConfiguracionInterface> = await post('api/admin/configuraciones/generales/guardar', configuraciones)

    success(res.message)
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

const getConfiguraciones = async (): Promise<void> => {
  try {
    const res: SendResponseIndexInterface<ConfiguracionInterface[]> = await get('api/admin/configuraciones/generales', {
      'filter[key]': 'Nombre,Email,Telefono',
    })

    if (res.data?.data) {
      nombreAplicacion.value = res.data.data.find((item: ConfiguracionInterface) => item.key === 'Nombre Aplicacion') ?? nombreAplicacion.value
      emailAplicacion.value = res.data.data.find((item: ConfiguracionInterface) => item.key === 'Email Aplicacion') ?? emailAplicacion.value
      telefonoAplicacion.value = res.data.data.find((item: ConfiguracionInterface) => item.key === 'Telefono Aplicacion') ?? telefonoAplicacion.value
    }
  }
  catch (error) {
    manejaError(error)
  }
}

onMounted(() => {
  getConfiguraciones()
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
              v-model="nombreAplicacion.value"
              placeholder="Ingrese Nombre de la Aplicación"
              required
              :rules="[requiredValidator]"
              label="Título"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              :id="useId()"
              v-model="emailAplicacion.value"
              placeholder="Ingrese Email de la Aplicación"
              required
              :rules="[requiredValidator]"
              label="Email"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              :id="useId()"
              v-model="telefonoAplicacion.value"
              placeholder="Ingrese Telefono de la Aplicación"
              required
              :rules="[requiredValidator]"
              label="Teléfono"
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
