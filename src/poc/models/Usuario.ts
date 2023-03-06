export class Usuario {
  constructor(
    public id: number,
    public name: string,
    public roles: string[],
    public permissions: string[],
  ) {}
}
