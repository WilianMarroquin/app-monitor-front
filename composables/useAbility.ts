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
    }
    else if (usuario?.permisos) {
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

  return { ability, can }
}
