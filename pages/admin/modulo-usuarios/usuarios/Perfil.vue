<script setup lang="ts">
import type { UsuarioInterface } from '@/types/admin/modulo-usuarios/types'

const usuarioAutenticado = useSanctumUser<UsuarioInterface>()
</script>

<template>
  <PerfilUsuario
    v-if="usuarioAutenticado?.id"
    :id="usuarioAutenticado?.id"
  />
</template>
