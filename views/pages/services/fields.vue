<script setup lang="ts">
import { ref } from "vue";
import type { VForm } from "vuetify/lib/components/VForm";

const isFormValid = ref(false)
const refForm = ref<VForm>()

// === ESTRUCTURA DE DATOS POLIMÓRFICA ===
const data = ref<any>({
  name: null,
  description: null,
  type: null,
  is_active: true,
  testMethod: null,
  httpMethod: 'GET',
  tiempo_espera: 60,
  port: null,
  entorno: null,
  server_id: null,

  // 👇 NUEVO: Arreglo para almacenar múltiples IDs de áreas
  area_ids: [],

  service_web: {
    url: null,

  },

  service_database: {
    db_type: null,
    host_ip: null,
    port: null,
    username: null,
    password: null,
    name: null,
  }
})

// === CATÁLOGOS PARA SELECTORES ===
const tiposServicio = [
  { title: 'Sitio Web / API', value: 'web' },
  { title: 'Base de Datos', value: 'database' }
]
const metodosHttp = ['GET', 'POST', 'PUT', 'HEAD']
const tiposBd = ['MySQL', 'SQLServer', 'Oracle', 'PostgreSQL']

interface Emit {
  (e: 'emitirDatos', value: any ): void
}

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})
const entornos = ['Desarrollo', 'Produccion']

const tiposDePrueba = computed(() => {
  if (data.value.type === 'web') {
    return ['HTTP']
  } else if (data.value.type === 'database') {
    return ['CONNECTION', 'QUERY']
  }
  return []
})
const emit = defineEmits<Emit>()

// === MODO EDICIÓN ===
if (props.item) {
  data.value = {
    ...props.item,
    // 👇 NUEVO: Si el backend manda las áreas completas, extraemos solo los IDs para el selector
    area_ids: props.item.areas?.map((area: any) => area.id) || [],
    service_web: props.item.detalle_web || { url: null, server_id: null },
    service_database: props.item.detalle_data_base || { db_type: null, host_ip: null, port: null, username: null, password: null }
  }
}

// === VISIBILIDAD DE CONTRASEÑA ===
const isPasswordVisible = ref(false)

const onSubmit = () => {
  refForm.value?.validate().then(({valid}) => {
    if (valid) {
      const payload = JSON.parse(JSON.stringify(data.value));

      // Limpieza antes de enviar (Payload Shaping)
      if (payload.type === 'web') {
        delete payload.service_database;
      } else if (payload.type === 'database') {
        delete payload.service_web;
        payload.httpMethod = null;
      }

      emit('emitirDatos', payload)
    }
  })
}
</script>

