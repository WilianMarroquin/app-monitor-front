import { useAbility } from '~/composables/useAbility'

export default defineNuxtPlugin((nuxtApp) => {
  const { ability } = useAbility()

  nuxtApp.provide('ability', ability)
})
