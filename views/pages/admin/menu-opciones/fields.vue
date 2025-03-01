<script lang="ts" setup>
// Importaciones necesarias
import type {VForm} from "vuetify/components/VForm";
import type {MenuOpcion} from "@/types/admin/menu-opciones/types";
import type {Permission} from "@/types/admin/permisos/types";
import {ref, watch} from "vue";
import {useRouter} from "vue-router";

const props = defineProps<{
  parentId: string | null;
  item: MenuOpcion | null;
  mostrarTituloSeccion: boolean;
  permisos: Permission | null;
}>();

const emit = defineEmits<{
  (event: "datos", value: MenuOpcion): void;
}>();

const esTituloSeccion = ref(false);

const formOpcion = ref<InstanceType<typeof VForm>>();
const formTituloSeccion = ref<InstanceType<typeof VForm>>();

const opcion = ref<MenuOpcion>({
  titulo: null,
  icono: null,
  ruta: null,
  titulo_seccion: null,
  parent_id: props.parentId ?? null,
  action: null,
  subject: null,
});

opcion.value = props.item ?? {
  titulo: null,
  icono: null,
  ruta: null,
  titulo_seccion: null,
  parent_id: props.parentId ?? null,
  action: null,
  subject: null,
};

if (opcion.value.titulo_seccion) {

  esTituloSeccion.value = true;

}

const router = useRouter();
const rutasSistema = router.getRoutes();

const RutasFiltradas = rutasSistema.filter(ruta => {
  return !ruta.path.includes(":");
});

const permisoSeleccionado = ref<string | null>(null);

const permisoActualSeleccionado = props.permisos?.find(permiso => permiso.name === props.item.action && permiso.subject === props.item.subject) ?? null;

if (permisoActualSeleccionado !== null) {

  permisoSeleccionado.value = permisoActualSeleccionado?.name + " - " + permisoActualSeleccionado?.subject;

}

const onSubmitFormOpcion = (): void => {

  formOpcion.value?.validate().then(({valid}) => {
    if (valid) {
      emit("datos", opcion.value);
    }
  });

};

const onSubmitFormTituloSeccion = (): void => {
  formTituloSeccion.value?.validate().then(({valid}) => {
    if (valid) {
      emit("datos", opcion.value);
    }
  });
};

watch(esTituloSeccion, (newVal) => {
  if (newVal) {
    opcion.value = {
      titulo_seccion: opcion.value.titulo_seccion,
      action: opcion.value.action,
      subject: opcion.value.subject,
      parent_id: props.parentId ?? null,
    };
  } else {
    opcion.value = {
      titulo: opcion.value.titulo,
      icono: opcion.value.icono,
      ruta: opcion.value.ruta,
      action: opcion.value.action,
      subject: opcion.value.subject,
      parent_id: props.parentId ?? null,
    };
  }
});

watch(permisoSeleccionado, (id) => {

  if (id) {
    let permiso = props.permisos?.find(permiso => permiso.id === id);
    opcion.value = {
      ...opcion.value,
      action: permiso?.name,
      subject: permiso?.subject,
    };
  }

});


</script>

<template>

  <VCol v-if="props.mostrarTituloSeccion"
        class="d-flex flex-wrap" cols="12">
    <p class="text-h6 mt-3 ml-2 mr-2">¿Es un título de sección?</p>
    <VSwitch v-model="esTituloSeccion"/>
  </VCol>

  <VForm v-if="!esTituloSeccion"
         ref="formOpcion"
         @submit.prevent="onSubmitFormOpcion"
  >
    <VCol class="d-flex flex-wrap" cols="12">
      <VCol cols="12" md="6">
        <AppTextField v-model="opcion.titulo" :rules="[requiredValidator]" label="Título"/>
      </VCol>

      <VCol cols="12" md="6">
        <AppAutocomplete
          v-model="opcion.ruta"
          :items="RutasFiltradas"
          item-title="name"
          item-value="name"
          label="Ruta"
          placeholder="Seleccione una ruta"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VLabel
          class="mb-1 text-body-2 text-wrap"
          style="line-height: 15px;"
        >Icono:
          <NuxtLink class="ml-2" target="_blank" to="https://tablericons.com/">Ver iconos</NuxtLink>
        </VLabel>
        <AppTextField v-model="opcion.icono"/>
      </VCol>

      <VCol cols="12" md="6">
        <AppAutocomplete
          v-model="permisoSeleccionado"
          :items="props.permisos"
          :rules="[requiredValidator]"
          item-title="name_y_subject"
          item-value="id"
          label="Permiso:"
          placeholder="Seleccione un permiso"
        />
      </VCol>

      <VCol class="d-flex gap-4" cols="12">
        <VBtn type="submit">Guardar</VBtn>
        <VBtn color="secondary" type="reset" variant="tonal">Limpiar</VBtn>
      </VCol>
    </VCol>
  </VForm>

  <VForm v-else
         ref="formTituloSeccion"
         @submit.prevent="onSubmitFormTituloSeccion"
  >
    <VCol class="d-flex flex-wrap" cols="12">
      <VCol cols="12" md="6">
        <AppTextField
          v-model="opcion.titulo_seccion"
          :rules="[requiredValidator]"
          label="Título Sección"
        />
      </VCol>

      <VCol cols="12" md="6">
        <AppAutocomplete
          v-model="permisoSeleccionado"
          :items="props.permisos"
          :rules="[requiredValidator]"
          item-title="name_y_subject"
          item-value="id"
          label="Permiso:"
          placeholder="Seleccione un permiso"
        />
      </VCol>
    </VCol>

    <VCol class="d-flex gap-4" cols="12">
      <VBtn type="submit">Guardar</VBtn>
      <VBtn color="secondary" type="reset" variant="tonal">Limpiar</VBtn>
    </VCol>
  </VForm>

</template>
