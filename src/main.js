import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from './firebase'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import InstantSearch from 'vue-instantsearch';
import VueChatScroll from 'vue-chat-scroll'
import { Datetime } from 'vue-datetime'

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-datetime/dist/vue-datetime.css'

Vue.use(BootstrapVue);
Vue.use(InstantSearch);
Vue.use(require('vue-faker'));
Vue.use(VueChatScroll)
Vue.use(Datetime)

Vue.config.productionTip = false

let app
auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})