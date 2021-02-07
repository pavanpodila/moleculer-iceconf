const DBService = require("moleculer-db");

module.exports = {
  name: "cart",
  mixins: [DBService],
  actions: {
    add: {
      params: {
        userId: "string",
        productId: "string",
        quantity: "number",
      },
      async handler(ctx) {
        const { userId, productId, quantity } = ctx.params;
        let cart = await this.adapter.findOne({ userId });

        if (!cart) {
          cart = await this.adapter.insert({
            userId,
            items: [],
          });

          console.log(cart);
        }

        cart = await this.adapter.updateById(cart._id, {
          $push: { items: { productId, quantity } },
        });

        console.log(cart);
      },
    },
  },
};
