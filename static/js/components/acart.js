const Cart = Vue.component("cart", {
  template: `
                <div>
                <p>Number of Products : {{this.$store.state.count}}</p>
                <p>Total Amount : {{this.$store.state.cost}}</p>
                <div class="card" style="width: 18rem;">
                    <div class="card-body" v-for = "product in products">
                        <h5 class="card-title">{{product.name}}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">{{product.price}}</h6>
                        Enter Quantity : <input type = "number" v-model="total_count[product.id]"> <br>
                        <button class="card-link bg-primary" @click="do_something(product.price, product.id)">Add to Cart</button>
                    </div>
                </div>
                </div>
                `,

  data: function () {
    return {
      total_count: [],
    };
  },

  computed: {
    products: function () {
      return this.$store.state.products;
    },
  },

  methods: {
    do_something: function (price, id) {
      this.$store.commit("update_count", this.total_count[id]);
      this.$store.commit("update_cost", {
        quantity: this.total_count[id],
        price: price,
      });
    },
  },
});

export default Cart;
