<template>
    <div class="woyaozhihuan">
        <div class="goods">
            <div class="top  clearfix"  @click="$router.push('/woyaozhihuan/shangpinliebiao?flag=2');">
                云仓商品
            <span class="downward">></span>
            </div>
            <div :class="['pic',cloudDetailFlag ? 'show' : '']">
                <img :src="cloudDetailPic">
                <div class="content">
                    <p>{{cloudDetail.product.name}}</p>
                    <!--
                    <i>￥{{cloudDetail.specsList[count].price / 1000 * cloudDetail.specsList[count].number}}</i>
                    -->
                    <i>￥{{cloudDetail.specsList[count].price / 1000 * initNum}}</i>
                    <div class="guige">
                        <!--
                        <span>{{cloudDetail.specsList[count].number}}{{cloudDetail.specsList[count].name}}</span>
                        -->
                        <span>{{initNum}}{{cloudDetail.specsList[count].specsName}}</span>
                    </div>
                    <button class="huan" @click="_genghuan">更换规格</button>
                </div>
            </div>
        </div>
        <div class="goods">
            <div class="top  clearfix"  @click="$router.push('/woyaozhihuan/shangpinliebiao?flag=1');">
                库存商品
                <span class="downward">></span>
            </div>
            <div :class="['pic',detailFlag ? 'show' :'']">
                <img :src="detailPic">
                <div class="content">
                    <p>{{detail.name}}</p>
                    <i>￥{{detail.specsList[num].price.price / 1000 * detail.specsList[num].number}}</i>
                    <div class="guige">
                        <span>{{detail.specsList[num].number}}{{detail.specsList[num].name}}</span>
                    </div>
                    <button class="huan" @click="genghuan">更换规格</button>
                </div>
            </div>
            <div class="total clearfix">
                <span>置换总价</span>
                <span class="color">￥{{money / 1000}}</span>
            </div>
        </div>
        <div class="btn" @click="requestNode">确认置换</div>
        <div :class="['mask',flag ? 'show' : '']" @click="changeFlag"></div>
        <div :class="['buypart',buypartFlag ? 'show' : '']">
            <div class="title">
                <div class="title-pic">
                    <img :src="detailPic" alt="">
                </div>
                <div class="title-right">
                    <p>{{detail.name}}</p>
                    <span>请选择</span>
                    <i @click="genghuan">X</i>
                </div>
            </div>
            <div class="packaging">
                <p>规格</p>
                <div class="select">
                    <span
                      v-for="(item,index) in detail.specsList"
                      :code="item.code"
                      @click="chooseSize(item,index)"
                      :class="[num === index ? 'active' : '']"
                      >{{item.name}}</span>
                </div>
            </div>
            <div class="total-money">
                <div class="left">
                    <i class="text">合计：</i>
                    <i class="symbol">￥</i>
                    <i class="sum">{{detail.specsList[num].price.price / 1000 * detail.specsList[num].number}}</i>
                </div>
                <div class="right">
                    <span class="num">{{detail.specsList[num].number}}</span>
                </div>
            </div>
            <div class="buypart-bottom" @click="certain(num)">
                确认
            </div>
        </div>
        <div :class="['buypart',cloudFlag ? 'show' : '']">
            <div class="title">
                <div class="title-pic">
                    <img :src="cloudDetailPic">
                </div>
                <div class="title-right">
                    <p>{{cloudDetail.productName}}</p>
                    <span>请选择</span>
                    <i @click="_genghuan">X</i>
                </div>
            </div>
            <div class="packaging">
                <p>规格</p>
                <div class="select">
                    <span
                      v-for="(item,index) in cloudDetail.specsList"
                      :code="item.code"
                      @click="_chooseSize(item, index)"
                      :class="[count === index ? 'active' : '']"
                      >{{item.specsName}}</span>
                </div>
            </div>
            <div class="total-money">
                <div class="left">
                    <i class="text">合计：</i>
                    <i class="symbol">￥</i>
                    <!--<i class="sum">{{cloudDetail.specsList[count].price.price / 1000 * cloudDetail.specsList[count].number}}</i>-->
                    <i class="sum">{{cloudDetail.specsList[count].price / 1000 * initNum}}</i>
                </div>
                <div class="right">
                    <span class="diamonds right-item" @click="_add">+</span>
                    <!--<input class="num right-item" v-model="cloudDetail.specsList[count].number"></span>-->
                    <input class="num right-item" v-model="initNum">
                    <span class="diamonds right-item" @click="_sub">-</span>
                </div>
            </div>
            <div class="buypart-bottom" @click="_certain">
                确认
            </div>
        </div>
        <toast ref="mytoast" :text="text"></toast>
    </div>
