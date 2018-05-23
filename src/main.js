import Vue from 'vue';
//import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App.vue';
import {
  routes
} from './routes';
import './firebase';
import VueFire from 'vuefire';
import {store} from './store/store';
import Toasted from 'vue-toasted';
import BoostrapVue from 'bootstrap-vue';



//Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueFire);
Vue.use(Toasted);
Vue.use(BoostrapVue);


const router = new VueRouter({
  mode: 'history',
  routes: routes,
});

new Vue({
  el: '#app',
  store: store,
  router: router,
  render: h => h(App)
})
