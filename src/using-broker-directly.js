const { ServiceBroker } = require('moleculer');
const DBService = require('moleculer-db');
const HTTPServer = require('moleculer-web');

const broker1 = new ServiceBroker({
  transporter: 'NATS',
});

broker1.createService({
  name: 'products',
  mixins: [DBService],
  transporter: 'nats://localhost:4222',
  actions: {
    add(ctx) {},
    bread(ctx) {
      return {
        id: 'first-product',
        name: 'Whole Wheat Bread',
        price: 4.99,
      };
    },
  },
});

broker1.createService({
  name: 'gateway',
  transporter: 'nats://localhost:4222',
  mixins: [HTTPServer],
  settings: {
    routes: [
      {
        aliases: {
          'GET /products': 'products.bread',
        },
      },
    ],
  },
});

broker1.start();
