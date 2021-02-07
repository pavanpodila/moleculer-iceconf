const { Errors } = require('moleculer');

module.exports = {
  name: 'pricing',
  actions: {
    get: {
      params: {
        userId: 'string',
        orderItems: {
          type: 'array',

          items: {
            type: 'object',
            props: {
              productId: 'string',
              quantity: 'number',
            },
          },
        },
      },
      async handler(ctx) {
        const { userId, orderItems } = ctx.params;

        return 100;
      },
    },
  },
};
