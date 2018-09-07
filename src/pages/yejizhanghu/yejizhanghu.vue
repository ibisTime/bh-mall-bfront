<template>
  <div class="threshold">
    <div class="header">
      <div class="header-top">
        <p class="now-balance">业绩余额 （元）</p>
        <p class="money-balance">{{formatAmount(account)}}</p>
      </div>
      <div class="header-bottom">
        <div class="header-bottom-left fl" @click="$router.push('/recharge?type=TX_CNY&accountNumber=' + accountNumber)">
          <img src="../../assets/threshold/chongzhi.png" alt="">
          <span>充值</span>
          <i class="line"></i>
        </div>
        <div class="header-bottom-left fl" @click="$router.push('/yejizhanghu/quxian?accountNumber=' + accountNumber)">
          <img src="../../assets/threshold/chongzhi.png" alt="">
          <span>取现</span>
          <i class="line"></i>
        </div>
        <div class="header-bottom-right fl" @click="$router.push('/yejizhanghu/zhuanrumenkan?accountNumber=' + accountNumber)">
          <img src="../../assets/threshold/goumaiyuncang.png" alt="">
          <span>转入门槛</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="item" v-for="item in list">
        <div class="center">
        <div class="item-time">
          <p class="day">{{item.day}}日</p>
          <p class="minute">{{item.hour}}:{{item.minutes}}</p>
        </div>
        <img :src="item.inAmount !== '0' ? require('../../assets/threshold/shou.png') : require('../../assets/threshold/zhi.png') " alt="">
        <div class="detail">
          <p class="datail-money" :style="item.outAmount !== '0' && 'color: #a5ca64'">{{item.bizNote}}   {{formatAmount(item.transAmount)}}</p>
          <p class="detail-text">{{item.remark}}</p>
        </div>
        </div>
      </div>
    </div>
    <full-loading :title="title" v-show="loading"></full-loading>
  </div>
</template>
<script>
import FullLoading from 'base/full-loading/full-loading';
import { getPerformance, queryBill } from "api/baohuo";
import { setCookie, getCookie } from "common/js/cookie";
import { formatDate, formatAmount } from "common/js/util";
export default {
  name: "yejizhanghu",
  data() {
    return {
      list: [],
      account: 0,
      accountNumber: "",
      title: '正在加载...',
      loading: false
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    }
  },
  mounted() {
    //获取用户业绩账户
    this.loading = true;
    getPerformance().then(res => {
      this.accountNumber = res[0].accountNumber;
      this.account = res[0].amount;
      //查询业绩账户流水
      queryBill(res[0].accountNumber).then(res => {
        this.loading = false;
        res.list.map(function(item) {
          //格式化日期时间
          let date = new Date(item.createDatetime);
          let day = date.getDate();
          let hour = date.getHours();
          let minutes = date.getMinutes();
          day = day < 10 ? "0" + day : day;
          hour = hour < 10 ? "0" + hour : hour;
          minutes = minutes < 10 ? "0" + minutes : minutes;
          item.day = day;
          item.hour = hour;
          item.minutes = minutes;
        });
        this.list = res.list;
      });
    });
  },
  computed: {
    // 判断引入收入支出图片
    img: function() {
      this.list.map(function(item) {
        item.bizNote.includes("充值")
          ? require("../../assets/threshold/shou.png")
          : require("../../assets/threshold/zhi.png");
      });
    }
  },
  components: {
    FullLoading
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.threshold {
  .fl {
    float: left;
  }
  .header {
    height: 3.4rem;
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
    .header-bottom {
      height: 0.9rem;
      background-color: rgba(0, 0, 0, 0.04);
      font-size: $font-size-medium-x;
      > div {
        width: 33.33%;
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
    /*height: 1.4rem;*/
    /*border-bottom: 1px solid #eee;*/
    /*position: relative;*/
    position: relative;
    padding: 0.2rem 0.3rem;
    border-bottom: 1px solid #eee;
    .center {
      /*<!--position: absolute;-->*/
      /*<!--top: 50%;-->*/
      /*<!--transform: translateY(-50%);-->*/
      display: flex;
      width: 100%;
      align-items: center;
      .item-time {
        /*display: inline-block;*/
        /*width: 1.23rem;*/
        /*margin-left: 0.3rem;*/
        /*text-align: center;*/
        flex: 0 0 0.84rem;

        .day {
          font-size: $font-size-medium-xx;
          color: #333;
        }
        .minute {
          font-size: $font-size-small;
          color: #999;
          margin-top: 0.16rem;
        }
      }
      img {
        width: 0.72rem;
      }
      .detail {
        /*display: inline-block;*/
        padding-left: 0.2rem;
        .datail-money {
          /*<!--font-size: $font-size-large-s;-->*/
          /*<!--color: #fe8472;-->*/
          line-height: 1.1;
          font-size: $font-size-large-s;
          color: #fe8472;
        }
        .detail-text {
          /*margin-top: 0.22rem;*/
          margin-top: 0.1rem;
          font-size: $font-size-small;
          color: #333;
        }
      }
    }
  }
}
</style>
