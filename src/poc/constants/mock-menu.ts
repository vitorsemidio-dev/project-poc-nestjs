import { Menu } from '../models/Menu';

export const MOCK_MENU: Menu[] = [
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
