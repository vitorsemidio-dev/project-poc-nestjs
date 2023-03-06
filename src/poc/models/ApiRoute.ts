type ApiRouteMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type ApiRouteProps = {
  id: string;
  nome: string;
  method: ApiRouteMethod;
  rota: string;
  rolesNeeded: string[];
  permissionsNeeded: string[];
};

export class ApiRoute {
  id: string;
  nome: string;
  method: ApiRouteMethod;
  rota: string;
  rolesNeeded: string[];
  permissionsNeeded: string[];

  constructor(props: ApiRouteProps) {
    Object.assign(this, props);
  }
}
