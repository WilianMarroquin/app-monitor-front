<script setup lang="ts">
import type { PermisoInterface, RolInterface } from '@/types/admin/modulo-usuarios/types'
import type { VForm } from 'vuetify/lib/components/VForm'

interface Emit {
  (e: 'emitirDatos', value: RolInterface): void
  (e: 'update:permisosSeleccionados', value: PermisoInterface[]): void
}

const isFormValid = ref(false)
const refForm = ref<VForm>()
const emit = defineEmits<Emit>()

const props = defineProps({
  item: {
    type: Object,
    default: null,
  },
  permisosDisponibles: {
    type: Array as PropType<PermisoInterface[]>,
    default: () => [],
  },
  permisosSeleccionados: {
    type: Array as PropType<PermisoInterface[]>,
    default: () => [],
  },
})

const data = ref<RolInterface>({
  name: null,
})

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('emitirDatos', data.value)
    }
  })
}

const selectedPermissions = ref<PermisoInterface[]>([...props.permisosSeleccionados]); // Clonar array

watch(() => props.permisosSeleccionados, (newValue) => {
  selectedPermissions.value = [...newValue]
})

const agregarPermiso = (permiso: PermisoInterface): void => {
  if (!selectedPermissions.value.some(p => p.id === permiso.id)) {
    selectedPermissions.value.push(permiso)
    emit('update:permisosSeleccionados', [...selectedPermissions.value]); // Emitir copia del array
  }
}

const quitarPermiso = (permiso: PermisoInterface): void => {
  selectedPermissions.value = selectedPermissions.value.filter(p => p.id !== permiso.id);
  emit('update:permisosSeleccionados', [...selectedPermissions.value]); // Emitir copia del array
}

watch(() => props.item, (newValue) => {
  if (newValue) {
    data.value = { ...newValue } // Clonar para evitar modificar `props`
  }
}, { immediate: true }) // Se ejecuta al montar el componente

</script>

<template>

  <VForm
    ref="refForm"
    v-model="isFormValid"
    @submit.prevent="onSubmit"
  >
    <VRow>

      <VCol cols="12" md="6">
        <VTextField
          :id="useId()"
          v-model="data.name"
          :rules="[requiredValidator]"
          label="Nombre"
          placeholder="Ingrese Nombre"
          required
        />
      </VCol>

      <ListasSeleccionables
        :ItemsDisponibles="props.permisosDisponibles"
        :ItemsSeleccionadas="props.permisosSeleccionados"
        tipo="Permisos"
        @itemAgregada="agregarPermiso"
        @itemQuitada="quitarPermiso"
      />

<!--      <VCol cols="12" md="6">-->
<!--        <VTextField-->
<!--          :id="useId()"-->
<!--          v-model="data.guard_name"-->
<!--          :rules="[requiredValidator]"-->
<!--          label="Guard Name"-->
<!--          placeholder="Ingrese Guard Name"-->
<!--          required-->
<!--        />-->
<!--      </VCol>-->

      <VCol cols="12" class="text-end">
        <VBtn
          type="reset"
          variant="outlined"
          color="secondary"
          class="mr-1"
          @click="refForm.value?.reset()"
        >
          <VIcon class="mr-2 ri-contract-left-fill"/>
          Limpiar Campos
        </VBtn>
        <VBtn
          type="submit"
          class="me-3"
        >
          <VIcon class="mr-2 ri-save-3-fill"/>
          Guardar
        </VBtn>
      </VCol>
    </VRow>

  </VForm>

</template>

<style scoped lang="scss">

</style>
