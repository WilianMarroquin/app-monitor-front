<script setup lang="ts">
import type { UsuarioInterface } from '@/types/admin/modulo-usuarios/types'

const usuarioAutenticado = useSanctumUser<UsuarioInterface>()
</script>

<template>
  <Perfil
    v-if="usuarioAutenticado?.id"
    :id="usuarioAutenticado?.id"
  />
</template>
