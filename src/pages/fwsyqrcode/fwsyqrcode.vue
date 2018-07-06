<template>
  <div class="full-screen-wrapper">
    <div ref="total" class="total">
      <div class="logo"></div>
      <div class="text">
        <p>扫描二维码，查防伪，查溯源</p>
        <p>溯源码：6289399844996</p>
      </div>
      <div class="center">
        <div class="erweimaPic" id="qrcode"></div>
      </div>
      <div class="text">
        <p>防伪码：6289399844996</p>
        <div style="height: 0.5rem"></div>
      </div>
    </div>
    <button class="btn" @click="save">保存</button>
    <!--<div class="img-show" :style="{display: state.isDownloadImg ? 'block':'none'}">-->
      <!--<img :src="state.imgUrl"/>-->
    <!--</div>-->
  </div>
</template>
<script>
  const QRCode = require("js-qrcode");
  const html2canvas = require("html2canvas");
  import {getCookie} from 'common/js/cookie.js';
  import {getUser,getUserById} from 'api/user';
  import {initShare} from 'common/js/weixin';

  export default {
    data(){
      return{
        wxUrl:'https://dev.hichengdai.com?userId=',
        userId:'',
        nickname:'',
        info:{
          title:'qqqqqqqqqqq',
          desc:'qqqqqqqqqqq',
          link:location.href,
          imgUrl:'http://otoieuivb.bkt.clouddn.com/下载_1522114909652.jpg'
        },
        state: {
          isDownloadImg: false,
          imgUrl: ''
        }
      }
    },
    methods:{
      share(){
        initShare(this.info,this.success)
      },
      save() {
        let b64;
        html2canvas(this.$refs.total, {
          useCORS: true
        }).then(canvas => {
          try {
            b64 = canvas.toDataURL("image/png");
            document.location.href = b64.replace("image/png", 'image/octet-stream');
          } catch (err) {
            console.log(err)
            alert(err)
          }
          this.state = {
            imgUrl: b64,
            isDownloadImg: true,
          }
        });
      }
    },
    mounted(){
      this.userId = getCookie('userId') || this.$route.query.userId
      this.wxUrl += this.userId
      getUserById(this.userId).then(res =>{
        this.nickname = res.nickname
      })

      //用插件生成二维码
      const container = document.getElementById("qrcode");

      //设置转换二维码图片的参数
      const qr = new QRCode(container, {
        width: 275,
        height: 275,
        typeNumber: -1,
        correctLevel: 2,
        background: "#ffffff",
        foreground: "#000000"
      });
      qr.make(this.wxUrl);

    }
  }
</script>
<style lang="scss" scoped>
  .logo{
    width: 100%;
    height: 3rem;
    background: #3b6c49;
    margin-bottom: 0.5rem;
  }
  .text{
    width: 100%;
    text-align: center;
    margin-bottom: 0.5rem;
    p{
      height: 10%;
      font-size: 0.54rem;
      margin-bottom: 0.2rem;
    }
  }
  .center{
    text-align: center;
    margin-bottom: 0.5rem;
    .erweimaPic{
      width: 50%;
      height: 50%;
      display: inline-block;
      /*margin: 0 auto;*/
    }
  }
  .btn {
    display: block;
    width: 90%;
    line-height: 0.9rem;
    margin: 0.84rem auto;
    background-color: #3b6c49;
    color: #fff;
    border-radius: 0.1rem;
  }
  @import '../../common/scss/variable.scss';
  @import '../../common/scss/global.scss';
  .fenxiangshangcheng{
    height: 100%;
    padding: 1.33rem 0.56rem;
    .container{
      height: 100%;
      background-color: #fff;
      border-radius: 0.1rem;
      .top{
        height: 1.88rem;
        overflow: hidden;
        color: rgb(51, 51, 51);
        font-size: 0.4rem;
        text-align: center;
        .saoyisao{
          margin-top: 0.82rem;
        }
        .title{
          margin-top: 0.28rem;
        }
      }
      .center{
        margin:0.87rem auto 0 auto;
        padding: 0.27rem;
        width: 3.6rem;
        height: 3.6rem;
        border: 1px solid rgb(153, 153, 153);
        border-radius: 0.2rem;
        .erweimaPic{
          width: 100%;
          height: 100%;
        }
      }
      .bottom{
        margin: 1rem auto;
        background-color: $primary-color;
        font-size: $font-size-medium-xx;
        line-height: 0.9rem;
        width: 4.6rem;
        border-radius: 0.1rem;
        text-align: center;
      }
    }
  }
</style>
