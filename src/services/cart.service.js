const DBService = require('moleculer-db');
const { Errors } = require('moleculer');

module.exports = {
  name: 'cart',
  mixins: [DBService],
  actions: {
    addItem: {
      params: {
        userId: 'string',
        productId: 'string',
        quantity: 'number',
      },
      async handler(ctx) {
        const { userId, productId, quantity } = ctx.params;
        let cart = await this.adapter.findOne({ userId });

        if (!cart) {
          cart = await this.adapter.insert({
            userId,
            items: [],
          });
        }

        cart = await this.adapter.updateById(cart._id, {
          $push: { items: { productId, quantity } },
        });

        return cart;
      },
    },

    addPayment: {
      params: {
        userId: 'string',
        paymentId: 'string',
      },
      async handler(ctx) {
        const { userId, paymentId } = ctx.params;
        const cart = await this.ensureCartExists(userId);

        return await this.adapter.updateById(cart._id, {
          $set: { paymentId },
        });
      },
    },

    checkout: {
      params: {
        userId: 'string',
      },
      async handler(ctx) {
        const { userId } = ctx.params;
        let cart = null;
        try {
          cart = await this.ensureCartExists(userId);
        } catch (e) {
          throw e;
        }

        if (!cart.paymentId) {
          throw new Errors.MoleculerClientError('Missing payment ID for checkout');
        }

        try {
          const amount = await ctx.call('pricing.get', { userId, orderItems: cart.items });

          ctx.emit('cart.checkout', {
            userId,
            paymentId: cart.paymentId,
            amount,
          });
        } catch (e) {
          throw e;
        }
      },
    },
  },

  events: {
    'cart.payment-completed'(payload) {
      console.log(payload);
    },
    'cart.payment-failed'(payload) {
      console.log(payload);
    },
  },

  methods: {
    async ensureCartExists(userId) {
      let cart = await this.adapter.findOne({ userId });

      if (!cart) {
        throw new Errors.MoleculerClientError(`Missing cart for user: ${userId}`);
      }

      return cart;
    },
  },
};
