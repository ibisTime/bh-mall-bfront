<template>
  <div class="chongzhichuli">
    <div class="header">
      <span class="title">充值金额（元）</span>
      <i class="num">{{formatAmount(info.amount)}}</i>
    </div>
    <div class="content">
      <p>订单编号 <span>{{info.code}}</span></p>
      <p>充值金额 <span>{{formatAmount(info.amount)}}</span></p>
      <p>打款凭证 <img :src="info.chargePdf | formatImg" /></p>
      <p>申请时间 <span>{{info.applyDatetime}}</span></p>
      <p>状态 <span>{{tips[info.status]}}</span></p>
    </div>
    <div class="buttons">
      <button :class="['btn',index != 4 ? 'hide' : '']" @click="check(1)">确认收到款项</button>
      <button :class="['btn',index != 4 ? 'hide' : '']" @click="check(0)">未收到款项</button>
    </div>
    <div :class="['mask',show ? 'show' : '']" @click="lookOver"></div>
    <div :class="['img',show ? 'show' : '']">
      <img src="../../assets/imgs/buyimg.png">
    </div>
    <toast ref="toast" :text="toastText"></toast>
    <full-loading :title="title" v-show="loading"></full-loading>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import FullLoading from 'base/full-loading/full-loading';
import { queryIndentDetail, checkRecharge, checkRechargeNo } from "api/baohuo";
import { formatDate, formatAmount } from "common/js/util";
import { commonMixin } from 'common/js/mixin';

export default {
  name: "chongzhichuli",
  mixins: [commonMixin],
  data() {
    return {
      loading: false,
      title: '正在加载...',
      show: false,
      info: {},
      index: 4,
      code: "",
      tips: [
        "",
        "待支付",
        "支付失败",
        "支付成功",
        "待审核",
        "审核未通过",
        "审核通过"
      ],
      toastText: ''
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    formatImg(img) {
      return formatImg(img);
    },
    changeShow() {
      this.show = !this.show;
    },
    lookOver() {
      this.changeShow();
    },
    check(index) {
      if(index === 0) {
        checkRechargeNo(this.code).then(res => {
          if (res.isSuccess === true) {
            this.toastText = '确认未收到款项成功';
            this.$refs.toast.show();
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          } else {
            this.toastText = '确认未收到款项失败，请联系管理员';
            this.$refs.toast.show();
          }
        });
      } else {
        checkRecharge(this.code).then(res => {
          if (res.isSuccess === true) {
            this.toastText = '充值成功';
            this.$refs.toast.show();
            setTimeout(() => {
              this.$router.go(-1);
              }, 1000);
          } else {
            this.toastText = '充值失败！请联系管理员';
            this.$refs.toast.show();
          }
        });
      }
    }
  },
  mounted() {
    let code = this.$route.query.code;
    this.code = code;
    this.index = this.$route.query.index;
    this.loading = true;
    queryIndentDetail(code).then(res => {
      this.loading = false;
      res.applyDatetime = formatDate(res.applyDatetime);
      this.info = res;
    });
  },
  components: {
    Toast,
    FullLoading
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.chongzhichuli {
  background-color: #f7f7f7;
  height: 100%;
  .header {
    height: 2.4rem;
    position: relative;
    background-color: #fff;
    .title {
      position: absolute;
      top: 0.58rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: $font-size-medium-x;
      color: #333;
    }
    .num {
      position: absolute;
      top: 1.36rem;
      left: 50%;
      transform: translateX(-50%);
      color: $primary-color;
      font-size: $font-size-large-xxxxx;
    }
  }
  .content {
    margin-top: 0.2rem;
    padding: 0.36rem 0.3rem;
    font-size: $font-size-medium;
    background-color: #fff;
    p {
      color: #999;
      span {
        float: right;
        color: #333;
      }
    }
    > p + p {
      margin-top: 0.42rem;
    }
    img {
      width: 100%;
      margin-top: 0.2rem;
    }
  }
  .buttons {
    display: flex;
    padding: 0.2rem;
    .btn {
      display: block;
      width: 15%;
      line-height: 0.9rem;
      margin: 0.84rem 0.2rem;
      background-color: #72a52c;
      color: #fff;
      border-radius: 0.1rem;
      flex: 1;
      &.hide {
        display: none;
      }
    }
  }
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: $color-background-m;
    z-index: 99;
    display: none;
    &.show {
      display: block;
    }
  }
  .img {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    display: none;
    &.show {
      display: block;
    }
  }
}
</style>
