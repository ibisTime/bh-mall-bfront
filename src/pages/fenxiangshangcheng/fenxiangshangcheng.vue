<template>
    <div class="fenxiangshangcheng">
        <div class="container">
            <div class="top">
                <p class="saoyisao">扫一扫</p>
                <p class="title">进入{{nickname}}的商城</p>
            </div>
            <div class="center">
                <div class="erweimaPic" id="qrcode"></div>
            </div>
            <div class="bottom" @click="share">分享商城</div>
        </div>
    </div>
</template>
<script>
const QRCode = require("js-qrcode");
import {getCookie} from 'common/js/cookie.js';
import {getUser,getUserById} from 'api/user';
import {initShare} from 'common/js/weixin'
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
        }
    },
    methods:{
        share(){
            initShare(this.info,this.success)
        },
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
@import '../../common/scss/variable.scss';
    .fenxiangshangcheng{
        height: 100%;
        background-image: url('../../assets/imgs/bg@2x.png');
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
