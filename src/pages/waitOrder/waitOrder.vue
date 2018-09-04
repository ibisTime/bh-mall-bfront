<template>
  <div class="intentionalAgent">
    <div class="category-wrapper">
      <category-scroll :currentIndex="currentIndex"
                       :categorys="categorys"
                       @select="selectCategory"></category-scroll>
    </div>
    <div class="orders-content" :class="[ovfh ? 'ovfh' : 'ovfs']">
      <div class="item clearfix" v-for="(item,index) in list">
        <div class="top clearfix">
          <span class="user">提交人：{{item.agent.realName || item.agent.nickName}}{{levelObj[item.agent.level]}}（{{item.agent.mobile}}）</span>
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
              <div class="wuliu" @click="wuliu(item.logisticsCode, item.logisticsCompany)" v-if="item.status == '3' || item.status == '4'">物流信息</div>
              <div class="quxiao" @click="cancel(item.code)" v-if="item.status == '5'">审核取消</div>
              <div class="fahuo" @click="sendM(item.code)" v-if="item.status == '2'">发货</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <toast ref="toast" :text="toastText"></toast>
    <full-loading :title="title" v-show="loading"></full-loading>
    <!--<confirm ref="confirm" :text="confirmText" @confirm="cancelEvent"></confirm>-->
    <send-modal ref="sendModal" @confirm="handleConfirm"></send-modal>
    <confirm-input ref="confirmInput" text="取消审核" @confirm="ok" @cancel="no" confirmBtnText="通过" cancelBtnText="不通过"></confirm-input>
  </div>
</template>
<script>
  import Toast from 'base/toast/toast';
  import CategoryScroll from 'base/category-scroll/category-scroll';
  import FullLoading from 'base/full-loading/full-loading';
  import Confirm from 'base/confirm/confirm';
  import SendModal from 'components/send-modal/send-modal';
  import ConfirmInput from 'base/confirm-input/confirm-input';
  import { queryOrderForm1, receiveNromalOrder, fahuo, checkCancel, getLevel } from "api/baohuo";
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
        type: {},
        hightShow: false,
        num: "",
        status: {},
        heightActive: '',
        toastText: '',
        currentIndex: +this.$route.query.index || 0,
        categorys: [
          {value: '全部',key: 'all'},
          {value: '待支付', key: '0'},
          {value: '待发货', key: '2'},
          {value: '待收货', key: '3'},
          {value: '已收货', key: '4'},
          {value: '申请取消', key: '5'}],
        confirmText: '确定取消订单吗',
        userId: '',
        content: '',
        levelObj: {},
        ovfh: false
      };
    },
    methods: {
      formatAmount(amount) {
        return formatAmount(amount);
      },
      changeHeight(index) {
        this.heightActive = this.heightActive === index ? '' : index;
      },
      formatImg(img) {
        return formatImg(img);
      },
      formatDate(date) {
        return formatDate(date);
      },
      check() {
        let key = this.categorys[this.index].key;
        let index = key === 'all' ? [] : key.split('||');
        // 请求订单
        this.loading = true;
        Promise.all([
          queryOrderForm1(index),
          getDictList('out_order_status'),
          getUserId(),
          getDictList('out_order_type')
        ]).then(([res1, res2, res3, res4]) => {
          this.loading = false;
          res1.list.forEach(function () {
            res1.applyDatetime = formatDate(res1.applyDatetime);
          });
          this.list = res1.list;
          res2.map((item) => {
            this.status[item.dkey] = item.dvalue;
          });
          this.userId = res3;
          res4.map((item) => {
            this.type[item.dkey] = item.dvalue;
          });
        }).catch(() => { this.loading = false; })
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
        this.$refs.confirmInput.show();
        // this.$refs.confirm.show();
        this.cancelCode = code;

      },
      ok() {
        this.result = 1;
        this.cancelEvent();
      },
      no() {
        this.result = 0;
        this.cancelEvent();
      },
      cancelEvent() {
        checkCancel(this.cancelCode, this.result, this.content, ).then((res) => {
          if(res.isSuccess) {
            this.toastText = '审核取消成功';
            this.$refs.toast.show();
            this.check();
          }
        })
      },
      selectCategory(index) {
        this.index = index;
        this.currentIndex = index;
        this.check();
      },
      sendM(code) {
        this.curCode = code;
        this.$refs.sendModal.show();
        this.ovfh = true;
      },
      handleConfirm(wlCode, wlCompany, dType) {
        if(!dType) {
          this.toastText = '您未选择发货方式';
          this.$refs.toast.show();
        } else {
          if (!wlCompany || !wlCode) {
            this.toastText = '物流单号或物流公司未填写完整';
            this.$refs.toast.show();
          } else {
            this.fahuo(wlCode, wlCompany, dType);
          }
        }
      },
      fahuo(logisticsCode, logisticsCompany, dType) {
        let params = {
          logisticsCode: logisticsCode,
          logisticsCompany: logisticsCompany,
          code: this.curCode,
          isWareSend: dType
        };
        fahuo(params).then(res => {
          if (res.isSuccess) {
            this.toastText = '发货成功';
            this.$refs.toast.show();
            setTimeout(() => {
              window.location.reload();
            }, 300)
          } else {
            this.toastText = '发货失败';
            this.$refs.toast.show();
          }
        });
      },
    },
    mounted() {
      this.check();
      getLevel().then((res) => {
        res.map((item) => {
          this.levelObj[item.level] = item.name;
        })
      })
    },
    components: {
      Toast,
      CategoryScroll,
      FullLoading,
      Confirm,
      SendModal,
      ConfirmInput
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../common/scss/variable.scss";
  @import "../../common/scss/base.scss";
  .ovfh {
    overflow: hidden;
  }
  .ovfs {
    overflow: scroll;
  }
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
            width: 1.2rem;
            line-height: 0.5rem;
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
            position: absolute;
            top: 1.15rem;
            right: 1.2rem;
            border: 1px solid #333;
            border-radius: 0.1rem;
            padding: 0.1rem 0.14rem;
          }
          .quxiao {
            font-size: 0.3rem;
            position: absolute;
            top: 1.15rem;
            right: 1.2rem;
            border: 1px solid #333;
            border-radius: 0.1rem;
            padding: 0.1rem 0.14rem;
          }
          .shouhuo {
            font-size: 0.3rem;
            position: absolute;
            top: 1.15rem;
            right: 0.2rem;
            border: 1px solid #333;
            border-radius: 0.1rem;
            padding: 0.1rem 0.14rem;
          }
          .fahuo {
            font-size: 0.3rem;
            position: absolute;
            top: 1.15rem;
            right: 0.2rem;
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
