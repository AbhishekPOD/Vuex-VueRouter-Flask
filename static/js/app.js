import router from "./router.js";
import store from "./astore.js";

const a = new Vue({
  el: "#app",
  delimiters: ["${", "}"],
  router: router,
  store,
  data: {
    message: "Hello World !!",
  },
  methods: {},
});
