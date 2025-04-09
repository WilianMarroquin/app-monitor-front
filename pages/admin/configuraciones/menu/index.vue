<script lang="ts" setup>
import type { MenuOpcionInterface } from '@/types/admin/configuraciones/types'
import type { SendResponseInterface } from '@/types/generales/types'
import { manejaError } from '@/utils/funcionesComunes'
import ListaOpciones from '@/views/pages/admin/configuraciones/menu-opciones/components/ListaOpciones.vue'

definePageMeta({
  // middleware: 'permissions',
  // action: 'ver opcion menu',
  // subject: 'menu opcion',
})

const { post } = useClienteRequest()
const { success } = useToast()
const { paginaEspera } = useCargandoPagina()

const opcionesMenu = useState<MenuOpcionInterface[]>('menu', () => [])

const actualizarOpciones = async (opciones: MenuOpcionInterface[]): Promise<void> => {
  const opcionesAplanadas: MenuOpcionInterface[] = flattenOptions(opciones)

  paginaEspera.value = true
  try {
    const data = {
      opciones: opcionesAplanadas,
    }

    const respuesta: SendResponseInterface<MenuOpcionInterface[]> = await post('api/menu-opcions/actualizar/orden', data)

    opcionesMenu.value = respuesta.data ?? []

    success(respuesta.message)
  }
  catch (error: any) {
    manejaError(error)
  }
  finally {
    paginaEspera.value = false
  }
}

function flattenOptions(options: MenuOpcionInterface[]): MenuOpcionInterface[] {
  let flattened: MenuOpcionInterface[] = []
  for (const option of options) {
    const { children, ...currentOption } = option

    flattened.push(currentOption as MenuOpcionInterface)
    if (children && Array.isArray(children))
      flattened = flattened.concat(flattenOptions(children))
  }

  return flattened
}
</script>

<template>
  <div class="d-flex flex-wrap justify-end justify-sm-space-between gap-y-4 gap-x-6 mb-3 ">
    <h1>Administrar Menu</h1>
    <VBtn
      class="ms-auto"
      to="/admin/configuraciones/menu/create"
    >
      <VIcon class="mr-2 ri-add-large-fill" />
      Nueva Opción
    </VBtn>
  </div>

  <VCard>
    <VCardText>
      <ListaOpciones
        :opciones="opcionesMenu ?? []"
        @items-actualizadas="actualizarOpciones"
      />
    </VCardText>
  </VCard>
</template>
