

const store = new Vuex.Store({
    state : {
        count : 0,
        cost : 0,
        products : [],
    },

    getters : {
        get_count : function (state) {
            return state.count
        }
    },

    mutations : {
        update_count : function (state, quantity) {
            state.count += Number(quantity);
        },

        update_cost : function (state, obj) {
            state.cost += (Number(obj.quantity) * Number(obj.price));
        },

        update_products : function (state, data) {
            state.products = data
        }
    },

    actions : {
        get_products : function (context) {
            fetch("/static/data.json").then(r => r.json()).then(d => context.commit("update_products", d))
        }
    }
})

// store.state.count = "wlnfwlnf";

export default store;