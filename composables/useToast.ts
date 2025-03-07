import { toast, ToastOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import Swal from 'sweetalert2'
import { useConfigStore } from '@core/stores/config'

export function useToast() {
  const configStore = useConfigStore()

  // Creamos una opción reactiva para manejar el tema
  const baseOptions: ToastOptions = {
    autoClose: 2500,
    position: 'top-right',
    pauseOnHover: true,
  }

  // Establecemos el tema basado en el store
  const updateToastTheme = () => {
    baseOptions.theme = configStore.theme === 'dark' ? 'dark' : 'light'
  }

  // Usamos watch para observar los cambios en el tema
  watch(() => configStore.theme, updateToastTheme, { immediate: true })

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    // Puedes simplificar las funciones de toast usando un solo método
    toast[type](message, baseOptions)
  }

  const preguntaEliminar = async (mensaje: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    })

    return result.isConfirmed
  }

  return {
    showToastSuccess: (message: string) => showToast('success', message),
    showToastError: (message: string) => showToast('error', message),
    showToastWarning: (message: string) => showToast('warning', message),
    showToastInfo: (message: string) => showToast('info', message),
    preguntaEliminar,
  }
}
