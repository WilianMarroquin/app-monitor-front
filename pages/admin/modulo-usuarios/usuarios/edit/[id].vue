<script setup lang="ts">
import type { RolInterface, UsuarioInterface } from '@/types/admin/modulo-usuarios/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'
import fields from '@/views/pages/admin/modulo-usuarios/usuarios/fields.vue'
import Autenticacion from "@/views/pages/admin/modulo-usuarios/usuarios/SeccionAutenticacion.vue"
import Roles from '@/views/pages/admin/modulo-usuarios/usuarios/SeccionRoles.vue'

definePageMeta({
  navActiveLink: 'admin-modulo-usuarios-usuarios',
  middleware: 'permissions',
  action: 'Editar usuarios', // Acción requerida
  subject: 'User',  // Sujeto requerido (esto puede ser el nombre de un recurso o algo más específico)
})

const { put, get } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const route = useRoute()
const id = <number>route.params.id
const rolesAsignadosActualmente = ref<RolInterface[]>([])

const actualizarUser = async (User: UsuarioInterface): Promise<void> => {
  paginaEspera.value = true
  try {
    const respuesta = await put('api/admin/modulo-usuarios/users/' + id, User)

    success(respuesta.message)
  } catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  } finally {
    paginaEspera.value = false
  }
}

interface UserEdit {
  roles: RolInterface[]
  user: UsuarioInterface
}

const itemUser = ref(<UsuarioInterface>
  {
    primer_nombre: null,
    segundo_nombre: null,
    primer_apellido: null,
    segundo_apellido: null,
    usuario: null,
    email: null,
    email_verified_at: null,
    password: null,
    remember_token: null,
  },
)

const getUser = async () => {
  paginaEspera.value = true
  try {
    const respuesta: SendResponseInterface<UserEdit> = await get(`api/admin/modulo-usuarios/users/${id}/`)
    itemUser.value = respuesta.data?.user
    rolesAsignadosActualmente.value = respuesta.data.roles

  } catch (errorCarpturado: any) {
    manejaError(errorCarpturado)
  } finally {
    paginaEspera.value = false
  }
}

getUser()

const puedeMostrarDatos = computed(() => {
  return Object.values(itemUser.value).some(valor => valor !== null && valor !== undefined)
})
</script>

<template>

  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <h1 v-text="'Editar Usuario'"/>
    <VBtn
      class="ml-auto"
      color="secondary"
      to="/admin/modulo-usuarios/usuarios/"
    >
      <VIcon class="mr-2 ri-contract-left-fill"/>
      Regresar
    </VBtn>

  </div>

  <VCard>
    <VCardText>
      <VExpansionPanels multiple>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            Información General
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <fields :fields="fields"
                    class="mt-1"
                    v-if="puedeMostrarDatos"
                    :item="itemUser"
                    @emitirDatos="actualizarUser"
            />
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            Autenticación
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <Autenticacion/>
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            Roles
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <Roles :rolesActuales="rolesAsignadosActualmente" :user_id="id"/>
          </VExpansionPanelText>
        </VExpansionPanel>

      </VExpansionPanels>
      <VCol cols="12" class="text-end">
        <VBtn
          type="submit"
          to="/admin/modulo-usuarios/usuarios"
        >
          <VIcon class="mr-2 ri-save-3-fill"/>
          Finalizar
        </VBtn>
      </VCol>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">

</style>
