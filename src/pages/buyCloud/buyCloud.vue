<template>
  <div class="buycloud">
    <div :class="['tip',tipshow ? 'none' : '']">
      <span>支出相关：啊啊啊啊啊啊啊啊啊啊啊啊啊啊</span>
      <i @click="changeTipShow">
        <img src="../../assets/threshold/close.png" alt="">
      </i>
    </div>
    <div class="item" v-for="item in list">
      <img :src="item.pic" alt="">
      <div class="content">
        <p>{{item.name}}</p>
        <i>包装：{{item.specsList[0].name}}</i>
        <span @click="prodectDetail(item.code)">购买云仓</span>
      </div>
    </div>
    <div :class="['mask',flag ? 'show' : '']" @click="genghuan"></div>
    <div :class="['buypart',buypartFlag ? 'show' : '']">
      <div class="title">
        <div class="title-pic">
          <img :src="detail.pic" alt="">
        </div>
        <div class="title-right">
          <p>{{detail.name}}</p>
          <span>请选择</span>
          <i @click="genghuan">X</i>
        </div>
      </div>
      <div class="packaging">
        <p>包装</p>
        <div class="select">
          <span v-for="(item,index) in detail.specsList" :code="item.code" @click="chooseSize(index,$event)" :class="[num === index ? 'active' : '']">{{item.name}}</span>
        </div>
      </div>
      <div class="packaging">
        <p>规格</p>
        <div class="select">
          <span v-for="(item,index) in detail.specsList" :code="item.code" @click="_chooseSize(index,$event)" :class="[number === index ? 'active' : '']">{{item.weight}}g</span>
        </div>
      </div>
      <div class="total-money">
        <div class="left">
          <i class="text">合计：</i>
          <i class="symbol">￥</i>
          <i class="sum">{{detail.specsList[num].price.price / 1000 * detail.specsList[num].number}}</i>
        </div>
        <div class="right">
          <span class="diamonds" @click="add">+</span>
          <span class="num">{{detail.specsList[num].number}}</span>
          <span class="diamonds" @click="sub">-</span>
        </div>
      </div>
      <div class="buypart-bottom" @click="buy">
        确认购买
      </div>
    </div>
    <toast ref="mytoast" :text="text"></toast>
  </div>
