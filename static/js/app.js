import router from "./router.js"
import store from "./astore.js"

const a = new Vue({
    el : "#app",
    delimeters : ['${', '}'],
    router : router,
    store,
    data : {
        message : "Hello World !!",
    },
    methods : {

    },
    mounted : function () {
        console.log("Invoked action function...")
        this.$store.dispatch("get_products")
    }
})