<script setup lang="ts">
import { ref } from "vue";
import type { VForm } from "vuetify/lib/components/VForm";
// Asegúrate de que tu ServiceInterface soporte 'service_web' y 'service_database'
import type { ServiceInterface } from '@/types/services/types.ts';

const isFormValid = ref(false)
const refForm = ref<VForm>()

// === ESTRUCTURA DE DATOS POLIMÓRFICA ===
const data = ref<any>({
  name: null,
  description: null,
  type: null,
  is_active: true, // Mejor que sea true por defecto
  testMethod: 'ping', // Un valor por defecto lógico
  httpMethod: 'GET',  // Valor por defecto para webs

  // Sub-estructura para Webs
  service_web: {
    url: null,
    server_id: null
  },

  // Sub-estructura para Bases de Datos
  service_database: {
    db_type: null,
    host_ip: null,
    port: null,
    username: null,
    password: null
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

const emit = defineEmits<Emit>()

// === MODO EDICIÓN ===
if (props.item) {
  data.value.service_web.server_id = 1
  data.value = {
    ...props.item,
    service_web: props.item.detalle_web || { url: null, server_id: null },
    service_database: props.item.detalle_data_base || { db_type: null, host_ip: null, port: null, username: null, password: null }
  }
}

// === VISIBILIDAD DE CONTRASEÑA ===
const isPasswordVisible = ref(false)

const onSubmit = () => {
  refForm.value?.validate().then(({valid}) => {
    if (valid) {

      // Limpieza antes de enviar (Opcional pero muy Senior)
      // Si el tipo es web, borramos la data de DB para no mandar basura al API, y viceversa.
      const payload = JSON.parse(JSON.stringify(data.value));
      if (payload.type === 'web') {
        delete payload.service_database;
      } else if (payload.type === 'database') {
        delete payload.service_web;
        payload.httpMethod = null; // Las BD no usan httpMethod
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
    <h3 class="text-h6 mb-3">Datos Generales</h3>
    <VRow>
      <VCol cols="12" md="6">
        <VTextField
          v-model="data.name"
          :rules="[requiredValidator]"
          label="Nombre del Servicio"
          placeholder="Ej: Portal Mineduc"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="data.description"
          :rules="[requiredValidator]"
          label="Descripción"
          placeholder="¿Qué hace este servicio?"
        />
      </VCol>

      <VCol cols="12" md="6">
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
        <VTextField
          v-model="data.testMethod"
          :rules="[requiredValidator]"
          label="Método de Prueba"
          placeholder="Ej: ping, tcp, http"
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
    </VRow>

    <VDivider class="my-6" />

    <template v-if="data.type === 'web'">
      <h3 class="text-h6 mb-3 text-primary">Configuración Web</h3>
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

        <VCol cols="12" md="3">
          <SelectorPro
            v-model:item-selected="data.service_web.server_id"
            item-title="name"
            item-value="id"
            label="Servidor de Alojamiento"
            url="api/servers"
            :campos-a-filtrar="['name']"
          />
        </VCol>
      </VRow>
    </template>

    <template v-if="data.type === 'database'">
      <h3 class="text-h6 mb-3 text-info">Configuración de Base de Datos</h3>
      <VRow>
        <VCol cols="12" md="3">
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

        <VCol cols="12" md="3">
          <VTextField
            v-model="data.service_database.port"
            :rules="[requiredValidator]"
            label="Puerto"
            type="number"
            placeholder="Ej: 1433"
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
