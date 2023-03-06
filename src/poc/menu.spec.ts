import { getUserMenu } from './functions/get-user-menu';
import { Usuario } from './models/Usuario';
import { MOCK_MENU } from './constants/mock-menu';

const usuarioFinanceiro = new Usuario(1, 'Financeiro', ['financeiro'], []);
const usuarioPagador = new Usuario(2, 'Pagador', [], ['CONTAS_A_PAGAR']);
const usuarioRecebedor = new Usuario(3, 'Recebedor', [], ['CONTAS_A_RECEBER']);
const usuarioCliente = new Usuario(4, 'Cliente', ['cliente'], []);

describe('Menu Nível 1', () => {
  it('should return menu cliente', () => {
    const menuCliente = getUserMenu(usuarioCliente);

    expect(menuCliente).toEqual([MOCK_MENU[3]]);
  });

  it('should return menu pagador', () => {
    const menuCliente = getUserMenu(usuarioPagador);

    expect(menuCliente).toEqual([MOCK_MENU[1]]);
  });

  it('should return menu recebedor', () => {
    const menuCliente = getUserMenu(usuarioRecebedor);

    expect(menuCliente).toEqual([MOCK_MENU[2]]);
  });

  it('should return menu financeiro', () => {
    const menuCliente = getUserMenu(usuarioFinanceiro);

    expect(menuCliente).toEqual([MOCK_MENU[0], MOCK_MENU[1], MOCK_MENU[2]]);
  });
});
