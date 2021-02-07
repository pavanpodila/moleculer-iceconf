module.exports = {
  name: 'payments',
  events: {
    'cart.checkout': {
      params: {
        userId: 'string',
        paymentId: 'string',
        amount: 'number',
      },

      async handler(ctx) {
        await delay(1000);

        const { userId, paymentId, amount } = ctx.params;
        const payload = { userId, paymentId, amount };

        if (Math.random() > 0.5) {
          ctx.emit('cart.payment-completed', { ...payload, referenceId: 'reference1' });
        } else {
          ctx.emit('cart.payment-failed', { ...payload, error: 'Not feeling lucky!' });
        }
      },
    },
  },
};

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
