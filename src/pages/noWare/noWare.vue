<template>
    <div class="woyaochuhuo">
      <div class="top" @click="$router.push('/dizhi?address=' + 3)">
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
      <div class="orders-content" v-show="list.length">
        <scroll :data="list"
                :hasMore="hasMore"
                @pullingUp="getPageProducts">
          <div class="item" v-for="(item, index) in list">
              <img :src="item.pic" alt="">
              <div class="content">
                  <div>
                    <p>产品名称：{{item.name}}
                      <p>规格：{{item.specsList[0].name}}</p>
                      <p>数量：{{item.specsList[0].number}}</p>
                      <p>价格：¥{{formatAmount(item.specsList ? item.specsList[0].priceList[0].price : 0)}}</p>
                    </p>
                  </div>
                  <!-- <i>规格：{{item.product.specsList[0].name}}</i> -->
                  <span @click="prodectDetail(item.code, index)">购买</span>
              </div>
          </div>
        </scroll>
      </div>
      <div v-show="!list.length" class="no-result-wrapper">
        <no-result title="抱歉，暂无明细"></no-result>
      </div>
      <div :class="['mask',flag ? 'show' : '']" @click="close"></div>
      <div :class="['buypart',buypartFlag ? 'show' : '']" v-if="detail">
        <div class="title">
          <div class="title-pic">
            <img :src="detail.pic" alt="">
          </div>
          <div class="title-right">
            <p>产品名称：{{detail.name}}</p>
            <span>请选择</span>
            <i @click="close">X</i>
            <p><span>运费：{{freight}}</span></p>
          </div>
        </div>
        <div class="packaging">
          <p>规格</p>
          <div class="select">
            <span v-for="(item,index) in detail.specsList" :code="item.code" @click="chooseSize(index)" :class="[num === index ? 'active' : '']">{{item.name}}</span>
          </div>
        </div>
        <div class="total-money">
          <div class="left">
            <i class="text">合计：</i>
            <i class="symbol">￥</i>
            <i class="sum">{{formatAmount(specsList[curIndex] ? specsList[curIndex].priceList[0].price * number : 0)}}</i>
          </div>
          <div class="right">
            <span class="diamonds right-item" @click="add">+</span>
            <input class="num right-item" @input="handleChange" type="number" v-model="number"></span>
            <span class="diamonds right-item" @click="sub">-</span>
          </div>
        </div>
        <div class="buypart-bottom" @click="confirm()">
          提交订单
        </div>
      </div>
      <full-loading :title="title" v-show="loading"></full-loading>
      <toast ref="toast" :text="text"></toast>
      <confirm ref="confirm" :text="confirmText" :isAlert="isAlert" @confirm="handleConfirm"></confirm>
    </div>
</template>
<script>
import { getUser, getUserById } from "api/user";
import {
  queryProduct,
  queryDefaultAddress,
  getCloudDetail,
  shopBill,
  checkRed,
  queryYunfei
} from "api/baohuo";
import { formatImg, formatAmount, getUserId } from "common/js/util";
import { setCookie } from "../../common/js/cookie";
import FullLoading from 'base/full-loading/full-loading';
import Toast from 'base/toast/toast';
import Confirm from 'base/confirm/confirm';
import Scroll from 'base/scroll/scroll';
import NoResult from 'base/no-result/no-result';

