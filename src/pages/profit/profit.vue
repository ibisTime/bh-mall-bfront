<template>
  <div class="threshold">
    <div class="header-first">
      <div class="header-top">
        <p class="now-balance">总利润</p>
        <p class="money-balance">{{account / 1000}}</p>
      </div>
    </div>
    <div class="content">
      <div class="item" v-for="item in list">
        <div class="center">
          <div class="item-time">
            <p class="day">{{item.day}}日</p>
            <p class="minute">{{item.hour}}:{{item.minutes}}</p>
          </div>
          <img :src="item.bizNote.includes('充值') ? require('../../assets/threshold/shou.png') : require('../../assets/threshold/zhi.png') " alt="">
          <div class="detail">
            <p class="datail-money">{{item.transAmount / 1000}}</p>
            <p class="detail-text">{{item.remark}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getPerformance, queryBill, profit } from "api/baohuo";
  import { setCookie, getCookie } from "common/js/cookie";
  import { formatDate } from "common/js/util";
  export default {
    name: "yejizhanghu",
    data() {
      return {
        list: [],
        account: 0,
        accountNumber: ""
      };
    },
    methods: {},
    mounted() {
      //查询业绩账户流水
      profit({
        bizType: 'AJ_CELR'
      }).then(res => {
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
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../common/scss/variable.scss";
  .threshold {
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
      height: 1.4rem;
      border-bottom: 1px solid #eee;
      position: relative;
      .center {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        .item-time {
          display: inline-block;
          width: 1.23rem;
          margin-left: 0.3rem;
          text-align: center;
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
          display: inline-block;
          .datail-money {
            font-size: $font-size-large-s;
            color: #fe8472;
          }
          .detail-text {
            margin-top: 0.22rem;
            font-size: $font-size-small;
            color: #333;
          }
        }
      }
    }
  }
</style>
