import { ApiRoute } from '../models/ApiRoute';

const listaContasAReceber = new ApiRoute({
  id: '1',
  nome: 'Lista contas a receber',
  method: 'GET',
  rota: '/financeiro/contas-a-receber',
  rolesNeeded: ['financeiro'],
  permissionsNeeded: ['CONTAS_A_RECEBER'],
});

const listaContasAPagar = new ApiRoute({
  id: '2',
  nome: 'Lista contas a pagar',
  method: 'GET',
  rota: '/financeiro/contas-a-pagar',
  rolesNeeded: ['financeiro'],
  permissionsNeeded: ['CONTAS_A_PAGAR'],
});

const excluirContasAPagar = new ApiRoute({
  id: '3',
  nome: 'Excluir contas a pagar',
  method: 'DELETE',
  rota: '/financeiro/contas-a-pagar',
  rolesNeeded: ['financeiro'],
  permissionsNeeded: ['CONTAS_A_PAGAR'],
});

const resgatarContasAPagar = new ApiRoute({
  id: '4',
  nome: 'Resgatar contas a pagar',
  method: 'POST',
  rota: '/financeiro/contas-a-pagar/resgatar',
  rolesNeeded: ['financeiro'],
  permissionsNeeded: ['CONTAS_A_PAGAR'],
});

const listaProdutos = new ApiRoute({
  id: '5',
  nome: 'Lista produtos',
  method: 'GET',
  rota: '/cliente/loja/produtos',
  rolesNeeded: ['cliente'],
  permissionsNeeded: [],
});

export const MOCK_API_ROUTES = [
  listaContasAReceber,
  listaContasAPagar,
  excluirContasAPagar,
  resgatarContasAPagar,
  listaProdutos,
];
