<template>
  <div class="chongzhichuli">
    <div class="header">
      <span class="title">提现金额（元）</span>
      <i class="num">{{formatAmount(info.amount)}}</i>
    </div>
    <div class="content">
      <p>订单编号 <span>{{info.code}}</span></p>
      <p>提现金额 <span>{{formatAmount(info.amount)}}</span></p>
      <p>申请时间 <span>{{info.applyDatetime}}</span></p>
    </div>
    <div class="word">
      <input v-model="approveNote" type="text" placeholder="说点什么" v-show="status === '1' || status === '3'">
      <p v-show="approveNote">审核备注： <span>{{approveNote}}</span></p>
      <p v-show="payNote">打款备注： <span>{{payNote}}</span></p>
    </div>
    <div class="buttons">
      <button class="btn" v-show="status === '1'" @click="check(1)">通过审核</button>
      <button class="btn" v-show="status === '1'" @click="check(0)">不通过审核</button>
      <button class="btn" v-show="status === '3'" @click="backRecord(1)">确认打款</button>
      <button class="btn" v-show="status === '3'" @click="backRecord(0)">不打款</button>
    </div>
    <toast ref="toast" :text="toastText"></toast>
    <full-loading :title="title" v-show="loading"></full-loading>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import FullLoading from 'base/full-loading/full-loading';
import { checkRechargeBillDetail, checkRecharge, checkRechargeNo, checkQuxian, payQuxian } from "api/baohuo";
import { formatDate, formatAmount } from "common/js/util";
import { commonMixin } from 'common/js/mixin';

export default {
  name: "chongzhichuli",
  mixins: [commonMixin],
  data() {
    return {
      loading: false,
      title: '正在加载...',
      info: {},
      code: "",
      toastText: '',
      approveNote: '',
      payNote: '',
      status: ''
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    formatImg(img) {
      return formatImg(img);
    },
    check(index) {
      this.codeList = this.code.split(',');
      this.approveResult = index;
      this.loading = true;
      checkQuxian({
        approveNote: this.approveNote,
        approveResult: this.approveResult,
        codeList: this.codeList
      }).then((res) => {
        this.loading = false;
        if (res.isSuccess === true) {
          this.toastText = '提交成功';
          this.$refs.toast.show();
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        } else {
          this.toastText = '提交失败';
          this.$refs.toast.show();
        }
      }).catch(() => { this.loading = false; });
    },
    backRecord(index) {
      this.codeList = this.code.split(',');
      this.payResult = index;
      this.loading = true;
      payQuxian({
        payNote: this.approveNote,
        payResult: this.payResult,
        codeList: this.codeList
      }).then((res) => {
        this.loading = false;
        if (res.isSuccess === true) {
          this.toastText = '提交成功';
          this.$refs.toast.show();
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        } else {
          this.toastText = '提交失败';
          this.$refs.toast.show();
        }
      }).catch(() => { this.loading = false; });
    }
  },
  mounted() {
    let code = this.$route.query.code;
    this.code = code;
    this.status = this.$route.query.status;
    this.loading = true;
    checkRechargeBillDetail(code).then(res => {
      this.loading = false;
      res.applyDatetime = formatDate(res.applyDatetime);
      this.approveNote = res.approveNote;
      this.payNote = res.payNote;
      this.info = res;
    }).catch(() => { this.loading = false; });
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
  .word {
    margin-top: 0.2rem;
    font-size: $font-size-medium;
    color: #333;
    background-color: #fff;
    line-height: 0.9rem;
    padding-left: 0.3rem;
    input {
      width: 100%;
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
