import { ApiRoute } from '../models/ApiRoute';
import { Usuario } from '../models/Usuario';

export function hasPermission(usuario: Usuario, resource: ApiRoute): boolean {
  return false;
}
