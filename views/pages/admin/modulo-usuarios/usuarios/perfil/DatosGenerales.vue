<script setup lang="ts">
import type { UsuarioInterface } from '@/types/admin/modulo-usuarios/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'

interface Props {
  userData: UsuarioInterface
}
interface response {
  data: string
  message: string
}

const props = defineProps<Props>()

const { error, success } = useToast()
const { post } = useClienteRequest()

const usuario = ref<UsuarioInterface>(props.userData ?? null)
const isUserInfoEditDialogVisible = ref(false)
const input = ref(null)
const fotoTemporal = ref<File | null>(null)

const nuevaFotoPerfil = (archivo: File[]) => {
  if (archivo)
    fotoTemporal.value = archivo
  else
    error('No se ha podido cargar la imagen')
}

const guardarFotoPerfil = async () => {
  if (!fotoTemporal.value)
    return

  const formData = new FormData()
  formData.append('avatar', fotoTemporal.value)

  try {
    const res = await post<SendResponseInterface<response>>(`api/admin/modulo-usuarios/users/actualizar/foto/perfil/${usuario.value.id}`, formData)

    usuario.value.avatar = res.data
    fotoTemporal.value = null

    success(res.message)
  }
  catch (error: any) {
    manejaError(error)
  }
}

const fotoTemporalBlob = computed(() => {
  if (fotoTemporal.value) {
    const blob = new Blob([fotoTemporal.value], { type: 'image/jpeg' })
    return URL.createObjectURL(blob)
  }
  return null
})
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
              v-if="fotoTemporalBlob || usuario.avatar"
              :src="fotoTemporalBlob || usuario.avatar"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(usuario.nombre_completo) }}
            </span>

          </VAvatar>
          <p></p>
          <VBtn
            v-if="!fotoTemporal"
            size="small"
            variant="outlined"
            @click="input?.click()"
          >
            Subir Foto
          </VBtn>
          <VBtn
            v-if="fotoTemporal"
            size="small"
            @click="guardarFotoPerfil"
          >
            Guardar
          </VBtn>
          <VFileInput
            ref="input"
            :multiple="false"
            accept="image/*"
            hide-input
            prepend-icon="mdi-paperclip"
            @update:model-value="nuevaFotoPerfil"
          />
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
            Detalles
          </h5>

          <VDivider class="my-4"/>

          <!-- 👉 User Details list -->
          <VList class="card-list">
            <VListItem>
              <VListItemTitle class="text-sm">
                <span class="font-weight-medium">Nombre de usuario:</span>
                <span class="text-body-1">
                  @{{ usuario.usuario }}
                </span>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle class="text-sm">
                <span class="font-weight-medium">
                  Email:
                </span>
                <span class="text-body-1">{{ usuario.email }}</span>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle class="text-sm">
                <span class="font-weight-medium">
                  Estado:
                </span>
                <span class="text-body-1 text-capitalize">{{ usuario.estado }}</span>
              </VListItemTitle>
            </VListItem>

            <!--            <VListItem>-->
            <!--              <VListItemTitle class="text-sm">-->
            <!--                <span class="font-weight-medium">Roles: </span>-->
            <!--                <span class="text-capitalize text-body-1">{{ usuario.role }}</span>-->
            <!--              </VListItemTitle>-->
            <!--            </VListItem>-->

            <!--            <VListItem>-->
            <!--              <VListItemTitle class="text-sm">-->
            <!--                <span class="font-weight-medium">-->
            <!--                  Tax ID:-->
            <!--                </span>-->
            <!--                <span class="text-body-1">-->
            <!--&lt;!&ndash;                  {{ props.userData.taxId }}&ndash;&gt;-->
            <!--                </span>-->
            <!--              </VListItemTitle>-->
            <!--            </VListItem>-->

            <!--            <VListItem>-->
            <!--              <VListItemTitle class="text-sm">-->
            <!--                <span class="font-weight-medium">-->
            <!--                  Contact:-->
            <!--                </span>-->
            <!--&lt;!&ndash;                <span class="text-body-1">{{ props.userData.contact }}</span>&ndash;&gt;-->
            <!--              </VListItemTitle>-->
            <!--            </VListItem>-->

            <!--            <VListItem>-->
            <!--              <VListItemTitle class="text-sm">-->
            <!--                <span class="font-weight-medium">-->
            <!--                  Language:-->
            <!--                </span>-->
            <!--&lt;!&ndash;                <span class="text-body-1">{{ props.userData.language }}</span>&ndash;&gt;-->
            <!--              </VListItemTitle>-->
            <!--            </VListItem>-->

            <!--            <VListItem>-->
            <!--              <VListItemTitle class="text-sm">-->
            <!--                <span class="font-weight-medium">-->
            <!--                  Country:-->
            <!--                </span>-->
            <!--&lt;!&ndash;                <span class="text-body-1">{{ props.userData.country }}</span>&ndash;&gt;-->
            <!--              </VListItemTitle>-->
            <!--            </VListItem>-->
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
