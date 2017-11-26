<template>
    <div>
    <nav-header></nav-header>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li class="cur"><span>Make</span> payment</li>
            <li class="cur"><span>Order</span> confirmation</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>Congratulations! <br>Your order is under processing!</h3>
            <p>
              <span>Order ID：{{orderId}}</span>
              <span>Order total：{{orderTotal | currency('$')}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link class="btn btn--m" to="/cart">Cart List</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link class="btn btn--m" to="/">Goods List</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    <nav-footer></nav-footer>
    </div>
</template>
<script>
  import NavHeader from '@/components/NavHeader.vue'
  import NavFooter from '@/components/NavFooter.vue'
  import Modal from '@/components/Modal.vue'
  //import {currency} from './../util/currency'
  import NavBread from '@/components/NavBread.vue'
  import axios from 'axios'  //他自己回去node_module去查找遍历，不用我们自己去写地址
    export default{
        data(){  //data里面所有 变量都是vue的状态
            return{
              orderId:'',
              orderTotal:0
            }
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread,
          Modal
        },
        mounted(){  //******mounted 里面拿不到，data里面定义的全局变量，如果这个里要数据那么重新定义
          var orderId = this.$route.query.orderId; //这个是从url地址 哪里hash 里面获取的
          //var orderTotal = 0;
          //console.log('orderId:'+orderId+'orderTotal：'+orderTotal);
          if(!orderId){
            return;
          }
          axios.get("/users/orderDetail",{params:{orderId:orderId}}).then((response)=>{
            let res = response.data; //axios 如果是get 请求那么第二个参数是要｛params：｛｝｝的 
            if(res.status="0"){
              this.orderId = orderId;
              this.orderTotal = res.result.orderTotal;
            }
          })
        }
    }
</script>
