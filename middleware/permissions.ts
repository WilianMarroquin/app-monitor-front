import { can } from '@layouts/plugins/casl'

export default defineNuxtRouteMiddleware(to => {
  const { action, subject } = to.meta
  const { info } = useToast()

  if (!can(action, subject)) {
    info('No tienes permisos para acceder a esta página')

    return navigateTo('/')
  }
})
