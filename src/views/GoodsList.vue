<template>
    <div>
      <!-- 标签NavHeader不能这样写，因为w3c规范要求，标签全部要小写，所以<nav-header></nav-header> -->
      <nav-header></nav-header>
      <nav-bread>   <!-- 扩展 只要在不同页面（路由）显示不同部分都可以用扩展 -->
        <span slot="bread">Goods</span> <!-- 这里就是插头 模板里面对应插槽，能够把内容对应在插槽上，可扩展性高 -->
        <span slot="B">GoodsS</span>  <!-- slot也是支持多个扩展的 -->
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a> 
            <!-- //@click="ff" ff后面是没有括号的 -->
            <a @click="sortGoods" href="javascript:void(0)" class="price">Price 
              <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg>
            </a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->                   <!-- ****v-bind都是这种格式：v-bind:class="{'':变量}" -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}"> 
              <!-- 这里的filterby是和上面的class中的filterby对应的,这里filterby没有实际意义 -->
              <!-- 它的class名字是filterBy-show，是通过filterBy来控制的 -->
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceCheck=='all'}" @click="priceCheck='all'">All</a></dd>  
                <!--******** {'cur':priceCheck=='all'} 意思就是判断priceCheck是否为‘all’，如果是就cur（选中状态） -->
                <dd v-for="(price,index) in priceFilter">
                  <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceCheck==index}">{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList">
                    <div class="pic">
                      <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-infinite-scroll="loadMore" class="load-more" infinite-scroll-disabled="busy" infinite-scroll-distance="10">加载中... 
                  <img src="../assets/loading-spinning-bubbles.svg" alt="" v-show = "loading">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>  
      <!-- 在v-on:close="closeModal"中，closeModal(方法)是close的一个方法，close 是一个事件，我们要在子组件触发这个事件 -->
      <!-- 当触发了close事件后就会自动调用closeModal这个方法 -->
      <modal v-bind:mdShow="mdShow" v-on:close="closeModal"> <!-- 当mdShow为true的时候，，就会往子组件里面传值 -->
        <p slot="message">
            请先登入，否者无法加入购物车中！
        </p>
        <div slot="btnGroup">
          <a href="javascript:;" @click="closeModal" class="btn btn--m">关闭</a>
        </div>
      </modal>

      <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal"> <!-- 当mdShow为true的时候，，就会往子组件里面传值 -->
        <p slot="message">
          <svg class="navbar-cart-logo">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#navbar-cart-logo"></use>
          </svg>
          加入购物车成功
        </p>
        <div slot="btnGroup">
          <a href="javascript:;" @click="mdShowCart = false" class="btn btn--m">继续购物</a>
          <router-link href="javascript:;" class="btn btn--m" to="/cart">查看购物车</router-link> <!-- router-link是一个超链接 -->
        </div>
      </modal>
      
      <nav-footer></nav-footer>
    </div>
