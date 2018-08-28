<template>
  <div class="intentionalAgent">
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
            <p>订单类型：{{type[item.kind]}}</p>
            <p>下单时间：{{formatDate(item.applyDatetime)}}</p>
            <p>收货人：{{item.signer}}（{{item.mobile}}）</p>
            <p>收货地址：<i>{{item.province}}</i><i>{{item.city}}</i><i>{{item.area}}</i><i>{{item.address}}</i></p>
          </div>
          <div class="pic">
            <img :src="formatImg(item.pic)" alt="">
            <div class="content">
              <p>{{item.productName}}</p>
              <p style="padding-top:0.1rem;">规格：{{item.specsName}}</p>
              <i>￥{{formatAmount(item.price)}}</i>
              <span>数量：{{item.quantity}}{{item.specsName}}</span>
              <span class="total">总价：¥{{formatAmount(item.amount)}}</span>
              <div class="quxiao" @click="cancel(item.code)" v-if="item.status == '0' || item.status == '1'">取消</div>
              <div class="fukuan" @click="goPay(item.code)" v-if="item.status == '0'">付款</div>
              <div class="shouhuo" @click="shouhuo(item.code)" v-if="item.status == '3'">收货</div>
              <div class="wuliu" @click="wuliu(item.logisticsCode, item.logisticsCompany)" v-if="item.status == '3' || item.status == '4'">物流信息</div>
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
  import CategoryScroll from 'base/category-scroll/category-scroll';
  import Confirm from 'base/confirm/confirm';
  import Scroll from 'base/scroll/scroll';
  import { queryOrderForm2, receiveNromalOrder,cencelChuHuoOrder} from "api/baohuo";
  import { formatDate, formatImg, formatAmount, getUserId } from "common/js/util";
  import { getUser, getUserById } from "api/user";
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
        status: {},
        type: {},
        heightActive: '',
        toastText: '',
        currentIndex: +this.$route.query.index || 0,
        categorys: [
          {value: '全部',key: 'all'},
          {value: '待支付', key: '0'},
          {value: '待发货', key: '1||2'},
          {value: '待收货', key: '3'},
          {value: '已收货', key: '4'},
          {value: '申请取消', key: '5'}],
        confirmText: '确定取消订单吗',
        start: 1,
        limit: 10,
        hasMore: true
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
      check() {
        let key = this.categorys[this.index].key;
        this.index = key === 'all' ? [] : key.split('||');
        // 请求订单
        this.loading = true;
        Promise.all([
          queryOrderForm2({
            start: this.start,
            limit: this.limit,
            statusList: this.index
          }),
          getDictList('out_order_status'),
          getDictList('out_order_type')
        ]).then(([res1, res2, res3]) => {
          this.loading = false;
          if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
            this.hasMore = false;
          }
          res1.list.forEach(function () {
            res1.applyDatetime = formatDate(res1.applyDatetime);
          });
          this.list = this.list.concat(res1.list);
          this.start++;
          res2.map((item) => {
            this.status[item.dkey] = item.dvalue;
          });
          res3.map((item) => {
            this.type[item.dkey] = item.dvalue;
          });
        }).catch(() => { this.loading = false; });
      },
      getPageOrders() {
        queryOrderForm2({
          start: this.start,
          limit: this.limit,
          statusList: this.index
        }).then((data) => {
          if (data.list.length < this.limit || data.totalCount <= this.limit) {
            this.hasMore = false;
          }
          this.list = this.list.concat(data.list);
          this.start++;
        });
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
        this.$router.push('/wuliu?code='+code+'&company='+company);
      },
      cancel(code){
        this.$refs.confirm.show();
        this.cancelCode = code;

      },
      cancelEvent() {
        cencelChuHuoOrder(this.cancelCode).then(res => {
          if(res.isSuccess == true){
            this.toastText = '取消成功';
            this.$refs.toast.show();
            window.location.reload()
          }
        })
      },
      selectCategory(index) {
        this.index = index;
        this.currentIndex = index;
        this.check();
      },
      goPay(code) {
        if (code) {
          this.$router.push("/xuangoushangpin/shangpingoumai?pay=" + 3 + '&code=' + code);
        }
      },
    },
    mounted() {
      this.check();
    },
    components: {
      Toast,
      CategoryScroll,
      FullLoading,
      Confirm,
      Scroll
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
    .category-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 100;
      overflow: hidden;
      height: 0.8rem;
      line-height: 0.8rem;
      background: #fff;
      border-bottom: 1px solid $color-border;
    }
    .orders-content {
      position: absolute;
      top: 0.8rem;
      left: 0;
      width: 100%;
      bottom: 0;
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
        padding: 0.4rem 0.3rem;
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
            /*top: 1.15rem;*/
            left: 0;
            font-size: $font-size-small;
            color: $primary-color;
          }
          span {
            width: 2.2rem;
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
          .wuliu {
            font-size: 0.3rem;
            position: absolute;
            top: 1.15rem;
            right: 1.2rem;
            border: 1px solid #333;
            border-radius: 0.1rem;
            padding: 0.1rem 0.14rem;
            margin: 0.3rem 0;
          }
          .fukuan {
            font-size: 0.3rem;
            position: absolute;
            top: 1.15rem;
            right: 1.2rem;
            border: 1px solid #333;
            border-radius: 0.1rem;
            padding: 0.1rem 0.14rem;
            margin: 0.3rem 0;
          }
          .shouhuo {
            font-size: 0.3rem;
            position: absolute;
            top: 1.15rem;
            right: 0.2rem;
            border: 1px solid #333;
            border-radius: 0.1rem;
            padding: 0.1rem 0.14rem;
            margin: 0.3rem 0;
          }
          .quxiao {
            font-size: 0.3rem;
            position: absolute;
            top: 1.15rem;
            right: 0.2rem;
            border: 1px solid #333;
            border-radius: 0.1rem;
            padding: 0.1rem 0.14rem;
            margin: 0.3rem 0;
          }
        }
      }
      .total {
        margin: 0.8rem 0;
        text-align: right;
        width: 2.2rem;
        line-height: 0.5rem;
        position: absolute;
        top: 0;
        right: 0;
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
