<template>
  <div class="intentionalAgent">
    <!--<div class="header clearfix">-->
        <!--<div @click="changeIndex('')" :class="[index == '' ? 'active' : '']">-->
            <!--<i>全部</i>-->
        <!--</div>-->
        <!--<div @click="changeIndex('0')" :class="[index == '0' ? 'active' : '']">-->
            <!--<i>待支付</i>-->
        <!--</div>-->
        <!--<div @click="changeIndex('1')" :class="[index == '1' ? 'active' : '']">-->
            <!--<i>已收货</i>-->
        <!--</div>-->
        <!--<div @click="changeIndex('2')" :class="[index == '2' ? 'active' : '']">-->
            <!--<i class="width">申请取消</i>-->
        <!--</div>-->
    <!--</div>-->
    <div class="category-wrapper">
      <category-scroll :currentIndex="currentIndex"
                       :categorys="categorys"
                       @select="selectCategory"></category-scroll>
    </div>
    <div class="orders-content">
      <scroll :data="list"
              :hasMore="hasMore"
              @pullingUp="getPageOrders">
        <div class="item clearfix" v-for="(item,index) in list">
              <div class="top clearfix">
                  <span class="user">提交人：{{item.realName || item.nickName}}（{{item.agent.mobile}}）</span>
                  <span class="status">{{status[item.status]}}</span>
              </div>
              <div class="info" :class="{ active: heightActive === index }" ref="divInfo">
                  <div class="downward" @click="changeHeight(index)">></div>
                  <p>订单编号：{{item.code}}</p>
                  <p>下单时间：{{formatDate(item.applyDatetime)}}</p>
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
                      <div class="quxiao" @click="cancel(item.code)" v-if="item.status == '0'">取消</div>
                      <div class="fukuan" @click="goPay(item.code)" v-if="item.status == '0'">付款</div>
                    </div>
                  </div>
              </div>
        </div>
      </scroll>
    </div>
    <toast ref="toast" :text="toastText"></toast>
    <full-loading :title="title" v-show="loading"></full-loading>
    <confirm ref="confirm" :text="confirmText" @confirm="cancelEvent"></confirm>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import FullLoading from 'base/full-loading/full-loading';
import Confirm from 'base/confirm/confirm';
import Scroll from 'base/scroll/scroll';
import CategoryScroll from 'base/category-scroll/category-scroll';
import { queryYunOrder, receiveNromalOrder, cencelCloudOrder} from "api/baohuo";
import { formatDate, formatImg, formatAmount, getUserId } from "common/js/util";
import { getUser, getUserById } from "api/user";
import { getDictList } from 'api/general';
export default {
  data() {
    return {
      loading: false,
      title: '正在加载...',
      index: "",
      list: [],
      hightShow: false,
      num: "",
      status: {},
      heightActive: '',
      toastText: '',
      confirmText: '确定取消订单吗',
      start: 1,
      limit: 10,
      hasMore: true,
      categorys: [
        {value: '全部',key: 'all'},
        // {value: '待支付', key: '0'},
        // {value: '待发货', key: '1||2'},
        // {value: '待收货', key: '3'},
        // {value: '已收货', key: '4'},
        // {value: '申请取消', key: '5'}
      ],
      currentIndex: +this.$route.query.index || 0
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    formatDate(date) {
      return formatDate(date);
    },
    // changeIndex(index) {
    //
    // },
    changeHeight(index) {
      this.heightActive = this.heightActive === index ? '' : index;
    },
    formatImg(img) {
      return formatImg(img);
    },
    getPageOrders() {
      let status;
      if(this.index == 0) {
        status = '';
      } else {
        status = this.categorys[this.index].key;
      }
      this.loading = true;
      Promise.all([
        queryYunOrder({
          start: this.start,
          limit: this.limit,
          status: status,
          applyUser: getUserId()
        }),
        getDictList('in_order_status')
      ]).then(([res1, res2]) => {
        if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
          this.hasMore = false;
        }
        this.loading = false;
        res1.list.map(function () {
          res1.applyDatetime = formatDate(res1.applyDatetime);
        });
        this.list = this.list.concat(res1.list);
        this.start++;
        res2.map((item) => {
          this.status[item.dkey] = item.dvalue;
        });
      }).catch(() => { this.loading = false; });
    },
    shouhuo(code) {
      receiveNromalOrder(code).then(res => {
        if (res.isSuccess == true) {
          this.toastText = '收货成功';
          this.$refs.toast.show();
          this.list.map(item => {
            if (item.code == code) {
              item.status = '4'
            }
          })
        }
      })
    },
    wuliu(code, company) {
      // this.toastText = '物流单号：'+code+'物流公司：'+company;
      // this.$refs.toast.show();
      this.$router.push('/wuliu?code='+code+'&company='+company);
    },
    cancel(code){
      this.$refs.confirm.show();
      this.cancelCode = code;
    },
    cancelEvent() {
      cencelCloudOrder(this.cancelCode).then(res => {
        if(res.isSuccess == true){
          this.toastText = '取消成功';
          this.$refs.toast.show();
          window.location.reload()
        }
      })
    },
    goPay(index) {
      if (index) {
        this.$router.push("/xuangoushangpin/shangpingoumai?pay=" + 2 + '&code=' + index);
      }
    },
    selectCategory(index) {
      this.index = index;
      this.currentIndex = index;
      this.start = 1;
      this.limit = 10;
      this.list = [];
      this.getPageOrders();
    },
    getCategory() {
      getDictList('in_order_status').then((res) => {
        res.map((item) => {
          this.status[item.dkey] = item.dvalue;
          this.categorys.push({
            value: item.dvalue,
            key: item.dkey
          });
        });
      });
      this.getPageOrders();
    }
  },
  mounted() {
    this.getCategory();
  },
  components: {
    Toast,
    FullLoading,
    Confirm,
    Scroll,
    CategoryScroll
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
  .orders-content {
    position: absolute;
    top: 0.8rem;
    left: 0;
    width: 100%;
    bottom: 0;
  }
  .header {
    background-color: #fff;
    > div {
      float: left;
      width: 25%;
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
      padding: 0.2rem 0.3rem;
      background-color: #fff;
      overflow: hidden;
      border-bottom: 1px solid #eee;
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
        .wuliu {
          font-size: 0.3rem;
          border: 1px solid #333;
          border-radius: 0.1rem;
          padding: 0.1rem 0.14rem;
        }
        .fukuan {
          font-size: 0.3rem;
          border: 1px solid #333;
          border-radius: 0.1rem;
          padding: 0.1rem 0.14rem;
          margin-left: 0.3rem;
        }
        .shouhuo {
          margin-left: 0.3rem;
          font-size: 0.3rem;
          border: 1px solid #333;
          border-radius: 0.1rem;
          padding: 0.1rem 0.14rem;
        }
        .quxiao {
          font-size: 0.3rem;
          margin-left: 0.3rem;
          border: 1px solid #333;
          border-radius: 0.1rem;
          padding: 0.1rem 0.14rem;
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
</style>
