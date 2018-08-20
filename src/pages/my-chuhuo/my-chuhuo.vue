<template>
  <div class="intentionalAgent">
    <div class="header-first">
      <div class="header-top">
        <p class="now-balance">总金额</p>
        <p class="money-balance">{{ allAmount / 1000 }}</p>
      </div>
    </div>
    <div class="item clearfix" v-for="(item,index) in list">
      <div class="top clearfix">
        <span class="user">提交人：{{item.realName || item.nickName}}</span>
        <span class="status">{{status[item.status]}}</span>
      </div>
      <div class="info" :class="{ active: heightActive === index }" ref="divInfo">
        <div class="downward" @click="changeHeight(index)">></div>
        <p>订单编号：{{item.code}}</p>
        <p>订单类型：{{item.kind}}</p>
        <p>下单时间：{{item.applyDatetime}}</p>
        <p>收货人：{{item.signer}}（{{item.mobile}}）</p>
        <p>收货地址：<i>{{item.province}}</i><i>{{item.city}}</i><i>{{item.area}}</i><i>{{item.address}}</i></p>
      </div>
      <div class="pic">
        <img :src="formatImg(item.pic)" alt="">
        <div class="content">
          <p>{{item.productName}}</p>
          <p style="padding-top:0.1rem;">{{item.productSpecsName}}</p>
          <i>￥{{item.price/1000}}</i>
          <span>{{item.quantity}}{{item.productSpecsName}}</span><span class="status">{{item.kind == '2' ? '购买云仓' : '云仓提货'}}</span>
        </div>
      </div>
    </div>
    <toast ref="toast" :text="toastText"></toast>
  </div>
</template>
<script>
  import Toast from 'base/toast/toast';
  import { myChuHuo, receiveNromalOrder,cencelChuHuoOrder} from "api/baohuo";
  import { formatDate, formatImg } from "common/js/util";
  import { getUser, getUserById } from "api/user";
  import { getDictList } from 'api/general';
  export default {
    data() {
      return {
        index: "",
        list: [],
        hightShow: false,
        num: "",
        status: {},
        heightActive: '',
        toastText: '',
        allAmount: 0
      };
    },
    methods: {
      changeHeight(index) {
        this.heightActive = this.heightActive === index ? '' : index;
      },
      formatImg(img) {
        return formatImg(img);
      },
      check() {
        // 请求订单
        myChuHuo([]).then(res => {
          this.allAmount = res.allAmount;
          console.log(res.allAmount);
          if (res.page.length <= 1) {
          }
          res.page.forEach(function () {
            res.applyDatetime = formatDate(res.applyDatetime);
          });
          this.list = res.page;
        });
        getDictList('out_order_status').then((res) => {
          res.map((item) => {
            this.status[item.dkey] = item.dvalue;
          });
        })
      }
    },
    mounted() {
      this.check();
    },
    components: {
      Toast
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/base.scss";
  .intentionalAgent {
    background-color: #f7f7f7;
    height: 100%;
    .fl {
      float: left;
    }
    .header-first {
      height: 2.4rem;
      background: url("../../assets/imgs/background@2x.png");
      text-align: center;
      color: #fff;
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
    }
    .item {
      margin-top: 0.2rem;
      background-color: #fff;
      .top {
        line-height: 0.8rem;
        color: #333;
        border-bottom: 1px solid #eee;
        .user {
          float: left;
          margin-left: 0.35rem;
          font-size: $font-size-small-s;
        }
        .status {
          float: right;
          color: $primary-color;
          font-size: $font-size-small;
          margin-right: 0.3rem;
        }
      }
      .info {
        padding: 0.3rem;
        border-bottom: 1px solid #eee;
        background-color: #fff;
        font-size: $font-size-small;
        height: 0.9rem;
        overflow: hidden;
        position: relative;
        &.active {
          height: auto;
        }
        p + p {
          margin-top: 0.36rem;
        }
        p {
          i {
            margin-left: 0.2rem;
          }
        }
        .downward {
          position: absolute;
          top: 0;
          right: 0;
          padding: 0.3rem;
          color: $primary-color;
          transform: rotateZ(90deg);
        }
        .status {
          float: right;
          color: #72a52c;
          font-size: 0.24rem;
        }
      }
      .pic {
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
            font-size: $font-size-small;
            border-radius: 0.1rem;
            color: #333;
            text-align: right;
            &.status {
              top: 0.5rem;
              color: #72a52c;
            }
          }
        }
      }
      .total {
        padding: 0.3rem;
        border-bottom: 1px solid #eee;
        font-size: $font-size-medium-s;
        color: #333;
        text-align: right;
        p + p {
          margin-top: 0.18rem;
        }
      }
    }
  }
</style>
