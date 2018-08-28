<template>
  <div class="buycloud">
    <div class="goodsdetail">
      <slider v-if="banners.length">
        <div class="home-slider" v-for="item in banners" :key="item">
          <img :src="item">
        </div>
      </slider>
      <div class="center">
        <p class="title">{{detail.name}}</p>
        <p class="tip">{{detail.slogan}}</p>
        <div class="price">
          <p class="oldPrice">市场价：￥{{formatAmount(detail.price)}}</p>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="link">
        <div class="service">
          <img class="img" src="../../assets/imgs/kefu@2x.png">
          <p class="text">客服</p>
        </div>
        <div class="car" @click="$router.push('/cart')">
          <img class="img" src="../../assets/imgs/gouwuche@2x.png">
          <p class="text">购物车</p>
        </div>
      </div>
      <div class="shopCar" @click="productDetail(0)">加入购物车</div>
      <div class="buy" @click="productDetail(1)">立即购买</div>
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
          <p>库存：{{detail.specsList[num].stockNumber}}</p>
        </div>
      </div>
      <div class="packaging">
        <p>规格</p>
        <div class="select">
          <span v-for="(item,index) in detail.specsList" :code="item.code" @click="chooseSize(item.code,index,$event)" :class="[num === index ? 'active' : '']">{{item.name}}</span>
        </div>
      </div>
      <div class="total-money">
        <div class="left" v-if="detail.specsList">
          <i class="text">合计：</i>
          <i class="symbol">￥{{formatAmount(this.price * this.number)}}</i>
          <i class="sum"></i>
        </div>
        <div class="right">
          <span class="diamonds right-item" @click="add">+</span>
          <input class="num right-item" v-model="number">
          <span class="diamonds right-item" @click="sub">-</span>
        </div>
      </div>
      <div class="buypart-bottom">
        <div class="confirm" @click="confirm(detail.code)">确定</div>

      </div>
    </div>
    <toast ref="mytoast" :text="text"></toast>
    <full-loading :title="title" v-show="loading"></full-loading>
  </div>