<template>
  <VForm
    ref="refForm"
    v-model="isFormValid"
    @submit.prevent="onSubmit"
  >
    <h3 class="text-h6 mb-3 d-flex align-center text-success">
      <VIcon
        icon="ri-service-line"
        class="mr-2"
      />
      Datos Genrales
    </h3>
    <VRow>
      <VCol cols="12" md="6">
        <VTextField
          v-model="data.name"
          :rules="[requiredValidator]"
          label="Nombre del Servicio"
          placeholder="Ej: Portal Mineduc"
        />
      </VCol>

      <VCol cols="12" md="3">
        <VSelect
          v-model="data.type"
          :items="tiposServicio"
          item-title="title"
          item-value="value"
          :rules="[requiredValidator]"
          label="Tipo de Servicio"
          placeholder="Seleccione el tipo"
        />
      </VCol>

      <VCol cols="12" md="3">
       <VSelect
          v-model="data.testMethod"
          :items="tiposDePrueba"
          :rules="[requiredValidator]"
          label="Método de Prueba"
          placeholder="Seleccione el método"
        />
      </VCol>
      <VCol cols="12" md="4" class="d-flex align-center">
        <VTextField
          v-model="data.tiempo_espera"
          label="Tiempo de Espera (segundos)"
          placeholder="Ej: 60"
          type="number"
        />
      </VCol>
      <VCol cols="12" md="4" class="d-flex align-center">
        <VTextField
          v-model="data.port"
          label="Puerto (si aplica)"
          placeholder="Ej: 80, 443, 1433"
        />
      </VCol>

      <VCol cols="12" md="3" class="d-flex align-center">
        <VSwitch
          v-model="data.is_active"
          color="success"
          :label="data.is_active ? 'Servicio Activo' : 'Servicio Inactivo'"
          inset
        />
      </VCol>


      <VCol cols="12" md="6">
        <VSelect
          v-model="data.entorno"
          :items="entornos"
          :rules="[requiredValidator]"
          label="Entorno"
          placeholder="Seleccione el entorno"
        />
      </VCol>

      <VCol cols="12" md="6">
        <SelectorPro
          v-model:item-selected="data.server_id"
          item-title="name"
          item-value="id"
          label="Servidor de Alojamiento"
          url="api/servers"
          :campos-a-filtrar="['name']"
        />
      </VCol>

      <VCol cols="12" md="121.1.1.1">
        <VTextarea
          v-model="data.description"
          label="Descripción"
          placeholder="¿Qué hace este servicio?"
        />
      </VCol>
    </VRow>

    <VDivider class="my-6" />
    <h3 class="text-h6 mb-3 d-flex align-center text-warning">
      <VIcon icon="ri-notification-3-line" class="mr-2" />
      Enrutamiento de Alertas
    </h3>
    <p class="text-caption text-medium-emphasis mb-3">
      Seleccione las áreas responsables. Los contactos asociados a estas áreas recibirán notificaciones si este servicio presenta interrupciones.
    </p>
    <VRow>
      <VCol cols="12">
        <SelectorPro
          v-model:item-selected="data.area_ids"
          multiple
          chips
          clearable
          item-title="name"
          item-value="id"
          label="Áreas a notificar"
          url="api/areas"
          :campos-a-filtrar="['name']"
        />
      </VCol>
    </VRow>

    <VDivider class="my-6" />

    <template v-if="data.type === 'web'">
      <h3 class="text-h6 mb-3 text-primary">
        <VIcon icon="ri-global-line" class="mr-2" />
        Configuración Web
      </h3>
      <VRow>
        <VCol cols="12" md="6">
          <VTextField
            v-model="data.service_web.url"
            :rules="[requiredValidator]"
            label="URL del Sitio"
            placeholder="https://ejemplo.edu.gt"
            prepend-inner-icon="ri-link"
          />
        </VCol>

        <VCol cols="12" md="3">
          <VSelect
            v-model="data.httpMethod"
            :items="metodosHttp"
            :rules="[requiredValidator]"
            label="Método HTTP"
          />
        </VCol>
      </VRow>
    </template>

    <template v-if="data.type === 'database'">
      <h3 class="text-h6 mb-3 text-info">
        <VIcon icon="ri-database-2-line" class="mr-2" />
        Configuración de Base de Datos
      </h3>
      <VRow>
        <VCol cols="12" md="6">
          <VSelect
            v-model="data.service_database.db_type"
            :items="tiposBd"
            :rules="[requiredValidator]"
            label="Motor de BD"
            placeholder="Ej: SQLServer"
          />
        </VCol>

        <VCol cols="12" md="6">
          <VTextField
            v-model="data.service_database.host_ip"
            :rules="[requiredValidator]"
            label="Host / IP"
            placeholder="Ej: 192.168.1.100"
            prepend-inner-icon="ri-server-line"
          />
        </VCol>


        <VCol cols="12" md="6">
          <VTextField
            v-model="data.service_database.name"
            :rules="[requiredValidator]"
            label="Nombre de la Base de Datos"
            placeholder="Ej: inventarios, recursos_humanos"
            prepend-inner-icon="ri-database-2-line"
          />
        </VCol>

        <VCol cols="12" md="6">
          <VTextField
            v-model="data.service_database.username"
            :rules="[requiredValidator]"
            label="Usuario"
            placeholder="Usuario con permisos de lectura"
            prepend-inner-icon="ri-user-3-line"
          />
        </VCol>

        <VCol cols="12" md="6">
          <VTextField
            v-model="data.service_database.password"
            :rules="[requiredValidator]"
            label="Contraseña"
            :type="isPasswordVisible ? 'text' : 'password'"
            :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible"
            placeholder="Contraseña del usuario"
          />
        </VCol>
      </VRow>
    </template>

    <VRow class="mt-4">
      <VCol cols="12">
        <VBtn
          type="submit"
          class="me-3"
          color="primary"
        >
          <VIcon class="mr-2 ri-save-3-fill"/>
          Guardar Servicio
        </VBtn>

        <VBtn
          type="reset"
          variant="tonal"
          color="error"
          to="/services"
        >
          <VIcon class="mr-2 ri-contract-left-fill"/>
          Cancelar
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<style scoped lang="scss">
</style>
