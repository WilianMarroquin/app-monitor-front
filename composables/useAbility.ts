import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { watchEffect } from 'vue'

const ability = createMongoAbility()

export function useAbility() {
  const { user } = useSanctumAuth() // Obtenemos el usuario autenticado

  // Función para definir reglas dinámicamente
  const defineRules = (usuario) => {
    const { can, rules } = new AbilityBuilder(createMongoAbility)

    if (usuario?.roles?.includes('Super Admin')) {
      can('manage', 'all') // El super admin tiene control total
    } else if (usuario?.permisos) {
      usuario.permisos.forEach((permiso) => {
        can(permiso.accion, permiso.recurso)
      })
    }

    return rules
  }

  // Observar cambios en `user` y actualizar permisos automáticamente
  watchEffect(() => {
    ability.update(defineRules(user.value))
  })

  // Método para verificar permisos en la vista
  const can = (action, subject) => ability.can(action, subject)

  /**
   * Verifica si un grupo de navegación debe mostrarse en función de los permisos del usuario.
   * Si ninguno de sus elementos hijos es accesible, se oculta el grupo.
   * @param {NavGroup} item - Objeto del grupo de navegación.
   * @returns {boolean} - `true` si el grupo debe mostrarse, `false` en caso contrario.
   */
  const canViewNavMenuGroup = (item) => {
    const hasAnyVisibleChild = item.children.some(i => can(i.action, i.subject))

    // Si no tiene action y subject definidos, solo verificamos si hay hijos visibles
    if (!(item.action && item.subject))
      return hasAnyVisibleChild

    return can(item.action, item.subject) && hasAnyVisibleChild
  }

  return { ability, can, canViewNavMenuGroup }
}
