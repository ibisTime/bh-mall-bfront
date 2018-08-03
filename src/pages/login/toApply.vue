<template>
  <div class="login">
    <img src="../../assets/imgs/loginBtn.png" alt="">
    <div class="sorry">抱歉~您还未进行微信授权！</div>
    <button class="aa" @click="queren()">马上进行授权</button>
  </div>
  </template>
<script>
    import { getAppId, usergo1, usergo2 } from "api/baohuo";
  export default {
    data(){
      return{
        userId:'',
        code: ''
      }
    },
    methods:{
        queren: function () {
           this.AppId();
        },
        //获取用户微信code
        AppId() {
            //获取用户appid
            getAppId("wx_h5_access_key").then(res => {
                var appId = res.cvalue;
                let redirect_uri = `${location.origin}?${location.hash}`;
                // 获取当前地址
                let redirectUri = encodeURIComponent(redirect_uri);
                let url = "https://open.weixin.qq.com/connect/oauth2/authorize";
                let suffix =
                    "&response_type=code&scope=snsapi_userinfo#wechat_redirect";
                //发送微信网页授权地址，由此获取code
                setTimeout(() => {
                    location.replace(
                        `${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`
                    );
                }, 100);
            });
        }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../common/scss/variable.scss";
  .login{
    text-align: center;
    font-size: $font-size-large-s;
    width: 100%{}
    .sorry{
        margin: 30px auto;
        margin-bottom: 40px;
    }
    img{
      width: 60%;
      height: auto;
      margin: 20px auto;
      margin-top: 80px;
    }
    .aa{
      color:$color-background;
      width: 50%;
      height: 40px;
      border-radius: 5px;
      background-color:$primary-color;
      font-size: 16px;
    }
  }

</style>
