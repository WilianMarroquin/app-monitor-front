import Swal from 'sweetalert2'

export function useToast() {
  const colorTema = useCookie('materialize-color-scheme') || 'light'

  const showToast = (icon: 'success' | 'error' | 'warning' | 'info', title: string) => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: colorTema.value === 'dark' ? '#222339' : '#fff',
      color: colorTema.value === 'dark' ? '#fff' : '#222339',
    })
  }

  return {
    success: (title: string) => showToast('success', title),
    error: (title: string) => showToast('error', title),
    warning: (title: string) => showToast('warning', title),
    info: (title: string) => showToast('info', title),
  }
}
