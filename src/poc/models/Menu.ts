export class Menu {
  constructor(
    public id: string,
    public nome: string,
    public icone: string,
    public ordem: number,
    public rota: string,
    public rolesNeeded: string[],
    public permissionsNeeded: string[],
  ) {}
}
