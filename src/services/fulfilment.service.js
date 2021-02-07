module.exports = {
  name: 'fulfilments',

  events: {
    'cart.checkout-complete'(payload) {
      console.log('Sending for fulfilment: ', payload);
    },
  },
};
