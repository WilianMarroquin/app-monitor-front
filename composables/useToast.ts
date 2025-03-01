import Swal from 'sweetalert2'
export const useToast = () => {
  const toast = useNuxtApp().$toast

  const showToastSuccess = (message: string) => {
    toast.success(message)
  }

  const showToastError = (message: string) => {
    toast.error(message)
  }

  const showToastWarning = (message: string) => {
    toast.warning(message)
  }

  const showToastInfo = (message: string) => {
    toast.info(message)
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

  return { showToastSuccess, showToastError, showToastWarning, showToastInfo, preguntaEliminar }
}