</template>
<script>
import {queryProduct,productDetail,cloudBill} from 'api/baohuo';
import {getUser,getUserById} from 'api/user';formatImg
import {formatImg} from 'common/js/util';
import toast from 'base/toast/toast'
export default {
    data(){
        return{
            tipshow : false,
            buypartFlag:false,
            flag:false,
            level:'',
            list : [],
            detail:{
                name:'',
                specsList:[
                    {
                        name:'',
                        weight:'',
                        price:{
                            price:0,
                        },
                    },
                ],
            },
            options:{
              productSpecsCode:'',
            },
            i:0,
            num:0,
            number:0,
            text:'',
        }
    },
    methods:{
        changeTipShow(){
          this.tipshow = !this.tipshow
        },

        //变换遮罩层显示与隐藏
        changeFlag(){
            this.flag = !this.flag;
        },

        //我的商品详情展示与隐藏
        changebuypartFlag(){
            this.buypartFlag = !this.buypartFlag;
        },

    
        genghuan(){
            this.changeFlag()
            this.changebuypartFlag()
            this.num = 0
        },

        //选购产品数量+1
        add(){
            this.detail.specsList[this.num].number++
        },

        // 选购产品数量-1
        sub(){
            if(this.detail.specsList[this.num].number >= 2) {
                this.detail.specsList[this.num].number--
            }
        },

        //选择规格
        chooseSize(index) {
          this.num = index
        },

        //选择规格
        _chooseSize(index) {
          this.number = index
        },

        //产品详情查询
        prodectDetail(code){
            this.genghuan()

            //保存this
            let self = this
            productDetail(code,this.level).then(res => {
                res.pic = formatImg(res.pic)
                self.detail = res
                console.log(self.detail)
            })
        },

        //产品购买
        buy(){
            this.options.productSpecsCode = this.detail.specsList[this.num].code
            this.options.quantity = this.detail.specsList[this.num].number
            cloudBill(this.options).then(res => {
                this.text = '提交成功'
                this.$refs.mytoast.show(this.tiaozhuan)
            })
        },
        tiaozhuan(){
          this.$router.push('/home')
        }
    },
    mounted(){
        getUser().then(res => {
            this.level = res.level
            this.options = {
                address:res.address,
                area:res.area,
                city:res.city,
                mobile:res.mobile,
                province:res.province,
            }

            //商品列表查询
            queryProduct(res.level).then(res => {
                res.list.map(function(item){
                  item.pic = formatImg(item.pic)
                })
                this.list = res.list
            })
        })

    },
    components:{
      toast
    }
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.buycloud {
  background-color: #f7f7f7;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .show {
    display: block !important;
  }
  .tip {
    height: 0.6rem;
    line-height: 0.6rem;
    padding-left: 0.3rem;
    background-color: #fff9e3;
    color: #feaa00;
    font-size: $font-size-small;
    &.none {
      display: none;
    }
    i {
      display: inline-block;
      width: 0.6rem;
      height: 0.6rem;
      float: right;
      text-align: center;
      margin-right: 12px;
      img {
        width: 0.24rem;
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
        color: #999;
      }
      span {
        width: 1.2rem;
        line-height: 0.5rem;
        position: absolute;
        top: 1rem;
        right: 0;
        background-color: $primary-color;
        font-size: $font-size-small;
        border-radius: 0.1rem;
        color: #fff;
        text-align: center;
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    display: none;
    .total {
      padding-left: 0.3rem;
      line-height: 1rem;
      color: #333;
      font-size: $font-size-medium-s;
      i {
        color: $primary-color;
      }
    }
    .payment {
      width: 2.1rem;
      line-height: 1rem;
      text-align: center;
      background-color: $primary-color;
      color: #fff;
      font-size: $font-size-medium-x;
    }
  }
  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.7);
    position: fixed;
    top: 0;
    left: 0;
    display: none;
    &.show {
      display: block;
    }
  }
  .buypart {
    width: 100%;
    height: 8rem;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    display: none;
    z-index: 9;
    &.show {
      display: block;
    }
    // padding: 0 0.3rem;
    .title {
      height: 2.1rem;
      position: relative;
      border-bottom: 1px solid #eee;
      margin: 0 0.3rem;
      .title-pic {
        width: 2.26rem;
        height: 2.26rem;
        position: absolute;
        left: 0;
        bottom: 0.28rem;
        padding: 0.03rem;
        border-radius: 0.1rem;
        background-color: #fff;
        img {
          width: 2.2rem;
          height: 2.2rem;
        }
      }
      .title-right {
        margin-left: 2.46rem;
        position: relative;
        overflow: hidden;
        p {
          margin-top: 0.2rem;
          font-size: $font-size-medium;
          color: #333;
        }
        span {
          margin-top: 0.4rem;
          font-size: $font-size-medium;
          color: #999;
        }
        i {
          width: 0.34rem;
          line-height: 0.34rem;
          line-height: 0.34rem;
          font-size: $font-size-medium;
          text-align: center;
          color: #333;
          border: 1px solid #333;
          border-radius: 50%;
          position: absolute;
          top: 0.2rem;
          right: 0;
        }
      }
    }
    .packaging {
      height: 1.9rem;
      border-bottom: 1px solid #eee;
      overflow: hidden;
      margin: 0 0.3rem;
      p {
        margin-top: 0.3rem;
        margin-bottom: 0.4rem;
        font-size: $font-size-medium-xx;
        color: #333;
      }
      .select {
        overflow: hidden;
        span {
          float: left;
          width: 1.18rem;
          line-height: 0.64rem;
          border: 1px solid #ccc;
          text-align: center;
          font-size: $font-size-medium-s;
          border-radius: 0.1rem;
          border: 1px solid $primary-color;
          &.active {
            background-color: $primary-color;
            color: #fff;
          }
        }
        span + span {
          margin-left: 0.2rem;
        }
      }
    }
    .total-money {
      height: 1.2rem;
      border-bottom: 1px solid #eee;
      margin: 0 0.3rem;
      > div {
        width: 50%;
        height: 100%;
        float: left;
        overflow: hidden;
      }
      .left {
        i {
          float: left;
          margin-top: 0.4rem;
        }
        .text {
          font-size: $font-size-medium;
        }
        .symbol {
          font-size: $font-size-small;
          color: $primary-color;
        }
        .sum {
          font-size: $font-size-medium-xx;
          color: $primary-color;
        }
      }
      .right {
        span {
          margin-top: 0.4rem;
          float: right;
          text-align: center;
          line-height: 0.5rem;
        }
        .diamonds {
          width: 0.5rem;
          height: 0.5rem;
          background-color: #f5f5f5;
          font-size: $font-size-large-ss;
          color: #888;
        }
        .num {
          width: 0.9rem;
          font-size: $font-size-medium-x;
          color: #333;
        }
      }
    }
    .buypart-bottom {
      height: 0.9rem;
      line-height: 0.9rem;
      background-color: $primary-color;
      color: #fff;
      text-align: center;
      font-size: $font-size-medium-xx;
    }
  }
}
</style>
