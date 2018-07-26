<template>
    <div>
        <div class="header full-screen-wrapper">
            <div class="head-left" 
                :class="{'sel-box': selModel === 'fw'}"
                @click="selLeftClick"
            >
                <div class="img-box">
                    <img src="../../assets/imgs/anti.png" alt="" 
                    :class="{selimg: selModel === 'fw'}">
                    <img src="../../assets/imgs/notanti.png" alt=""
                    :class="{selimg: selModel === 'sy'}">
                </div>
                <p>防伪码查询</p>
            </div>
            <div class="head-right"
                :class="{'sel-box': selModel === 'sy'}"
                @click="selRightClick"
            >
                <div class="img-box">
                    <img src="../../assets/imgs/notcounter.png" alt="" :class="{selimg: selModel === 'fw'}">
                    <img src="../../assets/imgs/counter.png" alt=""
                    :class="{selimg: selModel === 'sy'}">
                </div>
                <p>溯源码查询</p>
            </div>
            <img src="../../assets/imgs/select.png" alt="" class="sel-img" :class="{'selleft-img': selModel === 'fw', 'selright-img': selModel === 'sy'}">
        </div>
        <div class="container">
            <hr>
            <div class="tit">
                <span>{{claTxt}}</span>
                <p>46576879798067</p>
            </div>
            <div class="search-btn">
                <button @click="fwInquire">查询{{claTxt}}信息</button>
            </div>
            <div class="message-box" v-show="selModel === 'fw'">
                <div class="msg-img">
                    <img src="../../assets/imgs/antitrue.png" alt="">
                </div>
                <p>您所查询的防伪码正确！</p>
                <div class="msg-tit">
                    该防伪码已被查询[<span>{{fwdex}}</span>]次，以下是全部查询记录！
                </div>
            </div>
            <div class="sy-message" v-show="selModel === 'sy'">
                <div class="left-sel"><img src="../../assets/imgs/sel.png" alt=""></div>
                <div class="line"></div>
                <div class="right-msg">
                    <p class="msg-time">
                        <span>发货时间：</span>
                        <span>{{time}}</span>
                    </p>
                    <p class="f-name">
                        <span>发货人:</span>
                        <span>{{orderData.deliveName}}</span>
                    </p>
                    <p class="msg-order">
                        <span>订单号：</span>
                        <span>{{syData.orderCode}}</span>
                    </p>
                    <p class="s-name">
                        <span>收件人：</span>
                        <span>{{orderData.signer}}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { fwAnitCounter, syAnitCounter } from "api/account";
import { formatDate } from "common/js/util";
    export default {
        name: 'antiCounter',
        data(){
            return {
                selModel: 'fw',
                claTxt: '防伪码',
                fwdex: 0,
                syData: {},
                time: '',
                orderData: {}
            }
        },
        mounted(){
        
        },
        methods: {
            selLeftClick(){
                this.selModel = 'fw';
                this.claTxt = '防伪码';
            },
            selRightClick(){
                this.selModel = 'sy';
                this.claTxt = '溯源码';
            },
            fwInquire(){
                if(this.claTxt === '防伪码'){
                    fwAnitCounter(152992501591).then((data) => {
                        this.fwdex = data;
                    });
                }else{
                    syAnitCounter(153031047803).then((data) => {
                        this.syData = data;
                        this.orderData = data.orderData;
                        this.time = formatDate(data.orderData.applyDatetime);
                    });
                }
                
            }
        }
    }
</script>

<style scoped>
    .header{
        height: 2.40rem;
        text-align: center;
        color: #8f8f8f;
        font-size: 0.24rem;
        background-image: url('../../assets/imgs/antibj.png');
        display: flex;
        flex-direction: row;
        align-items:center;
        position: relative;
    }
    .sel-box{
        color: #fff;
    }
    .sel-img{
        position: absolute;
        bottom: 0;
        transform: translateX(-50%);
    }
    .selleft-img{
        left: 25%;
    }
    .selright-img{
        left: 75%;
    }
    .header>div{
        width: 50%;
    }
    .img-box>img{
        width: 0.54rem;
        display: none;
    }
    .img-box>.selimg{
        display: inline-block;
    }
    .header p{
        font-style: 'MicrosoftYaHei';
        margin-top: 0.30rem;
    }
    .container{
        padding: 0.20rem 0.30rem;
        background: #fff;
        font-style: 'PingFangSC-Regular';
    }
    hr{
        margin: 0 -0.3rem;
        border: 0.01rem solid #eee;
    }
    .tit{
        display: flex;
        flex-direction: row;
        height: 1rem;
        line-height: 1rem;
        font-size: 0.30rem;
    }
    .tit>span{
        color: #484848;
        margin-right: .76rem;
    }
    .tit>p{
        color: #333;
    }
    .search-btn{
        margin-top: 0.40rem;
        margin-bottom: 1rem;
    }
    .search-btn>button{
        width: 100%;
        height: 0.90rem;
        border-radius: 0.1rem;
        background: #72a52c;
        color: #fafafa;
        text-align: center;
        font-size: .3rem;
    }
    .search-btn>button:hover{
        color: #fff;
    }
    .msg-img{
        text-align: center;
    }
    .msg-img>img{
        width: 114px;
    }
    .message-box>p{
        font-size: 0.34rem;
        color: #484848;
        text-align: center;
        margin-top: .44rem;
        margin-bottom: .7rem;
    }
    .msg-tit{
        font-size: .22rem;
        color: #484848;
    }
    .msg-tit>span{
        color: #fc5858;
    }
    .sy-message{
        margin-top: 1rem;
        padding: 0 0.28rem;
        display: flex;
        flex-direction: row;
        align-items:center;
    }
    .line{
        display: inline-block;
        width: 30px;
        border: 1px solid #666;
    }
    .right-msg{
        height: 2.14rem;
        border-radius: 20px;
        color: #fff;
        background: #666;
        padding: .32rem;
        font-size: .2rem;
        width: 100%;
    }
    .right-msg>p{
        margin-top: .21rem;
    }
    .right-msg>p:nth-of-type(1){
        margin-top: 0;
    }
</style>