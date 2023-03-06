const app: any = {};
const request: any = () => ({});

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
