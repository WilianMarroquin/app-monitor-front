export default defineNuxtRouteMiddleware(to => {
  const { action, subject } = to.meta
  const { info } = useToast()
  const { can } = useAbility()

  if (!can(action, subject)) {
    info('No tienes permisos para acceder a esta página')

    return navigateTo('/')
  }
})
