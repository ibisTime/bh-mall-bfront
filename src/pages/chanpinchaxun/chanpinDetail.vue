<template>
  <div class="buycloud">
    <div class="goodsdetail">
      <slider v-if="banners.length">
        <div class="home-slider" v-for="item in banners" :key="item">
          <img :src="item">
        </div>
      </slider>
      <div class="center">
        <p class="title">{{detail.product.name}}</p>
        <p class="tip">{{detail.product.slogan}}</p>
        <div class="price">
          <p class="oldPrice">市场价：￥{{formatAmount(detail.price)}}</p>
        </div>
        <div class="price" v-for="item in detail.specsList">
          <p class="oldPrice"><span>规格：{{item.specsName}}</span><span>价格：{{item.price}}</span><span>库存：{{item.quantity}}</span></p>
        </div>
      </div>
    </div>
    <toast ref="mytoast" :text="text"></toast>
    <full-loading :title="title" v-show="loading"></full-loading>
  </div>
</template>
<script>
import { queryProduct, getCloudDetail, cloudBill, toCart, getPercent, getCartList } from "api/baohuo";
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
      price: 0,
      telephone: null,
      view: true
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
    this.view = !!this.$route.query.v;
    this.loading = true;
    Promise.all([
      getUser(),
    ]).then(([res1]) => {
      this.level = res1.level;
      getCloudDetail(this.code).then((data) => {
        this.loading = false;
        let advPic = data.product.advPic.split('||').map(p => formatImg(p));
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
    })
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
    span {
      margin-right: 0.5rem;
    }
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
}
</style>
