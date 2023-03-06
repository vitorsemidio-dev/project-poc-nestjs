import { Usuario } from './../models/Usuario';
import { Menu } from './../models/Menu';
export function logDetails(
  menu: Menu,
  usuario: Usuario,
  hasRole: boolean,
  hasPermission: boolean,
) {
  // console.log(
  //   `Menu: ${menu.nome} - Usuario: ${usuario.name} - Roles: ${usuario.roles} - Permissions: ${usuario.permissions}`,
  // );
  console.log(
    `Menu: ${menu.nome} - Usuario: ${usuario.name} - hasRole: ${hasRole} - hasPermission: ${hasPermission}`,
  );
}
