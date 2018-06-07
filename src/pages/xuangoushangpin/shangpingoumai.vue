<template>
    <div class="goumaishangping">
        <div class="top" @click="$router.push('/dizhi')">
            <img src="../../assets/imgs/more@2x.png" class="right">
            <img src="../../assets/imgs/shouhuodizhi@2x.png" class="left">
            <p class="name-mobile">
                <span>姓名：{{address.receiver}}</span>
                <i>电话：{{address.mobile}}</i>
            </p>
            <p class="address">
                收货地址：
                <i>{{address.province}}</i>
                <i>{{address.city}}</i>
                <i>{{address.area}}</i> {{address.address}}
            </p>
        </div>
        <div class="item">
            <img :src="options.pic" alt="">
            <div class="content">
                <p>{{options.name}}</p>
                <!-- <div class="guige">包装：{{options.baozhuan}}   规格：{{options.guige}}g</div> -->
                <i>￥{{options.price}}</i>
                <span>X{{options.quantity}}</span>
            </div>
        </div>
        <div class="word">
            <span>卖家嘱咐：</span>
            <input v-model="options.applyNote" type="text" placeholder="说点什么">
        </div>
        <div class="footer">
            <div class="f-left">
                <span class="price">￥{{options.price * options.quantity}}</span>
                <span class="total">总计：</span>
            </div>
            <div class="f-right" @click="buy">确认购买</div>
        </div>
    </div>
</template>
<script>
import {queryAddressDetail,queryDefaultAddress,shopBill} from 'api/baohuo'
import {setCookie,getCookie} from 'common/js/cookie.js';
import {formatImg} from 'common/js/util';
import {getUser,getUserById} from 'api/user';
export default {
    data(){
        return{
            userinfo:{},
            options:{},
            address:{},
            code:'',
        }
    },
    methods:{
        buy(){
            shopBill(this.options).then(res => {
                
            })
        },
        changeOptions(options){
            this.options.province = options.province
            this.options.city = options.city
            this.options.area = options.area
            this.options.address = options.address
            this.options.mobile = options.mobile
            this.options.receiver = options.receiver
        }
    },
    mounted(){

        //获取用户等级
        let level = getCookie('level')

        //获取用户订单详情
        this.options = JSON.parse(getCookie('options'))
        console.log(this.options)

        //查询详情地址
        let code = this.$route.query.code
        console.log(code)
        if(this.code){
            queryAddressDetail(code).then(res => {
                this.address = res
                console.log(this.address)
                this.changeOptions(this.address)
            })
        }else {
            queryDefaultAddress().then(res =>{
                this.address = res[0]
                this.changeOptions(this.address)                
            })
        }
    },
}
</script>

<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.goumaishangping {
  height: 100%;
  background-color: #f7f7f7;
  .top {
    height: 1.8rem;
    padding: 0.3rem 0.8rem;
    background-color: #fff;
    position: relative;
    img {
      width: 0.3rem;
      position: absolute;
      top: 50%;
      right: 0.3rem;
      transform: translateY(-50%);
      &.left {
        left: 0.28rem;
      }
      &.right {
        width: 0.2rem;
      }
    }
    .name-mobile {
      position: relative;
      i {
        position: absolute;
        left: 2.7rem;
      }
    }
    p {
      font-size: $font-size-medium;
      color: #333;
      &.address {
        margin-top: 0.24rem;
        font-size: $font-size-small;
        line-height: 0.4rem;
      }
    }
  }
  .item {
    margin-top: 0.2rem;
    padding: 0.2rem 0.3rem;
    background-color: #fff;
    overflow: hidden;
    img {
      float: left;
      width: 1.8rem;
      height: 1.8rem;
    }
    .content {
      margin-left: 2rem;
      position: relative;
      p {
        font-size: $font-size-medium-s;
        color: #333;
        line-height: 0.4rem;
      }
      i {
        position: absolute;
        top: 1.15rem;
        left: 0;
        font-size: $font-size-small;
        color: $primary-color;
      }
      span {
        width: 1.2rem;
        line-height: 0.5rem;
        position: absolute;
        top: 1rem;
        right: 0;
        font-size: $font-size-small;
        border-radius: 0.1rem;
        color: #333;
        text-align: center;
      }
      .guige{
          margin-top: 0.2rem;
          font-size: $font-size-small;
          color: rgb(153,153,153);
      }
    }
  }
  .word{
        margin-top: 0.2rem;
        font-size: $font-size-medium;
        color:#333;
        background-color: #fff;
        line-height: 0.9rem;
        span{
            float: left;
            width: 1.8rem;
            text-align: right;
        }
        input{
            // margin-left: 1.8rem;
        }
  }
  .footer{
      line-height: 1rem;
      overflow: hidden;
      position: fixed;
      bottom: 0;
      left: 0;
      background-color: #fff;
        .f-left{
            float: left;
            width: 5.4rem;
            overflow: hidden;
            .total{
                float: right;
                font-size: $font-size-medium-s;
                color: #333;
            }
            .price{
                margin-right: 0.2rem;
                float: right;
                font-size: $font-size-medium-x;
                color: $primary-color;
            }
        }
        .f-right{
            width: 2.1rem;
            margin-left: 5.4rem;
            text-align: center;
            background-color: $primary-color;
            color: #fff;
            font-size: $font-size-medium-x;
        }
  }
}
</style>

