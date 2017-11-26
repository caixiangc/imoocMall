<template> <!-- 这是只是一个模态框（在操作其他的时候调用的） -->
    <div>
      <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}"> 
        <!-- 一旦mdShow这个值传过来的时候，这个值是无法改变的 -->
        <div class="md-modal-inner">   
          <div class="md-top">
            <button class="md-close" @click="closeModal">Close</button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <slot name="message"></slot>
            </div>
            <div class="btn-wrap">
              <slot name="btnGroup"></slot>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-if="mdShow" @click="closeModal"></div>
    </div>
</template>
<style>

</style>
<script>
    export default{
        props:["mdShow"], // 父子组件的通信 通过props进行传递
        data(){
            return{
                msg:'hello vue'
            }
        },
        methods:{
          closeModal(){ //说到底 模态框里面的方法，只能通知父组件去做这做那，他本身不起作用，只是通知
            this.$emit("close"); //通过$emit去触发 父组件的事件， 这里触发父组件的close事件
          }
        }
    }
</script>
