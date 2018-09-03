<template>
  <div class="intentionalAgent">
    <category-scroll :currentIndex="currentIndex"
                     :categorys="categorys"
                     @select="selectCategory"></category-scroll>
    <div class="item clearfix" v-for="(item,index) in list">
          <div class="top clearfix">
              <span class="user">提交人：{{item.realName}}</span>
              <span class="status">{{status[item.status]}}</span>
          </div>
          <div class="info" :class="{ active: heightActive === index }"  ref="divInfo">
              <div class="downward" @click="changeHeight(index)">></div>
              <p>订单编号：{{item.code}}</p>
              <p>下单时间：{{item.applyDatetime}}</p>
              <p>收货人：{{item.signer}}（{{item.mobile}}）</p>
              <p>收货地址：<i>{{item.province}}</i><i>{{item.city}}</i><i>{{item.area}}</i><i>{{item.address}}</i></p>
          </div>
          <div class="pic">
              <img :src="item.pic" alt="">
              <div class="content">
                <div class="inner-cont">
                  <p>{{item.productName}}</p>
                  <i>￥{{formatAmount(item.price)}}</i>
                </div>
                <div class="inner-cont" style="padding-top: 0.1rem;">
                  <p style="line-height: 0.4rem;">规格：{{item.quantity}}{{item.specsName}}</p>
                  <div class="total">总价：¥{{formatAmount(item.amount)}}</div>
                  <!--<div class="total yunfei" v-show="item.yunfei">运费：¥{{formatAmount(item.yunfei)}}</div>-->
                </div>
                <div class="inner-cont" style="padding-top: 0.1rem;">
                  <div class="total yunfei">运费：¥{{formatAmount(item.yunfei)}}</div>
                </div>
                <div class="btn-wrap">
                  <div class="wuliu" @click="wuliu(item.logisticsCode, item.logisticsCompany)" v-if="item.status == '3' || item.status == '4'">查看物流</div>
                  <div class="shouhuo" @click="shouhuo(item.code)" v-if="item.status == '3'">收货</div>
                  <div class="fukuan" @click="goPay(item.code)" v-if="item.status == '0'">付款</div>
                </div>
              </div>
          </div>
          <!--<div v-if="item.status == 0" class="bottom clearfix">-->
              <!--<div @click="goPay(item.code)">去付款</div>-->
          <!--</div>-->
    </div>
    <toast ref="toast" :text="toastText"></toast>
    <full-loading :title="title" v-show="loading"></full-loading>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import CategoryScroll from 'base/category-scroll/category-scroll';
import FullLoading from 'base/full-loading/full-loading';
import { queryShopForm, receiveNeigouOrder } from "api/baohuo";
import { formatDate, formatImg, formatAmount } from "common/js/util";
import { getUser, getUserById } from "api/user";
import { setCookie, getCookie } from "common/js/cookie";
import { getDictList } from 'api/general';

export default {
  data() {
    return {
      loading: false,
      title: '正在加载...',
      index: 0,
      list: [],
      hightShow: false,
      num: "",
      status: [],
      options: {},
      toastText: '',
      currentIndex: +this.$route.query.index || 0,
      categorys: [
        {value: '全部',key: 'all'},
        {value: '待支付', key: '0'},
        {value: '待发货', key: '1||2'},
        {value: '待收货', key: '3'},
        {value: '已收货', key: '4'},
        {value: '申请取消', key: '5'}
      ],
      heightActive: ''
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    changeHeight(index) {
      this.heightActive = this.heightActive === index ? '' : index;
    },
    check() {
      let key = this.categorys[this.index].key;
      let index = key === 'all' ? [] : key.split('||');
      this.loading = true;
      Promise.all([
        queryShopForm(index),
        getDictList('inner_order_status')
      ]).then(([res1, res2]) => {
        this.loading = false;
        res1.list.map(function(item) {
          //格式化图片
          item.pic = formatImg(item.pic);
          //格式化时间
          item.applyDatetime = formatDate(item.applyDatetime);
        });
        this.list = res1.list;
        res2.map((item) => {
          this.status[item.dkey] = item.dvalue;
        });
      }).catch(() => { this.loading = false; })
    },
    goPay(index) {
      if (index) {
        this.$router.push("/xuangoushangpin/shangpingoumai?pay=" + 1 + '&code=' + index);
      }
    },
    shouhuo(code) {
      receiveNeigouOrder(code).then(res => {
        if(res.isSuccess) {
          this.toastText = '收货成功';
          this.$refs.toast.show();
          this.list.map(item => {
            if(item.code == code) {
              item.status = '3'
            }
          })
        }
      })
    },
    selectCategory(index) {
      this.index = index;
      this.currentIndex = index;
      this.check();
    },
    wuliu(code, company) {
      this.$router.push('/wuliu?code='+code+'&company='+company);
    },
  },
  mounted() {
    this.check();
  },
  components: {
    Toast,
    CategoryScroll,
    FullLoading
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
  .header {
    background-color: #fff;
    > div {
      float: left;
      width: 20%;
      height: 0.9rem;
      position: relative;
      i {
        font-size: $font-size-medium;
        color: #333;
        line-height: 0.9rem;
        position: absolute;
        left: 43%;
        transform: translateX(-50%);
        &.width {
          width: 1.2rem;
        }
      }
      &.active {
        i {
          color: $primary-color;
          border-bottom: 0.06rem solid $primary-color;
        }
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
      display: flex;
      padding: 0.4rem 0.3rem;
      border-bottom: 1px solid #eee;
      background-color: #fff;
      overflow: hidden;
      img {
        flex: 0 0 1.8rem;
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
          .yunfei {
            float: right;
            position: absolute;
            right: 0;
          }
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
          width: 1.2rem;
          line-height: 0.4rem;
          font-size: $font-size-small;
          border-radius: 0.1rem;
          color: #333;
          text-align: center;
        }
        .total {
          text-align: right;
          line-height: 0.4rem;
          font-size: 0.24rem;
          border: none;
          text-align: right;
          color: $primary-color !important;
        }
        .btn-wrap {
          flex: 1;
          padding-top: 0.3rem;
          text-align: right;
          div {
            float: right;
          }
        }
        .wuliu {
          font-size: 0.3rem;
          border: 1px solid #333;
          border-radius: 0.1rem;
          padding: 0.1rem 0.14rem;
          margin-left: 0.3rem;
        }
        .shouhuo {
          font-size: 0.3rem;
          border: 1px solid #333;
          border-radius: 0.1rem;
          padding: 0.1rem 0.14rem;
          margin-left: 0.3rem;
        }
        .fukuan {
          font-size: 0.3rem;
          border: 1px solid #333;
          border-radius: 0.1rem;
          padding: 0.1rem 0.14rem;
        }
      }
    }
    .bottom {
      padding: 0.3rem 0;
      > div {
        float: left;
        width: 50%;
        height: 0.3rem;
        line-height: 0.3rem;
        color: $primary-color;
        font-size: $font-size-medium-s;
        text-align: center;
      }
      div + div {
        border-left: 1px solid $primary-color;
      }
    }
  }
}
.receive {
  font-size: 0.3rem;
  position: absolute;
  top: 1.15rem;
  right: 0.2rem;
  border: 1px solid #333;
  border-radius: 0.03rem;
  padding: 0.03rem
}
</style>
