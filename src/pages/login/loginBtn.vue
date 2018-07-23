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
    width: 100%{}
    img{
      width: 100%;
      height: auto;
    margin: 0 auto;
    }
    .aa{
      color:$color-background;
      width: 50%;
      height: 30px;
      margin-left: 25%;
      border-radius: 5px;
      background-color:$primary-color ;
      font-size: $font-size-small;

    }
  }

</style>
