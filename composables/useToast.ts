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

  return { showToastSuccess, showToastError, showToastWarning, showToastInfo }
}