</template>
<script>
import {
  productDetail,
  cloudBill,
  getCloudDetail,
  requestNode,
  queryMoney
} from "api/baohuo";
import { getUser, getUserById } from "api/user";
import { setCookie, getCookie } from "common/js/cookie.js";
import { formatDate, formatImg } from "common/js/util";
import toast from "base/toast/toast";
export default {
  data() {
    return {
      flag: false,
      buypartFlag: false,
      cloudFlag: false,
      level: "",
      detail: {
        name: '产品名称',
        specsList: [
          {
            price: {
              price: '0'
            }
          },
          { name: '0' }
        ]
      },
      // cloudDetail: {
      //   specsList: [
      //     { price: 0 }
      //   ]
      // },
      cloudDetail: {
        name: '产品名称',
        product: {
          name: '产品名称'
        },
        specsList: [
          { price: '0' },
          { specsCode: '规格名称' }
        ]
      },
      num: 0,
      count: 0,
      number: 0,
      number2: 0,
      detailPic: "",
      cloudDetailPic: "",
      money: 0,
      detailFlag: true,
      cloudDetailFlag: true,
      text: "",
      initNum: 1
    };
  },
  methods: {
    //提交置换
    requestNode() {
      // console.log(this.changeSpecsCode);
      // console.log(this.productSpecsCode);
      console.log(this.cloudDetail);
      console.log(this.detail);
      let options = {
        changeSpecsCode: this.changeSpecsCode || this.detail.specsList[0].price.specsCode,
        // productSpecsCode: this.cloudDetail.productSpecsCode,
        productSpecsCode: this.productSpecsCode || this.cloudDetail.specsList[0].specsCode,
        // quantity: this.cloudDetail.specsList[this.count].number
        quantity: this.initNum
      };
      requestNode(options).then(res => {
        this.text = "提交成功";
        this.$refs.mytoast.show(this.tiaozhuan);
      });
    },
    tiaozhuan() {
      this.$router.push("/home");
    },
    //查询置换价格
    queryMoney(index) {
      console.log(this.changeSpecsCode);
      if (this.cloudDetail.name !== "") {
        let options = {
          changeSpecsCode: this.changeSpecsCode,
          productSpecsCode: this.cloudDetail.specsList[this.count].specsCode,
          // quantity: this.cloudDetail.specsList[this.count].number
          quantity: this.initNum
        };
        if(!options.productSpecsCode) {
          alert('请选择云仓产品!');
          return
        }
        queryMoney(options).then(res => {
          this.detail.specsList[index].number = res.canChangeQuantity;
        });
      }
    },
    //变换遮罩层显示与隐藏
    changeFlag() {
      this.flag = !this.flag;
    },

    //我的商品详情展示与隐藏
    changebuypartFlag() {
      this.buypartFlag = !this.buypartFlag;
    },

    //云仓商品详情展示与隐藏
    changecloudFlag() {
      this.cloudFlag = !this.cloudFlag;
    },
    genghuan() {
      this.changeFlag();
      this.changebuypartFlag();
      if(!this.changeSpecsCode) {
        this.changeSpecsCode = this.detail.specsList[0].price.specsCode;
        setCookie("myDetail", JSON.stringify(this.detail));
      }
      this.queryMoney(this.num);
    },
    _genghuan() {
      this.changeFlag();
      this.changecloudFlag();
    },
    //选购产品数量+1
    // add() {
    //   // this.detail.specsList[this.num].number++;
    //   this.initNum++;
    // },
    //选购产品数量+1
    _add() {
      // this.cloudDetail.specsList[this.count].number++;
      this.initNum++;
    },
    // 选购产品数量-1
    // sub() {
    //   // if (this.detail.specsList[this.num].number >= 2) {
    //   //   this.detail.specsList[this.num].number--;
    //   // }
    //   if (this.initNum >= 2) {
    //     this.initNum--;
    //   }
    // },
    // 选购产品数量-1
    _sub() {
      // if (this.cloudDetail.specsList[this.count].number >= 2) {
      //   this.cloudDetail.specsList[this.count].number--;
      // }
      if (this.initNum >= 2) {
        this.initNum--;
      }
    },
    //选择规格
    chooseSize(item, index) {
      this.num = index;
      this.changeSpecsCode = item.code;
      this.queryMoney(index);
    },
    // choose_Size(index) {
    //   this.number = index;
    // },
    //选择规格
    _chooseSize(item, index) {
      this.count = index;
      this.productSpecsCode = item.specsCode;
    },
    // _choose_Size(index) {
    //   this.number2 = index;
    // },
    //确定规格
    certain(num) {
      this.genghuan();
      this.queryMoney(num);
      setCookie("myDetail", JSON.stringify(this.detail));
    },
    //确定规格
    _certain() {
      this._genghuan();
      setCookie("myDetail", JSON.stringify(this.detail));
      setCookie("cloudDetail", JSON.stringify(this.cloudDetail));
    }
  },
  mounted() {
    //库存商品信息
    if (JSON.parse(getCookie("myDetail")) !== null) {
      this.detail = JSON.parse(getCookie("myDetail"));
      // this.detail.specsList.number = this.detail[0].number
      this.detailPic = formatImg(this.detail.pic);
      // this.queryMoney(0);
    } else {
      this.detailFlag = false;
    }
    //云仓商品信息
    if (JSON.parse(getCookie("cloudDetail")) !== null) {
      this.cloudDetail = JSON.parse(getCookie("cloudDetail"));
      this.cloudDetailPic = formatImg(this.cloudDetail.product.advPic);
    } else {
      this.cloudDetailFlag = false;
    }
  },
  components: {
    toast
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
@import "../../common/scss/base.scss";
.woyaozhihuan {
  background-color: #f7f7f7;
  height: 100%;
  .goods {
    background-color: #fff;
    .top {
      padding: 0 0.3rem;
      line-height: 0.9rem;
      font-size: $font-size-medium-x;
      color: $color-text;
      border-bottom: 1px solid #eee;
      .downward {
        float: right;
      }
    }
    .pic {
      padding: 0.2rem 0.3rem;
      background-color: #fff;
      overflow: hidden;
      border-bottom: 1px solid #eee;
      display: none;
      &.show {
        display: block;
      }
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
        .guige {
          width: 1.2rem;
          line-height: 0.5rem;
          position: absolute;
          top: 0;
          right: 0;
          font-size: $font-size-medium-x;
          border-radius: 0.1rem;
          color: #333;
          > span {
            display: block;
          }
        }
        .huan {
          width: 1.2rem;
          height: 0.5rem;
          line-height: 0.5rem;
          text-align: center;
          position: absolute;
          top: 1.2rem;
          right: 0;
          font-size: $font-size-small;
          background-color: $primary-color;
          color: #fff;
          border-radius: 0.1rem;
        }
      }
    }
  }
  .goods + .goods {
    margin-top: 0.2rem;
    .total {
      padding: 0 0.3rem;
      line-height: 0.9rem;
      background-color: #fff;
      display: none;
      span {
        float: left;
        font-size: $font-size-medium-x;
        color: $color-text;
        &.color {
          margin-left: 0.9rem;
          color: $primary-color;
        }
      }
    }
  }
  .btn {
    width: 6.9rem;
    margin: 0.6rem auto;
    line-height: 0.9rem;
    background-color: $primary-color;
    color: #fff;
    border-radius: 0.1rem;
    font-size: $font-size-medium-xx;
    text-align: center;
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
      background-color: $primary-color;
      color: #fff;
      text-align: center;
      font-size: $font-size-medium-xx;
    }
  }
}
</style>