</template>
<script>
    import './../assets/css/base.css'    //css样式表也能在script 里面导入用import
    import './../assets/css/product.css'
    import NavHeader from '@/components/NavHeader.vue'
    import NavFooter from '@/components/NavFooter.vue'
    import Modal from '@/components/Modal.vue'
    import NavBread from '@/components/NavBread.vue'
    import axios from 'axios'  //他自己回去node_module去查找遍历，不用我们自己去写地址
    export default{
        data(){               //主键一定是要一个函数并且返回一个object(),这里主键函数就是data(){}
            return {          //这样做的原因是因为不允许主键之间进行状态共享
              goodsList:[],
              priceFilter:[
                {startPrice:0.00,endPrice:500.00},
                {startPrice:500.00,endPrice:1000.00},
                {startPrice:1000.00,endPrice:1500.00},
                {startPrice:1500.00,endPrice:2000.00},
                {startPrice:2000.00,endPrice:2500.00},
                {startPrice:2500.00,endPrice:3000.00},
                {startPrice:3000.00,endPrice:3500.00}
              ],
              priceCheck:'all',   //这里给个初始值，默认是选中all  data()里面数据可以不是数组
              filterBy:false,  //这里先定义一个变量，****变量是在这里定义的
              overLayFlag:false,  //定义变量的时候用冒号
              sortFlag:true,
              page:1,
              pageSize:8,
              busy:true,
              loading:false,
              mdShow:false,
              mdShowCart:false

            }
        },
        components:{  //这里要填的是个object 可以直接写名字NavHeader
          NavHeader:NavHeader,   //{}里面一定是个key value的形式，如果key 和value 是一样的那么就可以就写一个
          NavFooter:NavFooter,  
          NavBread:NavBread,
          Modal   
        },
        mounted:function(){    //在生命周期链 上面每个时期，function(){}不一定支持ES6的语法
        //mounted是vue生命周期里面，初始化生命周期的方法(监控数据变化之前)，它在一次生命周期只会执行一次（参照博客）
          this.getGoodsList();//在初始化的时候调用即可
          //mounted这个方法也就是在生命周期的开始，调用一次，它里面function里面的方法
        },
        methods:{
          getGoodsList(flag){  //这一串是商品列表加载的代码
            var param = {  //这个params嵌入axios.get()里面，在报头显示参数Request URL:http://localhost:8989/goods?page=1&pageSize=8&sort=1，这样也避免参数暴露
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag?1:-1, //如果true就是升序，如果为false就为降序
              priceLevel:this.priceCheck
            }
            this.loading = true;
            //get()第二个是参数，axios.get的data要加个params
            axios.get("/goods/list",{params:param}).then((result)=>{ 
            //因为我们在dev-server里面已经定义了一个路由("/goods")，所以我们访问“/goods”就能拿到信息。然后用ES6的Promise中的.then()进行链式调用
              //*****（重要）当我们访问‘/goods’的时候会默认转发到 locahost:3000里面去获取mongodb信息，这里的数据是通过server 里面数据转发过来的 axios重要
              var res=result.data; //data 就是数组那一串"result":[{k:v;k:v},{k:v;k:v}.....]    
              this.loading = false;
              if(res.status=="0"){
                this.goodsList=res.result.list

                if(flag){ //如果falg是true那么是分页的加载（要累加）;否者是初次加载全部加载近来
                  this.goodsList=this.goodsList.concat(res.result.list); 
                  if(res.result.count < 2){ // 如果没有数据了（分页最后一页）那么把滚动加载给关了，
                    this.busy = true
                  }else{
                    this.busy = false
                  }
                }else{
                  this.goodsList=res.result.list;
                  this.busy = false
                }
              }else{
                this.goodsList = [];
              }
              //常规是这样  this.goodsList=result.data.result 
            })
          },
          sortGoods(){
            this.sortFlag = ! this.sortFlag;
            this.page = 1;  //排序后重新 ，要冲page = 1 开始
            this.getGoodsList(); 
          }
          ,
          showFilterPop(){
            this.filterBy=true;  //这里先定义一个变量，****变量是在这里定义的
            this.overLayFlag=true  //当在methods 方法里面给变量赋值的时候用等号
          },
          closePop(){
            this.filterBy=false;
            this.overLayFlag=false;

          },
          setPriceFilter(index){
            this.priceCheck = index;
            this.closePop();
            this.page = 1;
            this.getGoodsList();
          },
          loadMore(){
            this.busy = true; //把他设置为true就是把滚动加载这个插件禁止了
            setTimeout(() => {  //当滚动条滚动的时候就会加载这个函数，所以要settimeout(，1000)否者一下触发太多时间对服务器响应多个请求，页面卡住
              this.page++; //预先加载下个页面内容的东西
              this.getGoodsList(true);
            }, 500);
          },
          addCart(productId){
            axios.post("/goods/addCart",{productId:productId}).then((res)=>{ 
            //这边提交的地址是 server的 local：host:3000/goods/addCart 
            var ress = res.data; 
            //***（重要）在获取res 里面的数据的时候一定要加data才能取到var ress = res.data; ress.status
              if(ress.status == "0"){
                this.mdShowCart = true;
                this.$store.commit("updateCartCount",1)
              }else{ 
               /* alert("加入失败原因是："+ress.msg);*/
                this.mdShow = true  
              }
            })
          },
          closeModal(){
            this.mdShow = false;
             this.mdShowCart = false
          }
        }
    }
</script>

<!-- 生成项目模板 vue init webpack [项目名] -->