<template>
    <div class="goumaishangping">
        <div class="top" @click="$router.push('/dizhi?address=' + 1)">
            <img src="../../assets/imgs/more@2x.png" class="right">
            <img src="../../assets/imgs/shouhuodizhi@2x.png" class="left">
            <p class="name-mobile">
                <span>姓名：{{address ? address.receiver : ''}}</span>
                <i>电话：{{address ? address.mobile : ''}}</i>
            </p>
            <p class="address">
                收货地址：
                <i>{{address ? address.province : ''}}</i>
                <i>{{address ? address.city : ''}}</i>
                <i>{{address ? address.area : ''}}</i> {{address ? address.address : ''}}
            </p>
        </div>
        <div class="item">
            <img :src="thingInfo.pic" alt="">
            <div class="content">
                <p>{{thingInfo.name}}</p>
                 <div class="guige">包装：{{guige}}</div>
                <i>￥{{formatAmount(price)}}</i>
                <span>X{{number}}</span>
              <div v-show="payType !== '1' && payType !== '2' && payType !== '3'" class="yunfei">
                <span>运费：{{formatAmount(freight)}}</span>
              </div>
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
                    <img :class="['xuanzhong', status == 0 ? '' : 'show']" src="../../assets/imgs/unchoosed.png" alt="">
                </div>
                <div class="chongzhi" @click="changeStatus(1)">
                    <img class="zhifu" src="../../assets/imgs/weixinchongzhi@2x.png">
                    微信支付
                    <img :class="['xuanzhong', status == 1 ? 'show' : '']" src="../../assets/imgs/xuanzhong@2x.png" alt="">
                    <img :class="['xuanzhong', status == 1 ? '' : 'show']" src="../../assets/imgs/unchoosed.png" alt="">
                </div>
        </div>
        <div class="footer">
            <div class="f-left">
                <span class="price">￥{{formatAmount(price * number + freight)}}</span>
                <span class="total">总计：</span>
            </div>
            <div class="f-right" @click="buy">确认购买</div>
        </div>
      <toast ref="mytoast" :text="text"></toast>
    </div>
