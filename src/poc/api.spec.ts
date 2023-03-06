import { Usuario } from './models/Usuario';

const usuarioFinanceiro = new Usuario(1, 'Financeiro', ['financeiro'], []);
const usuarioPagador = new Usuario(2, 'Pagador', [], ['CONTAS_A_PAGAR']);
const usuarioRecebedor = new Usuario(3, 'Recebedor', [], ['CONTAS_A_RECEBER']);
const usuarioCliente = new Usuario(4, 'Cliente', ['cliente'], []);

describe('API', () => {
  it('should allow user to make a request if has permission', () => {
    console.log(usuarioFinanceiro);
    console.log(usuarioPagador);
    console.log(usuarioRecebedor);
    console.log(usuarioCliente);
  });
});
