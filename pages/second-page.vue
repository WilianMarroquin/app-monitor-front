<script setup lang="ts">
const { can } = useAbility()

import type { UsuarioInterface } from '@/types/admin/modulo-usuarios/types'

const usuarioAutenticado = useSanctumUser<UsuarioInterface>()

// console.log('usuarioAutenticado', usuarioAutenticado.value)
//
// console.log('can', can('Ver modulo usuarios', 'User'))

</script>

<template>

  <VBtn
    v-if="can('Ver modulo usuarios', 'User')"
    class="ml-auto"
    color="success"
    to="/admin/modulo-usuarios/permisos/create"
  >
    Prueba

  </VBtn>


</template>
