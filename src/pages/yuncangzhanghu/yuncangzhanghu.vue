<template>
  <div class="threshold">
    <div class="header">
      <div class="header-top">
        <p class="now-balance">当前余额 （元）</p>
        <p class="money-balance">{{formatAmount(account)}}</p>
      </div>
      <div class="header-bottom">
        <div class="header-bottom-left fl" @click="$router.push('/woyaochuhuo')">
          <img src="../../assets/threshold/chongzhi.png" alt="">
          <span>我要出货</span>
          <i class="line"></i>
        </div>
        <div class="header-bottom-right fl" @click="$router.push('/woyaozhihuan?clear=1')">
          <img src="../../assets/threshold/goumaiyuncang.png" alt="">
          <span>我要置换</span>
        </div>
      </div>
    </div>
    <div class="item" v-for="item in list" @click="$router.push('/yuncangzhanghu/huopinjilu?code=' + item.code + '&productCode=' + item.productCode)">
      <img :src="formatImg(item.product.pic)" alt="">
        <div class="content">
          <p>产品名称: {{item.productName}}</p>
          <p style="padding-top: 0.2rem;">数量: {{item.quantity}}</p>
          <p style="padding-top: 0.2rem;">规格: {{item.specsName}}</p>
        </div>
    </div>
    <full-loading :title="title" v-show="loading"></full-loading>
  </div>
</template>
<script>
import FullLoading from 'base/full-loading/full-loading';
import {
  getCloud,
  getCloudDetail,
  getCloudList,
  productDetail
} from "api/baohuo";
import { formatDate, formatImg, formatAmount } from "common/js/util";
import { setCookie, getCookie } from "common/js/cookie.js";
export default {
  name: "threshold",
  data() {
    return {
      loading: false,
      title: '正在加载...',
      list: [],
      account: 0,
      accountNumber: ""
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    formatImg(pic) {
      return formatImg(pic);
    }
  },
  created() {
    //获取用户云仓账户
    this.loading = true;
    Promise.all([
      getCloud(),
      getCloudList()
    ]).then(([res1, res2]) => {
      this.loading = false;
      this.account = res1.amount;
      this.list = res1.list;
    });
  },
  components: {
    FullLoading
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.threshold {
  background-color: #f7f7f7;
  height: 100%;
  .fl {
    float: left;
  }
  .header {
    height: 3.4rem;
    background: url("../../assets/imgs/background@2x.png");
    text-align: center;
    color: #fff;
    margin-bottom: 0.2rem;
    .header-top {
      height: 2.5rem;
      padding-top: 0.6rem;
      .now-balance {
        font-size: $font-size-small;
      }
      .money-balance {
        font-size: $font-size-large-xxxxx;
        margin-top: 0.42rem;
      }
    }
    .header-bottom {
      height: 0.9rem;
      background-color: rgba(0, 0, 0, 0.04);
      font-size: $font-size-medium-x;
      > div {
        width: 50%;
        line-height: 0.9rem;
        img {
          width: 0.3rem;
          margin-right: 0.18rem;
          vertical-align: text-top;
        }
        .line {
          float: right;
          width: 1px;
          height: 0.3rem;
          background-color: #fff;
          margin-top: 0.3rem;
        }
      }
    }
  }
  .item {
    padding: 0.2rem 0.3rem;
    background-color: #fff;
    overflow: hidden;
    border-bottom: 1px solid #eee;
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
        top: 0;
        right: 0;
        font-size: $font-size-medium-x;
        border-radius: 0.1rem;
        color: #333;
        text-align: center;
      }
    }
  }
}
</style>