</template>
<script>
import {
  queryAddressDetail,
  queryDefaultAddress,
  palceOrder,
  shopBill,
  payment,
  neigouProductDetail,
  queryYunfei
} from "api/baohuo";
import { setCookie, getCookie } from "common/js/cookie";
import { queryConfig, queryAmount, thingDrtail, orderDetail, cloudPayment, outOrderDetail, payOutOrder } from "api/baohuo";
import { formatImg, formatAmount } from "common/js/util";
import { getUser, getUserById } from "api/user";
import { initPay } from "common/js/weixin";
import toast from "base/toast/toast";
export default {
  data() {
    return {
      userinfo: {},
      options: {},
      address: {},
      code: "",
      thingInfo: [],
      number: "",
      status: 1,
      text: '',
      guige: '',
      num: 0,
      price: 0,
      payType: '',
      freight: 0    // 运费
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    changeStatus(status) {
      this.status = status;
    },
    success() {
      this.loading = false;
      this.text = '充值成功';
      this.$refs.toast.show(this.checkUser);
    },
    error(err) {
      this.loading = false;
      this.text = '充值失败';
      this.$refs.toast.show();
    },
    cancel() {
      this.loading = false;
    },
    queryYunfei() {
      // debugger;
      console.log(this.thingInfo);
      // console.log(this.list[this.proIdx]);
      if(!this.address) {
        return;
      }
      this.loading = true;
      queryYunfei({
        productCode: this.thingInfo.code,
        specsCode: this.specsCode,
        quantity: this.number,
        province: this.address.province,
        kind: 1
      }).then((res) => {
        this.loading = false;
        this.freight = res.yunfei;
      }).catch(() => { this.loading = false })
    },
    buy() {
      if(this.payType === '2') {
        // 云仓订单支付
        let codeList = [];
        codeList.push(this.orderCode);
        cloudPayment(codeList, this.status).then(data => {
          if (data.isSuccess && this.status === 0) {
            this.text = '支付成功';
            this.$refs.mytoast.show();
            setTimeout(() => {
              this.$router.back();
            }, 500);
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
        }).catch(() => this.loading = false);
      } else if(this.payType === '3') {
        // 出货订单支付
        let codeList = [];
        codeList.push(this.orderCode);
        payOutOrder({
          codeList: codeList,
          payType: this.status
        }).then(data => {
          if (data.isSuccess && this.status === 0) {
            this.text = '支付成功';
            this.$refs.mytoast.show();
            setTimeout(() => {
              this.$router.back();
            }, 500);
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
        }).catch(() => this.loading = false);
      } else {
        let options = {
          address: this.address.address,
          area: this.address.area,
          city: this.address.city,
          mobile: this.address.mobile,
          province: this.address.province,
          signer: this.address.receiver,
          // productCode: getCookie("shangpincode"),
          specsCode: this.specsCode,
          quantity: this.number,
          applyNote: this.applyNote
        };
        palceOrder(options).then(res => {
          let codeList = res;
          payment(codeList, this.status).then(res => {
            if (res.isSuccess && this.status === 0) {
              this.text = '支付成功';
              this.$refs.mytoast.show();
              setTimeout(() => {
                this.$router.back();
              }, 500);
            } else if (this.status === 1) {
              let wxConfig = {
                appId: res.appId, // 公众号名称，由商户传入
                timeStamp: res.timeStamp, // 时间戳，自1970年以来的秒数
                nonceStr: res.nonceStr, // 随机串
                wechatPackage: res.wechatPackage,
                signType: res.signType, // 微信签名方式：
                paySign: res.paySign // 微信签名
              };
              initPay(wxConfig, this.success, this.error, this.cancel);
            }
          });
        });
      }
    }
  },
  mounted() {
    this.payType = this.$route.query.pay;
    if (this.payType === "1") {
      // 内购订单付款
      let orderCode = this.$route.query.code;
      thingDrtail(orderCode).then(res => {
        res.pic = formatImg(res.pic);
        res.name = res.productName;
        this.specsCode = res.specsCode;
        this.number = res.quantity;
        this.guige = res.specsName;
        this.thingInfo = res;
        this.price = res.price;
      });
    } else if (this.payType === "2") {
      // 云仓商品付款
      this.orderCode = this.$route.query.code;
      orderDetail({
        code: this.orderCode
      }).then(res => {
        res.pic = formatImg(res.pic);
        res.name = res.productName;
        this.specsCode = res.specsCode;
        this.number = res.quantity;
        this.guige = res.specsName;
        this.thingInfo = res;
        this.price = res.price;
      });
    } else if (this.payType === "3") {
      // 出货商品付款
      this.orderCode = this.$route.query.code;
      outOrderDetail(this.orderCode).then(res => {
        res.pic = formatImg(res.pic);
        res.name = res.productName;
        this.specsCode = res.specsCode;
        this.number = res.quantity;
        this.guige = res.specsName;
        this.thingInfo = res;
        this.price = res.price;
      });
    }else {
      let code = this.$route.query.code;
      this.specsCode = this.$route.query.specsCode;
      this.number = this.$route.query.number;
      this.num = this.$route.query.num;   // 规格索引
      neigouProductDetail(code).then(res => {
        queryDefaultAddress().then(res => {
          this.address = res[0];
          this.queryYunfei();
        });
        res.pic = formatImg(res.pic);
        this.thingInfo = res;
        this.guige = this.thingInfo.specsList[this.num].name;
        this.price = this.thingInfo.specsList[this.num].price;
      });

    }
    queryDefaultAddress().then(res => {
      this.address = res[0];
    });
  },
  components: {
    toast
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
        /*position: absolute;*/
        top: 1.15rem;
        left: 0;
        font-size: $font-size-small;
        color: $primary-color;
      }
      span {
        width: 1.2rem;
        line-height: 0.5rem;
        /*position: absolute;*/
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
  .yunfei {
    height: 0.3rem;
    line-height: 0.3rem;
    font-size: 0.28rem;
    text-align: right;
  }
}
</style>

