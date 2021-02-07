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
        let cart = await this.adapter.findOne({ userId, _type: 'cart' });

        if (!cart) {
          cart = await this.adapter.insert({
            userId,
            _type: 'cart',
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

        const statusItem = await this.adapter.findOne({ userId, _type: 'cart-status' });
        if (statusItem && statusItem.status === 'started') {
          throw new Errors.MoleculerClientError(`Checkout is already in progress for user: ${userId}`);
        }

        try {
          const amount = await ctx.call('pricing.get', { userId, orderItems: cart.items });

          const status = await this.adapter.insert({ _type: 'cart-status', userId, status: 'started' });
          ctx.emit('cart.checkout', {
            userId,
            paymentId: cart.paymentId,
            amount,
          });

          return status;
        } catch (e) {
          throw e;
        }
      },
    },

    status: {
      params: {
        userId: 'string',
      },

      async handler(ctx) {
        const { userId } = ctx.params;

        const statusItem = await this.adapter.findOne({ userId, _type: 'cart-status' });
        if (statusItem) {
          return statusItem.status;
        }

        return null;
      },
    },
  },

  events: {
    'cart.payment-completed': {
      async handler(ctx) {
        const { userId } = ctx.params;
        await this.updateCartStatus(userId, 'completed');

        ctx.emit('cart.checkout-complete', { userId });
      },
    },
    async 'cart.payment-failed'(ctx) {
      const { userId } = ctx.params;
      await this.updateCartStatus(userId, 'payment-failed');
    },
  },

  methods: {
    async updateCartStatus(userId, status) {
      const statusItem = await this.adapter.findOne({ userId, _type: 'cart-status' });
      if (statusItem) {
        return await this.adapter.updateById(statusItem._id, { $set: { status } });
      }
    },

    async ensureCartExists(userId) {
      let cart = await this.adapter.findOne({ userId, _type: 'cart' });

      if (!cart) {
        throw new Errors.MoleculerClientError(`Missing cart for user: ${userId}`);
      }

      return cart;
    },
  },
};
