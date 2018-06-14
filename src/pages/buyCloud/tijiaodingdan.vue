<template>
    <div class="goumaishangping">
        <div class="top" @click="$router.push('/dizhi?address=' + 2)">
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
            <img :src="thingInfo.pic" alt="">
            <div class="content" v-if="thingInfo.specsList">
                <p>{{thingInfo.name}}</p>
                <i>￥{{thingInfo.specsList[0].price.price / 1000}}</i>
                <span>X{{number}}</span>
            </div>
        </div>
        <div class="word">
            <span>卖家嘱咐：</span>
            <input v-model="options.applyNote" type="text" placeholder="说点什么">
        </div>
        <div class="center">
            <div class="mode">充值方式</div>
            <div class="chongzhi" @click="changeStatus(0)">
                <img class="zhifu" src="../../assets/imgs/xianxiachongzhi@2x.png">
                余额支付
                <img :class="['xuanzhong', status == 0 ? 'show' : '']" src="../../assets/imgs/xuanzhong@2x.png" alt="">
            </div>
            <div class="chongzhi" @click="changeStatus(1)">
                <img class="zhifu" src="../../assets/imgs/weixinchongzhi@2x.png">
                微信支付
                <img :class="['xuanzhong', status == 1 ? 'show' : '']" src="../../assets/imgs/xuanzhong@2x.png" alt="">
            </div>
        </div>
        <div class="footer" v-if="thingInfo.specsList">
            <div class="f-left">
                <span class="price">￥{{thingInfo.specsList[0].price.price * number / 1000}}</span>
                <span class="total">总计：</span>
            </div>
            <div class="f-right" @click="buy">确认购买</div>
        </div>
    </div>
</template>
<script>
import {
  queryAddressDetail,
  queryDefaultAddress,
  palceOrder,
  shopBill,
  cloudPayment,
  productDetail,
  cloudBill
} from "api/baohuo";
import { setCookie, getCookie } from "common/js/cookie.js";
import { formatImg } from "common/js/util";
import { getUser, getUserById } from "api/user";
import { initPay } from "common/js/weixin";
export default {
  data() {
    return {
      userinfo: {},
      options: {},
      address: {},
      code: "",
      thingInfo: [],
      number: "",
      productSpecsCode: "",
      status: 0
    };
  },
  methods: {
    changeStatus(status) {
      this.status = status;
    },
    buy() {
      let code = this.$route.query.code;
      let options = {
        address: this.address.address,
        area: this.address.area,
        city: this.address.city,
        mobile: this.address.mobile,
        province: this.address.province,
        signer: this.address.code,
        productSpecsCode: this.productSpecsCode,
        quantity: this.number,
        applyNote: this.applyNote,
        toUser: this.$route.query.highUserId
      };
      cloudBill(options).then(res => {
        let code = res.code;
        cloudPayment([code], this.status).then(res => {
          let data = res;
          if (this.status === 0) {
            alert("支付成功！");
          } else if (this.status === 1) {
            let wxConfig = {
              appId: data.appId, // 公众号名称，由商户传入
              timeStamp: data.timeStamp, // 时间戳，自1970年以来的秒数
              nonceStr: data.nonceStr, // 随机串
              wechatPackage: data.wechatPackage,
              signType: data.signType, // 微信签名方式：
              paySign: data.paySign // 微信签名
            };
            initPay(wxConfig, this.success, this.error, this.cancel);
          }
        });
      });
    }
  },
  mounted() {
    //获取用户等级
    let level = getCookie("level");
    let code = this.$route.query.code;
    this.code = code;
    let number = this.$route.query.number;
    this.number = number;
    setCookie("yuncangshuliang", this.number);
    setCookie("yuncangcode", this.code);
    productDetail(code, level).then(item => {
      item.pic = formatImg(item.pic);
      this.thingInfo = item;
      this.productSpecsCode = item.specsList[0].price.productSpecsCode;
    });
    queryDefaultAddress().then(res => {
      this.address = res[0];
      // this.changeOptions(this.address)
    });
  }
};
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
      .guige {
        margin-top: 0.2rem;
        font-size: $font-size-small;
        color: rgb(153, 153, 153);
      }
    }
  }
  .word {
    margin-top: 0.2rem;
    font-size: $font-size-medium;
    color: #333;
    background-color: #fff;
    line-height: 0.9rem;
    span {
      float: left;
      width: 1.8rem;
      text-align: right;
    }
    input {
      // margin-left: 1.8rem;
    }
  }
  .footer {
    line-height: 1rem;
    overflow: hidden;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    .f-left {
      float: left;
      width: 5.4rem;
      overflow: hidden;
      .total {
        float: right;
        font-size: $font-size-medium-s;
        color: #333;
      }
      .price {
        margin-right: 0.2rem;
        float: right;
        font-size: $font-size-medium-x;
        color: $primary-color;
      }
    }
    .f-right {
      width: 2.1rem;
      margin-left: 5.4rem;
      text-align: center;
      background-color: $primary-color;
      color: #fff;
      font-size: $font-size-medium-x;
    }
  }
}
.center {
  margin-top: 0.2rem;
  background-color: #fff;
  .mode {
    line-height: 0.6rem;
    padding-left: 0.3rem;
    color: #999;
    font-size: $font-size-small;
  }
  .chongzhi {
    line-height: 1rem;
    padding: 0 0.3rem;
    font-size: $font-size-medium-x;
    border-top: 1px solid #eee;
    .zhifu {
      width: 0.5rem;
      margin-right: 0.2rem;
      vertical-align: sub;
    }
    .xuanzhong {
      width: 0.4rem;
      float: right;
      margin-top: 0.5rem;
      transform: translateY(-50%);
      display: none;
      &.show {
        display: block;
      }
    }
  }
}
</style>

