<script lang="ts" setup>
import type { MenuOpcionInterface } from '@/types/admin/configuraciones/types'
import type { PermisoInterface } from '@/types/admin/modulo-usuarios/types'
import { useRouter } from 'vue-router'
import type { VForm } from 'vuetify/components/VForm'

const props = defineProps<{
  parentId: number | null
  item: MenuOpcionInterface | null
  mostrarTituloSeccion: boolean
  permisos: PermisoInterface[] | null
}>()

const emit = defineEmits<{
  (event: 'datos', value: MenuOpcionInterface): void
}>()

const esTituloSeccion = ref(false)
const formOpcion = ref<InstanceType<typeof VForm>>()
const formTituloSeccion = ref<InstanceType<typeof VForm>>()
const router = useRouter()
const rutasSistema = router.getRoutes()
const permisoSeleccionado = ref<string | null>(null)

const opcion = ref<MenuOpcionInterface>({
  titulo: null,
  icono: null,
  ruta: null,
  titulo_seccion: null,
  parent_id: props.parentId ?? null,
  action: null,
  subject: null,
})

opcion.value = props.item ?? {
  titulo: null,
  icono: null,
  ruta: null,
  titulo_seccion: null,
  parent_id: props.parentId ?? null,
  action: null,
  subject: null,
}

if (opcion.value.titulo_seccion)
  esTituloSeccion.value = true

const RutasFiltradas = rutasSistema.filter(ruta => {
  return !ruta.path.includes(':')
})

const permisoActualSeleccionado = props.item ? props.permisos?.find(permiso => permiso.name === props.item?.action && permiso.subject === props.item?.subject) ?? null : null

if (permisoActualSeleccionado !== null)
  permisoSeleccionado.value = `${permisoActualSeleccionado?.name} - ${permisoActualSeleccionado?.subject}`

const onSubmitFormOpcion = (): void => {
  formOpcion.value?.validate().then(({ valid }) => {
    if (valid)
      emit('datos', opcion.value)
  })
}

const onSubmitFormTituloSeccion = (): void => {
  formTituloSeccion.value?.validate().then(({ valid }) => {
    if (valid)
      emit('datos', opcion.value)
  })
}

watch(esTituloSeccion, newVal => {
  if (newVal) {
    opcion.value = {
      titulo_seccion: opcion.value.titulo_seccion,
      action: opcion.value.action,
      subject: opcion.value.subject,
      parent_id: props.parentId ?? null,
      icono: null,
      ruta: null,
      titulo: null,
    }
  }
  else {
    opcion.value = {
      titulo: opcion.value.titulo,
      icono: opcion.value.icono,
      ruta: opcion.value.ruta,
      action: opcion.value.action,
      subject: opcion.value.subject,
      parent_id: props.parentId ?? null,
      titulo_seccion: null,
    }
  }
})

watch(permisoSeleccionado, id => {
  if (!id)
    return
  const permisoEncontrado = props.permisos?.find(p => p.id === Number(id))
  if (permisoEncontrado) {
    opcion.value = {
      ...opcion.value,
      action: permisoEncontrado?.name ?? null,
      subject: permisoEncontrado?.subject ?? null,
    }
  }
})
</script>

<template>
  <VCol
    v-if="props.mostrarTituloSeccion"
    class="d-flex flex-wrap"
    cols="12"
  >
    <p class="text-h6 mt-3 ml-2 mr-2">
      ¿Es un título de sección?
    </p>
    <VSwitch v-model="esTituloSeccion" />
  </VCol>

  <VForm
    v-if="!esTituloSeccion"
    ref="formOpcion"
    @submit.prevent="onSubmitFormOpcion"
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
          v-model="opcion.titulo"
          placeholder="Ingrese Icono"
          required
          :rules="[requiredValidator]"
          label="Título"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VAutocomplete
          v-model="opcion.ruta"
          label="Ruta:"
          :items="RutasFiltradas"
          placeholder="Seleccione una ruta"
          item-title="name"
          item-value="id"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          :id="useId()"
          v-model="opcion.icono"
          label="Icono"
          placeholder="Ingrese Icono"
          required
        />
        <NuxtLink
          class="ms-auto text-blue"
          target="_blank"

          to="https://remixicon.com/"
        >
          Ver iconos
        </NuxtLink>
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VAutocomplete
          v-model="permisoSeleccionado"
          :items="props.permisos ?? []"
          label="Permiso"
          placeholder="Seleccione el Permiso"
          item-title="name_y_subject"
          item-value="id"
        />
      </VCol>

      <VCol
        class="text-end"
        cols="12"
      >
        <VBtn
          color="secondary"
          type="reset"
          variant="outlined"
          class="mr-1"
          @click="formOpcion?.value?.reset()"
        >
          <VIcon class="mr-2 ri-filter-off-fill"/>
          Limpiar Campos
        </VBtn>
        <VBtn type="submit">
          <VIcon class="mr-2 ri-save-3-fill"/>
          Guardar
        </VBtn>
      </VCol>
    </VCol>
  </VForm>

  <VForm
    v-else
    ref="formTituloSeccion"
    @submit.prevent="onSubmitFormTituloSeccion"
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
          v-model="opcion.titulo_seccion"
          :rules="[requiredValidator]"
          label="Título Sección"
          placeholder="Ingrese titulo de sección"
          required
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VAutocomplete
          v-model="permisoSeleccionado"
          label="Permiso:"
          :items="props.permisos ?? []"
          placeholder="Select State"
          item-title="name"
          item-value="id"
        />
      </VCol>
    </VCol>

    <VCol
      class="text-end"
      cols="12"
    >
      <VBtn
        color="secondary"
        type="reset"
        variant="tonal"
        @click="formTituloSeccion?.value?.reset()"
      >
        <VIcon class="mr-2 ri-filter-off-fill"/>
        Limpiar
      </VBtn>
      <VBtn type="submit">
        <VIcon class="mr-2 ri-save-3-fill"/>
        Guardar
      </VBtn>
    </VCol>
  </VForm>
</template>
