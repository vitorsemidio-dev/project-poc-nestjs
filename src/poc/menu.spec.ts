// Menu
// Menu Itens

/**
 * Dado que sou um usuário do setor financeiro
 * Desejo que o sistema apresente o menu de opções conforme as permissões do meu papel
 */
const app: any = {};
const request: any = () => ({});

const MOCK_ROLES = ['financeiro', 'logística', 'cliente'] as const;

const MOCK_PERMISSIONS = [
  'CONTAS_A_PAGAR',
  'CONTAS_A_RECEBER',
  'PEDIDOS_DE_COMPRA',
  'RECEBIMENTO_DE_COMPRA',
] as const;

class Menu {
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

const MOCK_MENU: Menu[] = [
  {
    id: '1',
    nome: 'Financeiro',
    icone: 'financeiro',
    ordem: 1,
    rota: '/',
    rolesNeeded: ['financeiro'],
    permissionsNeeded: [],
  },
  {
    id: '2',
    nome: 'Contas a Pagar',
    icone: 'contas-a-pagar',
    ordem: 2,
    rota: '/financeiro/contas-a-pagar',
    rolesNeeded: ['financeiro'],
    permissionsNeeded: ['CONTAS_A_PAGAR'],
  },
  {
    id: '3',
    nome: 'Contas a Receber',
    icone: 'contas-a-receber',
    ordem: 3,
    rota: '/financeiro/contas-a-receber',
    rolesNeeded: ['financeiro'],
    permissionsNeeded: ['CONTAS_A_RECEBER'],
  },
  {
    id: '4',
    nome: 'Compras produto',
    icone: 'compra-produto',
    ordem: 1,
    rota: '/cliente/loja/produtos',
    rolesNeeded: ['cliente'],
    permissionsNeeded: [],
  },
];

class Usuario {
  constructor(
    public id: number,
    public name: string,
    public roles: string[],
    public permissions: string[],
  ) {}
}

const usuarioFinanceiro = new Usuario(1, 'Financeiro', ['financeiro'], []);
const usuarioPagador = new Usuario(2, 'Pagador', [], ['CONTAS_A_PAGAR']);
const usuarioRecebedor = new Usuario(3, 'Recebedor', [], ['CONTAS_A_RECEBER']);
const usuarioCliente = new Usuario(4, 'Cliente', ['cliente'], []);

function log(
  menu: Menu,
  usuario: Usuario,
  hasRole: boolean,
  hasPermission: boolean,
) {
  // console.log(`Menu: ${menu.nome} - Usuario: ${usuario.name} - Roles: ${usuario.roles} - Permissions: ${usuario.permissions}`)
  // console.log(`Menu: ${menu.nome} - Usuario: ${usuario.name} - hasRole: ${hasRole} - hasPermission: ${hasPermission}`)
}

function getMenuUser(usuario: Usuario) {
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

describe('Menu Nível 1', () => {
  it('should return menu cliente', () => {
    const menuCliente = getMenuUser(usuarioCliente);

    expect(menuCliente).toEqual([MOCK_MENU[3]]);
  });

  it('should return menu pagador', () => {
    const menuCliente = getMenuUser(usuarioPagador);

    expect(menuCliente).toEqual([MOCK_MENU[1]]);
  });

  it('should return menu recebedor', () => {
    const menuCliente = getMenuUser(usuarioRecebedor);

    expect(menuCliente).toEqual([MOCK_MENU[2]]);
  });

  it('should return menu financeiro', () => {
    const menuCliente = getMenuUser(usuarioFinanceiro);

    expect(menuCliente).toEqual([MOCK_MENU[0], MOCK_MENU[1], MOCK_MENU[2]]);
  });
});

it.skip('should return the menu items by roles', async () => {
  const menu = await request(app.getHttpServer()).get('/menu/get').expect(200);

  expect(menu.body).toEqual({
    data: [
      {
        id: '1',
        nome: 'Financeiro',
        icone: 'financeiro',
        ordem: 1,
        itens: [
          {
            id: '1',
            nome: 'Contas a Pagar',
            icone: 'contas-a-pagar',
            ordem: 1,
            rota: '/financeiro/contas-a-pagar',
          },
          {
            id: '2',
            nome: 'Contas a Receber',
            icone: 'contas-a-receber',
            ordem: 2,
            rota: '/financeiro/contas-a-receber',
          },
        ],
      },
      {
        id: '2',
        nome: 'Compras',
        icone: 'compras',
        ordem: 2,
        itens: [
          {
            id: '3',
            nome: 'Pedidos de Compra',
            icone: 'pedidos-de-compra',
            ordem: 1,
            rota: '/compras/pedidos-de-compra',
          },
          {
            id: '4',
            nome: 'Recebimento de Compra',
            icone: 'recebimento-de-compra',
            ordem: 2,
            rota: '/compras/recebimento-de-compra',
          },
        ],
      },
    ],
    total: 2,
  });
});
