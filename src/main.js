// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Vuex from 'vuex'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'  //这里过滤器不是default的，因为返回的是个object对象，所以这里currency要用括号括起来


import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/login.css'
import './assets/css/product.css'

//Vue.use() 就是使用插件
Vue.use(infiniteScroll);
Vue.use(Vuex); //通过Vue.use(); 来用这个插件
Vue.use(VueLazyload, {
  loading: 'static/loading-svg/loading-bars.svg',
  try: 3 // default 1
})

Vue.filter("currency", currency); //这里的过滤器是把currency定义在全局
Vue.config.productionTip = false;

const store = new Vuex.Store({ //在main.js里面定义好了以后，能够在全栈所有组件里面都能获取到这两个状态
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: { //mutations是专门用来改变状态的
    //更新用户信息
    updateUserInfo(state, nickName) {
      state.nickName = nickName;
    },
    updateCartCount(state, cartCount) {
      state.cartCount += cartCount;
    },
    initCartCount(state,cartCount){ //当页面加载的时候，checklogin也会调用initCartCount而不是updateCartCount
      state.cartCount = cartCount;
    }
  }
});
/* eslint-disable no-new */
new Vue({  //所有组件都是挂载到 main.js这个实例里面去的
  el: '#app',
  store,//把上面定义的store注册到这个主Vue实例里面去，注册了以后，vue里面所有的组件都具备store的功能
  router,
  mounted() {
/*    this.checkLogin();
    this.getCartCount();*/
  },
  methods: {
/*    checkLogin() {
      axios.get("users/checkLogin").then(res => {
        var res = res.data;
        if (res.status == "0") {
          this.$store.commit("updateUserInfo", res.result);
        } else {
          if (this.$route.path != "/goods") {
            this.$router.push("/goods");
          }
        }
      });
    },
    getCartCount() {
      axios.get("users/getCartCount").then(res => {
        var res = res.data;
        if (res.status == "0") {
          this.$store.commit("updateCartCount", res.result);
        }
      });
    }*/
  },
  template: '<App/>',
  //render: h => h(App),
  components: {
    App
  }
}); //.$mount('#app')