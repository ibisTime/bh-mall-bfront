<template>
    <div class="goumaishangping">
        <!-- <div class="top" @click="$router.push('/dizhi?address=' + 2)">
            <img src="../../assets/imgs/more@2x.png" class="right">
            <img src="../../assets/imgs/shouhuodizhi@2x.png" class="left">
            <p class="name-mobile">
                <span>姓名：{{address.receiver ? address.receiver : ''}}</span>
                <i>电话：{{address.mobile ? address.mobile : ''}}</i>
            </p>
            <p class="address">
                收货地址：
                <i>{{address.province ? address.province : ''}}</i>
                <i>{{address.city ? address.city : ''}}</i>
                <i>{{address.area ? address.area : ''}}</i> {{address.address ? address.address : ''}}
            </p>
        </div> -->
        <div class="item">
            <img :src="thingInfo.pic" alt="">
            <div class="content" v-if="thingInfo.specs">
                <p>{{thingInfo.name}}</p>
                <p>规格：{{thingInfo.specs.name}}</p>
                <i>￥{{thingInfo.specsPrice.price / 1000}}</i>
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
        <div class="footer" v-if="thingInfo.specs">
            <div class="f-left">
                <span class="price">￥{{thingInfo.specsPrice.price * number / 1000}}</span>
                <span class="total">总计：</span>
            </div>
            <div class="f-right" @click="buy">确认购买</div>
        </div>
        <full-loading :title="title" v-show="loading"></full-loading>
        <confirm ref="confirm" :text="confirmText" :confirmBtnText="confirmBtnText" :isAlert="isAlert" @confirm="handleConfirm"></confirm>
        <toast ref="toast" :text="text"></toast>
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
  cloudBill,
  productDetailBySpec
} from "api/baohuo";
import { setCookie, getCookie } from "common/js/cookie";
import { formatImg, getUserId, formatAmount } from "common/js/util";
import { getUser, getUserById } from "api/user";
import { checkRed, getLevel } from 'api/baohuo';
import Toast from 'base/toast/toast';
import FullLoading from 'base/full-loading/full-loading';
import Confirm from 'base/confirm/confirm';
import { initPay } from "common/js/weixin";

export default {
  data() {
    return {
      isAlert: true,
      confirmText: '',
      loading: false,
      text: "",
      title: "正在载入...",
      confirmBtnText: '确定',
      userinfo: {},
      options: {},
      address: {},
      code: "",
      thingInfo: [],
      number: "",
      productSpecsCode: "",
      status: 0,
      orderCode: '',
      codeList: []
    };
  },
  methods: {
    changeStatus(status) {
      this.status = status;
    },
    buy() {
      this.title = "提交中...";
      this.loading = true;
      // let code = this.$route.query.code;
      // let options = {
      //   address: this.address.address,
      //   area: this.address.area,
      //   city: this.address.city,
      //   mobile: this.address.mobile,
      //   province: this.address.province,
      //   signer: this.address.code,
      //   productSpecsCode: this.productSpecsCode,
      //   quantity: this.number,
      //   applyNote: this.applyNote,
      //   toUser: this.$route.query.highUserId
      // };
      this.codeList = this.orderCode.split(',');
      cloudPayment(this.codeList, this.status).then(data => {
        if (this.status === 0) {
          this.success();
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
    },
    cancel() {
      this.loading = false;
    },
    error() {
      this.loading = false;
      this.text = '支付失败！';
      this.$refs.toast.show();
    },
    success() {
      this.loading = false;
      this.text = '支付成功！';
      this.$refs.toast.show();
      this.checkUser(getUserId());
    },
    handleConfirm() {
      this.$router.push(this.url);
    },
    checkUser(userId) {
      Promise.all([
        checkRed(userId),
        getLevel(this.level)
      ]).then(([res, levelInfo]) => {
        setCookie('isWare', res.isWare);
        if (res.result == '4') {
          this.redirectPage(`您需要充值门槛费${formatAmount(res.chargeAmount)}元`, '/recharge');
        } else if (res.result == "0") {
          this.redirectPage(`您需要先购买${formatAmount(res.redAmount)}元的云仓`, '/threshold');
        } else if (res.result == '1') {
          this.confirmBtnText = '我要出货';
          this.redirectPage(`购买云仓已完成，${levelInfo[0].name}授权单${formatAmount(res.amount)}元`, '/woyaochuhuo');
        } else if (res.result == '2') {
          this.confirmBtnText = '我要出货';
          this.redirectPage(`购买云仓已完成，${levelInfo[0].name}升级单${formatAmount(res.amount)}元`, '/woyaochuhuo');
        } else if (res.result == '3') {
          this.redirectPage(`您的门槛余额已经高于${formatAmount(res.minAmount)}元，请前去购买云仓`, '/threshold');
        } else {
          setTimeout(() => {
            this.$router.push('/home');
          }, 300)
        }
      }).catch(() => {});
    },
    redirectPage(text, url) {
      this.confirmText = text;
      this.$refs.confirm.show();
      this.url = url;
    },
    handleFontSize() {
      // 设置网页字体为默认大小
      WeixinJSBridge.invoke('setFontSizeCallback', {
        'fontSize': 0
      });
      // 重写设置网页字体大小的事件
      WeixinJSBridge.on('menu:setfont', function () {
        WeixinJSBridge.invoke('setFontSizeCallback', {
          'fontSize': 0
        });
      });
    }
  },
  mounted() {
    //获取用户等级
    let specsCode = this.$route.query.specsCode;
    this.level = '';
    let code = this.$route.query.code;
    this.orderCode = this.$route.query.orderCode;
    this.code = code;
    let number = this.$route.query.number;
    this.number = number;
    setCookie("yuncangshuliang", this.number);
    setCookie("yuncangcode", this.code);
    this.loading = true;
    // console.log(info);
    // Promise.all([
    //   productDetailBySpec(this.info),
    //   queryDefaultAddress()
    // ]).then(([item, res]) => {
    //   this.loading = false;
    //   item.pic = formatImg(item.pic);
    //   this.thingInfo = item;
    //   this.productSpecsCode = item.specs.code;
    //   this.address = res.length ? res[0] : {};
    // }).catch(() => this.loading = false);
    Promise.all([
      getUser(),
      queryDefaultAddress()
    ]).then(([info, item, res]) => {
      this.level = info.level;
      productDetailBySpec({
        level: info.level,
        specsCode: specsCode
      }).then((item) => {
        this.loading = false;
        item.pic = formatImg(item.pic);
        this.thingInfo = item;
        this.productSpecsCode = item.specs.code;
      });
      this.address = res.length ? res[0] : {};
    }).catch(() => this.loading = false);
  },
  components: {
    Toast,
    Confirm,
    FullLoading
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