</template>
<script>
import { queryProduct, productDetail, cloudBill, toCart } from "api/baohuo";
import { getUser, getUserById } from "api/user";
import { formatImg, formatAmount } from "common/js/util";
import { getCookie } from "common/js/cookie";
import toast from "base/toast/toast";
import NoResult from 'base/no-result/no-result';
import Slider from 'base/slider/slider';
import FullLoading from 'base/full-loading/full-loading';
export default {
  data() {
    return {
      loading: false,
      title: '正在加载...',
      tipshow: false,
      buypartFlag: false,
      flag: false,
      level: "",
      list: [],
      detail: [],
      options: {
        productSpecsCode: ""
      },
      specsIndex: [],
      curProductIdx: 0,
      i: 0,
      num: 0,
      number: 1,
      text: "",
      orderCode: [],
      banners: [],
      loop: false,
      total: 0,
      buyNow: false,
      price: 0
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    changeTipShow() {
      this.tipshow = !this.tipshow;
    },
    //变换遮罩层显示与隐藏
    changeFlag() {
      this.flag = !this.flag;
    },
    //我的商品详情展示与隐藏
    changebuypartFlag() {
      this.buypartFlag = !this.buypartFlag;
    },
    confirm(code) {
      if(this.buyNow) {
        this.buy(code);
      } else {
        this.toCart();
      }
    },
    //确认商品
    buy(code) {
      let ref = this;
      this.options.specsCode = this.detail.specsList[this.num].code;
      this.options.quantity = this.number;
      cloudBill(this.options).then(res => {
        this.text = "提交成功";
        this.$refs.mytoast.show();
        this.orderCode.push(res.code);
        this.$router.push(
        "/buyCloud/tijiaodingdan?code=" +
          code +
          "&number=" +
          ref.number +
          "&highUserId=" +
          ref.options.highUserId +
          "&orderCode=" +
          this.orderCode +
          "&specsCode=" +
          this.options.specsCode
        );
      });
    },
    genghuan() {
      this.changeFlag();
      this.changebuypartFlag();
      this.num = 0;
    },
    //选购产品数量+1
    add() {
      this.number++;
      // this.total =
    },
    // 选购产品数量-1
    sub() {
      if (this.number >= 2) {
        this.number--;
      }
    },
    //选择规格
    chooseSize(code,index) {
      this.num = index;
      // this.specsIndex[this.curProductIdx] = index;
      this.specsCode = code;
      this.specsList.map((item) => {
        if(item.code === code) {
          this.price = item.price.price;
        }
      })
    },
    //选择规格
    _chooseSize(index) {
      this.number = index;
    },
    //产品详情查询
    productDetail(boolean) {
      this.buyNow = !!boolean;
      this.genghuan();
    },
    tiaozhuan() {
      this.$router.push("/home");
    },
    toCart() {
      this.options.productSpecsCode = this.detail.specsList[this.num].code;
      this.options.quantity = this.number;
      this.options.level = this.level;
      toCart(this.options).then((res) => {
        if(res.code) {
          this.text = "添加成功";
          this.$refs.mytoast.show();
          this.changeFlag();
          this.changebuypartFlag();
        }
      })
    },
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${formatImg(imgs)})`
      };
    }
  },
  mounted() {
    this.code = this.$route.query.code;
    this.loading = true;
    getUser().then((res) => {
      this.level = res.level;
      productDetail({
        code: this.code,
        level: this.level
      }).then((data) => {
        this.loading = false;
        let advPic = data.advPic.split('||').map(p => formatImg(p));
        if(advPic.length > 1) {
          this.loop = true;
        }
        let specsList = data.specsList;
        data.pic = formatImg(data.pic);
        this.banners = advPic;
        this.specsList = specsList;
        this.detail = data;
        this.price = this.specsList[0].price.price;
      })
    });
  },
  components: {
    toast,
    NoResult,
    Slider,
    FullLoading
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.buycloud {
  background-color: #f7f7f7;
  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.7);
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    &.show {
      display: block;
    }
  }
  .goodsdetail{
    position: fixed;
    top: 0;
    bottom: 1rem;
    width: 100%;
    overflow: auto;
    background-color: #f7f7f7;
    /*.home-slider img {*/
      /*height: 8rem;*/
    /*}*/
  }

  /* 商品介绍 */
  .center{
    padding: 0.28rem 0.24rem;
    background-color: #fff;
  }
  .center .title{
    display: block;
    font-size: 0.32rem;
    color: rgb(51, 51, 51);
    line-height: 0.4rem;
  }
  .center .tip{
    margin-top: 0.1rem;
    font-size: 0.24rem;
    color: rgb(102, 102, 102);
  }
  .center .price{
    margin-top: 0.25rem;
    font-size: 0.24rem;
    color: rgb(153, 153, 153);
    overflow: hidden;
  }
  .center .price .newPrice{
    display: inline-block;
    color: rgb(252,68,24);
  }
  .center .price .newPrice>text{
    font-size: 0.36rem;
  }
  .center .price .oldPrice{
    display: inline-block;
    vertical-align: middle;
  }

  /* 商品详情 */
  .detail{
    padding: 0 0.24rem;
    margin-top: 0.2rem;
    background-color: #fff;
  }
  .detail .title{
    padding: 0.28rem 0;
    display: block;
    border-bottom: 1px solid #eee;
  }
  .detail .title .text{
    padding-left: 0.19rem;
    border-left: 0.06rem solid #72a52c;
    font-size: 0.28rem;
    color: rgb(51, 51, 51);
    display: block;
  }
  .detail .detailImg{
    margin-top: 0.2rem;
    width: 100%;
  }

  /* 底部 */
  .footer{
    position: fixed;
    left: 0;
    bottom: 0;
    overflow: hidden;
    background-color: #fff;
    width: 100%;
    height: 1rem;
  }
  .footer>div{
    float: left;
    height: 1rem;
    line-height: 1rem;
    font-size: 0.28rem;
  }
  .footer .link{
    width: 2.9rem;
    overflow: hidden;
  }
  .footer .link>div{
    float: left;
    width: 50%;
    text-align: center;
    line-height: 1;
  }
  .footer .link .img{
    width: 0.4rem;
    display: block;
    margin: 0 auto;
    padding-top: 0.1rem;
  }
  .footer .link .text{
    display: inline-block;
    font-size: 0.2rem;
    margin-top: 0.1rem;
  }
  .footer .link .car{
    border-left: 1px solid #eee;
  }
  .footer .shopCar,.buy{
    width: 2.3rem;
    line-height: 1rem;
    text-align: center;
    color: #fff;
    background-color: rgb(255, 122, 0);
  }
  .footer .shopCar{
    background-color: rgb(255, 168, 0);
  }
  .buypart {
    width: 100%;
    height: 6rem;
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
          min-width: 1.18rem;
          padding: 0 0.1rem;
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
        .right-item {
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
      color: #fff;
      text-align: left;
      font-size: $font-size-medium-xx;
      white-space: nowrap;
      div {
        display: inline-block;
        width: 50%;
        text-align: center;
      }
      .toCart {
        background-color: $primary-color;
      }
      .confirm {
        background: #72a52c;
        width: 100%;
      }
    }
  }
}
</style>