export default {
  data() {
    return {
      confirmText: '',
      isAlert: true,
      tipshow: false,
      buypartFlag: false,
      flag: false,
      userinfo: {},
      list: [],
      specsList: [],
      prodNum: [],
      detail: {},
      address: {},
      text: "",
      num: 0,
      number: 1,
      toUser: "",
      productSpecsCode: '',
      curIndex: 0,
      title: '正在载入...',
      loading: true,
      start: 1,
      limit: 10,
      hasMore: true,
      freight: 0,   // 运费,
      proIdx: 0
    };
  },
  methods: {
    handleChange(e) {
      this.prodNum[this.curIndex] = this.number;
    },
    formatAmount(price) {
      return formatAmount(price);
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
    close() {
      this.changeFlag();
      this.changebuypartFlag();
    },
    genghuan(index) {
      this.curIndex = index;
      // this.number = this.prodNum[index];
      // console.log(this.number);
      this.detail = this.list[index];
      this.changeFlag();
      this.changebuypartFlag();
      this.num = this.detail.specsList.findIndex(v => v.code == this.specsList[this.curIndex].code);
    },
    //选购产品数量+1
    add() {
      this.number++;
      this.queryYunfei();
      this.prodNum[this.curIndex] = this.number;
    },
    // 选购产品数量-1
    sub() {
      if (this.number >= 2) {
        this.number--;
      }
      this.prodNum[this.curIndex] = this.number;
    },
    checkUser(userId) {
      checkRed(userId).then(res => {
        setCookie('isWare', res.isWare);
        if (res.result == '4') {
          this.redirectPage(`您需要充值门槛费${formatAmount(res.chargeAmount)}元`, '/recharge');
        } else if (res.result == "0") {
          this.redirectPage(`您需要再购买${formatAmount(res.redAmount)}元的云仓`, '/threshold');
        } else if (res.result == '1') {
          // this.redirectPage(`您需要先购买${formatAmount(res.amount)}元的授权单`, res.isWare === '1' ? '/woyaochuhuo' : '/chuhuoNoWare');
          this.redirectPage(`您需要先购买${formatAmount(res.amount)}元的授权单`, '/woyaochuhuo');
        } else if (res.result == '2') {
          // this.redirectPage(`您需要先购买${formatAmount(res.amount)}元的升级单`, res.isWare === '1' ? '/woyaochuhuo' : '/chuhuoNoWare');
          this.redirectPage(`您需要先购买${formatAmount(res.amount)}元的升级单`, '/woyaochuhuo');
        } else if (res.result == '3') {
          this.redirectPage(`您的门槛余额已经高于${formatAmount(res.minAmount)}元，请前去购买云仓`, '/threshold');
        } else {
          this.$router.push('/home');
        }
      });
    },
    redirectPage(text, url) {
      this.confirmText = text;
      this.$refs.confirm.show();
      this.url = url;
    },
    handleConfirm() {
      this.$router.push(this.url);
    },
    confirm() {
      this.loading = true;
      this.title = '下单中...';
      let options = {
        address: this.address.address,
        area: this.address.area,
        city: this.address.city,
        province: this.address.province,
        mobile: this.address.mobile,
        quantity: this.number,
        productSpecsCode: this.specsList[this.curIndex].code,
        receiver: this.address.receiver
      };
      shopBill(options).then(res => {
        this.loading = false;
        if (res.isSuccess || res.length) {
          // this.setCookie('temp', {
          //   quantity: this.number,
          //   specsName: this.specsList[this.curIndex].name,
          //   pic: this.list
          // });
          this.text = '购买成功！';
          this.$refs.toast.show();
          this.$router.push('/buyCloud/noWarePay?code=' + res);
          // this.checkUser(getUserId());
        } else {
          this.text = '购买失败！';
          this.$refs.toast.show();
        }
      }).catch(() => this.loading = false);
    },
    prodectDetail(code, index) {
      this.genghuan(index);
      this.proIdx = index;
      this.queryYunfei();
    },
    chooseSize(index) {
      this.num = index;
      this.specsList[this.curIndex] = this.detail.specsList[index];
      this.queryYunfei();
    },
    getPageProducts() {
      this.loading = true;
      queryProduct({
        start: this.start,
        limit: this.limit,
        level: this.level,
        status: '2'
      }).then((res) => {
        this.loading = false;
        let specsList = [];
        let prodNum = [];
        res.list.map((item) => {
          item.specsList.map((v) => {
            v.priceList.map((h) => {
              if(h.level === this.level) {
                specsList.push(v);
              }
            });
          });
          item.pic = formatImg(item.pic);
          item.specsList.map((v) => {
            prodNum.push(v.quantity);
          })
        });
        this.list = this.list.concat(res.list);
        this.specsList = specsList;
        if (res.list.length < this.limit || res.totalCount <= this.limit) {
          this.hasMore = false;
        }
        this.start++;
      })
    },
    queryYunfei() {
      // console.log(this.list[this.proIdx]);
      if(!this.address) {
        return;
      }
      this.loading = true;
      queryYunfei({
        productCode: this.list[this.proIdx].code,
        specsCode: this.specsList[this.curIndex].code,
        quantity: this.number,
        province: this.address.province,
        kind: 1
      }).then((res) => {
        this.loading = false;
        this.freight = res.yunfei;
      }).catch(() => { this.loading = false })
    },
  },
  mounted() {
    Promise.all([
      getUser(),
      queryDefaultAddress()
    ]).then(([res, res1]) => {
      this.loading = false;
      this.level = res.level;
      this.address = res1[0];
      this.getPageProducts();
    }).catch(() => this.loading = false);
  },
  components: {
    Toast,
    Confirm,
    FullLoading,
    Scroll,
    NoResult
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.woyaochuhuo {
  background-color: #f7f7f7;
  height: 100%;
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
  .header {
    height: 1.8rem;
    padding: 0.3rem 0.8rem;
    background-color: #fff;
    position: relative;
    img {
      width: 0.15rem;
      position: absolute;
      top: 50%;
      right: 0.3rem;
      transform: translateY(-50%);
      &.left {
        left: 0.3rem;
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
        span {
          float: right;
        }
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
  .footer {
    width: 100%;
    line-height: 1rem;
    position: fixed;
    padding-left: 0.3rem;
    bottom: 0;
    background-color: #fff;
    span,
    i {
      float: left;
    }
    span {
      font-size: $font-size-medium-s;
      color: #333;
    }
    i {
      font-size: $font-size-medium-x;
      color: $primary-color;
    }
    .rigth {
      float: right;
      width: 2.1rem;
      color: #fff;
      font-size: $font-size-medium-x;
      background-color: $primary-color;
      text-align: center;
    }
  }
}
</style>
