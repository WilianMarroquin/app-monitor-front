<script setup lang="ts">
import type { PermisoInterface } from '@/types/admin/modulo-usuarios/types'
import { manejaError } from '@/utils/funcionesComunes'

const { get } = useClienteRequest()
const { paginaEspera } = useCargandoPagina()

const permisosDiponibles = ref<PermisoInterface[]>([])
const permisosActualesDeRol = ref<PermisoInterface[]>([])

const getPermisosDisponibles = async () => {
  paginaEspera.value = true
  try {
    const respuesta: { data: PermisoInterface } = await get('api/admin/modulo-usuarios/permissions/all')
    permisosDiponibles.value = respuesta.data
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

getPermisosDisponibles()

const getPermisosActualesDeRol = async (id: number) => {
  paginaEspera.value = true
  try {
    const respuesta: { data: PermisoInterface } = await get(`api/admin/modulo-usuarios/roles/obtener/permisos/asignados/${id}`)
    permisosActualesDeRol.value = respuesta.data
  }
  catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  }
  finally {
    paginaEspera.value = false
  }
}

getPermisosActualesDeRol(1)

const actualizarPermisoSeleccionados = (permisos: PermisoInterface[]) => {
  console.log(permisos)
}
</script>

<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="primary" icon>
        <v-icon>mdi-information</v-icon>
      </v-btn>
    </template>
    <span>Información importante</span>
  </v-tooltip>

  <v-btn color="primary" icon v-tooltip="'Información importante'">
    <v-icon>mdi-information</v-icon>
  </v-btn>
</template>
