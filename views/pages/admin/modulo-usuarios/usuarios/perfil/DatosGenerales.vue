<script setup lang="ts">
import type { UsuarioInterface } from '@/types/admin/modulo-usuarios/types'

interface Props {
  userData: UsuarioInterface
}

const props = defineProps<Props>()

const usuario = ref<UsuarioInterface>(props.userData ?? null)

const isUserInfoEditDialogVisible = ref(false)
</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="usuario">
        <VCardText class="text-center pt-12 pb-6">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded="lg"
            :size="120"
            :color="!usuario.avatar ? 'primary' : undefined"
            :variant="!usuario.avatar ? 'tonal' : undefined"
          >
            <VImg
              v-if="usuario.avatar"
              :src="usuario.avatar"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(usuario.nombre_completo) }}
            </span>
          </VAvatar>

          <!-- 👉 User fullName -->
          <h5 class="text-h5 mt-4">
            {{ usuario.nombre_completo }}
          </h5>

          <!-- 👉 Role chip -->
          <VChip
            v-for="rol in usuario.roles"
            size="small"
            class="text-capitalize mt-4"
          >
            {{ rol.name }}
          </VChip>
        </VCardText>

        <VCardText class="d-flex justify-center flex-wrap gap-6 pb-6">
          <!-- 👉 Done task -->
          <div class="d-flex align-center me-8">
            <VAvatar
              :size="40"
              rounded
              color="primary"
              variant="tonal"
              class="me-4"
            >
              <VIcon
                size="24"
                icon="ri-check-line"
              />
            </VAvatar>

            <div>
              <h5 class="text-h5">
<!--                {{ kFormatter(usuario.taskDone) }}-->
              </h5>
              <span>Task Done</span>
            </div>
          </div>

          <!-- 👉 Done Project -->
          <div class="d-flex align-center me-4">
            <VAvatar
              :size="44"
              rounded
              color="primary"
              variant="tonal"
              class="me-4"
            >
              <VIcon
                size="24"
                icon="ri-briefcase-line"
              />
            </VAvatar>

            <div>
              <h5 class="text-h5">
<!--                {{ kFormatter(props.userData.projectDone) }}-->
              </h5>
              <span>Project Done</span>
            </div>
          </div>
        </VCardText>

        <!-- 👉 Details -->
        <VCardText class="pb-6">
          <h5 class="text-h5">
            Details
          </h5>

          <VDivider class="my-4" />

          <!-- 👉 User Details list -->
          <VList class="card-list">
            <VListItem>
              <VListItemTitle class="text-sm">
                <span class="font-weight-medium">Username:</span>
                <span class="text-body-1">
                  @{{ usuario.usuario }}
                </span>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle class="text-sm">
                <span class="font-weight-medium">
                  Billing Email:
                </span>
                <span class="text-body-1">{{ usuario.email }}</span>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle class="text-sm">
                <span class="font-weight-medium">
                  Status:
                </span>
                <span class="text-body-1 text-capitalize">{{ usuario.estado }}</span>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle class="text-sm">
                <span class="font-weight-medium">Role: </span>
<!--                <span class="text-capitalize text-body-1">{{ usuario.role }}</span>-->
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle class="text-sm">
                <span class="font-weight-medium">
                  Tax ID:
                </span>
                <span class="text-body-1">
<!--                  {{ props.userData.taxId }}-->
                </span>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle class="text-sm">
                <span class="font-weight-medium">
                  Contact:
                </span>
<!--                <span class="text-body-1">{{ props.userData.contact }}</span>-->
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle class="text-sm">
                <span class="font-weight-medium">
                  Language:
                </span>
<!--                <span class="text-body-1">{{ props.userData.language }}</span>-->
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle class="text-sm">
                <span class="font-weight-medium">
                  Country:
                </span>
<!--                <span class="text-body-1">{{ props.userData.country }}</span>-->
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>

        <!-- 👉 Edit and Suspend button -->
        <VCardText class="d-flex justify-center">
          <VBtn
            variant="elevated"
            class="me-4"
            @click="isUserInfoEditDialogVisible = true"
          >
            Edit
          </VBtn>
          <VBtn
            variant="outlined"
            color="error"
          >
            Suspend
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.5rem;
}

.current-plan {
  border: 2px solid rgb(var(--v-theme-primary));
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>
