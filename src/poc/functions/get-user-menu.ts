import { Usuario } from '../models/Usuario';
import { MOCK_MENU } from '../constants/mock-menu';
export function getUserMenu(usuario: Usuario) {
  const menuUsuario = MOCK_MENU.filter((menu) => {
    const hasRole = menu.rolesNeeded.some((role) => {
      return usuario.roles.includes(role);
    });
    const hasPermission = menu.permissionsNeeded.some((permission) =>
      usuario.permissions.includes(permission),
    );

    return hasRole || hasPermission;
  });
  return menuUsuario;
}
