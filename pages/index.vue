<script lang="ts" setup>
import type { UsuarioInterface } from '@/types/admin/modulo-usuarios/types'

const usuarioAutenticado = useSanctumUser<UsuarioInterface>()
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-3">
    <h2>Bienvenido, {{ usuarioAutenticado?.primer_nombre }} {{ usuarioAutenticado?.primer_apellido }}</h2>
  </div>
</template>

