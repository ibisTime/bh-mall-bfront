<template>
    <div class="fenxiangshangcheng">
        <div class="container">
            <div class="top">
                <p class="saoyisao">扫一扫</p>
                <p class="title">进入{{realName}}的商城</p>
            </div>
            <div class="center">
                <div class="erweimaPic" id="qrcode"></div>
            </div>
            <div class="bottom" @click="showMask">分享商城</div>
        </div>
        <share-mask ref="shareMask"></share-mask>
    </div>
</template>
<script>
import QRCode from 'js-qrcode';
import ShareMask from 'components/share-mask/share-mask';
import { initShare } from 'common/js/weixin';
import { getCookie } from 'common/js/cookie.js';
import { getUserById } from 'api/user';
import Logo from './logo.png';

export default {
    data() {
        return {
          wxUrl:'http://front.bhxt.hichengdai.com/xcx/?userId=',
          userId:'',
          realName:''
        };
    },
    mounted(){
      this.makeCode();
    },
    methods: {
      // 生成二维码
      makeCode() {
        this.userId = this.$route.query.userId || getCookie('userId');
        this.wxUrl += this.userId;
        getUserById(this.userId).then(res =>{
            this.realName = res.realName;
            this.initShare();
        });
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
      },
      // 初始化分享
      initShare() {
        initShare({
          title: this.realName + '的商城',
          desc: '扫一扫，进入' + this.realName + '的商城',
          link: location.href.split('#')[0] + '/#/fenxiangshangcheng?userId=' + this.userId,
          imgUrl: Logo
        });
      },
      showMask() {
        this.$refs.shareMask.show();
      }
    },
    components: {
      ShareMask
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';
    .fenxiangshangcheng {
        position: fixed;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: url('../../assets/imgs/bg@2x.png');

        .container {
            padding: 0.82rem;
            background-color: #fff;
            border-radius: 0.1rem;

            .top {
                overflow: hidden;
                text-align: center;
                font-size: 0.4rem;
                color: rgb(51, 51, 51);

                .title {
                    margin-top: 0.28rem;
                }
            }
            .center {
                margin: 0.87rem auto 0 auto;
                padding: 0.27rem;
                width: 3.6rem;
                height: 3.6rem;
                border: 1px solid rgb(153, 153, 153);
                border-radius: 0.2rem;

                .erweimaPic {
                    width: 100%;
                    height: 100%;
                }
            }
            .bottom {
                margin: 0.87rem auto 0;
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
