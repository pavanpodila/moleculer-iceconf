const HTTPServer = require('moleculer-web');
const E = require('moleculer-web').Errors;

module.exports = {
  name: 'api-gateway',
  mixins: [HTTPServer],

  settings: {
    port: 9000,
    cors: {
      origin: '*',
    },
    routes: [
      {
        authorization: true,
        aliases: {
          'POST cart/add': 'cart.addItem',
          'POST cart/addPayment': 'cart.addPayment',
          'POST cart/checkout': 'cart.checkout',
          'POST cart/status': 'cart.status',
        },
      },
    ],
  },

  methods: {
    authorize(ctx, route, req, res) {
      let auth = req.headers['authorization'];
      if (auth && auth.startsWith('Bearer')) {
        let token = auth.slice(7);

        if (token === '123456') {
          ctx.meta.user = { id: '1234', name: 'ICE User' };
          return Promise.resolve(ctx);
        } else {
          return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
        }
      } else {
        return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
      }
    },
  },
};
