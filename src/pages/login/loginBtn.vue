<template>
  <div class="login">
    <img src="../../assets/imgs/loginBtn.png" alt="">
    <div>抱歉~您还未授权通过！</div>
    <button class="aa" @click="queren()">马上申请成为代理</button>
  </div>
  </template>
<script>
//  import {getUser} from 'api/user';
  export default {
    data(){
      return{
    userId:''
      }
    },
    methods:{
     queren:function () {
       this.userId = this.$route.query.userId;//获取userId
       let userId = this.userId
       this.$router.push("/login/login?userId=" + userId);
    }
    }
  }
</script>
<style lang="scss" scoped >
  @import "../../common/scss/variable.scss";
  .login{
    font-size: $font-size-large-s;
    width: 100%;
    text-align: center;
    img{
      width: 40%;
      height: auto;
      margin-top: 3rem;
      margin-bottom: 0.5rem;
    }
    .aa{
      color: #ffffff;
      border-radius: 5px;
      background-color: #72a52c;
      font-size: 0.24rem;
      padding: 0.2rem 0.3rem;
      margin-top: 0.2rem;
    }
  }

</style>
