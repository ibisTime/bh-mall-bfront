<template>
  <div class="intentionalAgent">
    <div class="header-first">
      <div class="header-top">
        <p class="now-balance">总金额</p>
        <p class="money-balance">{{ formatAmount(allAmount) }}</p>
      </div>
    </div>
    <div class="orders-content">
      <scroll :data="list"
              :hasMore="hasMore"
              @pullingUp="getPageOrders">
        <div class="item clearfix" v-for="(item,index) in list">
          <div class="top clearfix">
            <span class="user">提交人：{{item.realName || item.nickName}}</span>
            <span class="status">{{status[item.status]}}</span>
          </div>
          <div class="info" :class="{ active: heightActive === index }" ref="divInfo">
            <div class="downward" @click="changeHeight(index)">></div>
            <p>订单编号：{{item.code}}</p>
            <p>订单类型：{{type[item.kind]}}</p>
            <p>下单时间：{{formatDate(item.applyDatetime)}}</p>
            <p>收货人：{{item.signer}}（{{item.mobile}}）</p>
            <p>收货地址：<i>{{item.province}}</i><i>{{item.city}}</i><i>{{item.area}}</i><i>{{item.address}}</i></p>
          </div>
          <div class="pic">
            <img :src="formatImg(item.pic)" alt="">
            <div class="content">
              <div class="inner-cont">
                <p>{{item.productName}}</p>
                <i>￥{{formatAmount(item.price)}}</i>
              </div>
              <div class="inner-cont" style="padding-top: 0.1rem;">
                <p style="line-height: 0.4rem;">规格：{{item.quantity}}{{item.specsName}}</p>
                <div class="total">总价：¥{{formatAmount(item.amount)}}</div>
              </div>
              <div class="btn-wrap">
                <div class="quxiao" @click="cancel(item.code)" v-if="item.status == '0' || item.status == '1'">取消</div>
                <div class="fukuan" @click="goPay(item.code)" v-if="item.status == '0'">付款</div>
                <div class="shouhuo" @click="shouhuo(item.code)" v-if="item.status == '3'">收货</div>
                <div class="wuliu" @click="wuliu(item.logisticsCode, item.logisticsCompany)" v-if="item.status == '3' || item.status == '4'">物流信息</div>
              </div>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <toast ref="toast" :text="toastText"></toast>
    <full-loading :title="title" v-show="loading"></full-loading>
  </div>
</template>
<script>
  import Toast from 'base/toast/toast';
  import Scroll from 'base/scroll/scroll';
  import FullLoading from 'base/full-loading/full-loading';
  import { myChuHuo, receiveNromalOrder,cencelChuHuoOrder} from "api/baohuo";
  import { formatDate, formatImg, formatAmount } from "common/js/util";
  import { getUser, getUserById } from "api/user";
  import { getDictList } from 'api/general';
  export default {
    data() {
      return {
        loading: false,
        title: '正在加载...',
        start: 1,
        limit: 10,
        hasMore: true,
        index: "",
        list: [],
        hightShow: false,
        num: "",
        status: {},
        type: {},
        heightActive: '',
        toastText: '',
        allAmount: 0
      };
    },
    methods: {
      formatAmount(amount) {
        return formatAmount(amount);
      },
      formatDate(date) {
        return formatDate(date);
      },
      changeHeight(index) {
        this.heightActive = this.heightActive === index ? '' : index;
      },
      formatImg(img) {
        return formatImg(img);
      },
      getPageOrders() {
        // 请求订单
        this.loading = true;
        Promise.all([
          myChuHuo({
            start: this.start,
            limit: this.limit,
            statusList: [],
            userId: this.userId
          }),
          getDictList('out_order_status'),
          getDictList('out_order_type')
        ]).then(([res1, res2, res3]) => {
          this.loading = false;
          if (res1.page.length < this.limit || res1.totalCount <= this.limit) {
            this.hasMore = false;
          }
          this.allAmount = res1.allAmount;
          res1.page.forEach(() => {
            res1.applyDatetime = formatDate(res1.applyDatetime);
          });
          this.list = this.list.concat(res1.page);
          this.start++;
          res2.map((item) => {
            this.status[item.dkey] = item.dvalue;
          });
          res3.map((item) => {
            this.type[item.dkey] = item.dvalue;
          });
          console.log(this.type);
        }).catch(() => { this.loading = false });
      },
      // getPageOrders() {
      //
      // }
    },
    mounted() {
      this.userId = this.$route.query.userId;
      this.getPageOrders();
    },
    components: {
      Toast,
      Scroll,
      FullLoading
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/base.scss";
  .intentionalAgent {
    background-color: #f7f7f7;
    .fl {
      float: left;
    }
    .header-first {
      height: 2.4rem;
      background: url("../../assets/imgs/background@2x.png");
      text-align: center;
      color: #fff;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
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
    .orders-content {
      position: absolute;
      top: 2.4rem;
      left: 0;
      width: 100%;
      bottom: 0;
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
            position: relative;
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: space-between;
            padding-left: 0.2rem;
            .inner-cont {
              display: flex;
            }
            p {
              flex: 1;
              line-height: 1.2;
              font-size: $font-size-medium-s;
              color: #333;
            }
            i {
              font-size: $font-size-small;
              color: $primary-color;
            }
            span {
              width: 2.2rem;
              line-height: 0.4rem;
              font-size: $font-size-small;
              border-radius: 0.1rem;
              color: #333;
              text-align: right;
              &.status {
                color: #72a52c;
              }
            }
            .btn-wrap {
              flex: 1;
              padding-top: 0.3rem;
              text-align: right;
              div {
                float: right;
              }
            }
          }
        }
        .total {
          text-align: right;
          line-height: 0.4rem;
          font-size: 0.24rem;
          border: none;
          text-align: right;
          color: $primary-color !important;
          p + p {
            margin-top: 0.18rem;
          }
        }
      }
    }
  }
</style>
