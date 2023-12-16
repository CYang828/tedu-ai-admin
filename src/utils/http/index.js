import { questionBank } from "./questionBank.serve"
import Vue from "vue";

const apis = {
    questionBank
  };
  export default {
    install() {
      Vue.prototype.$apis = apis;
    },
  };

