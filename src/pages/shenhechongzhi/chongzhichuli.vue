<template>
    <div class="chongzhichuli">
        <div class="header">
            <span class="title">充值金额（元）</span>
            <i class="num">{{info.amount / 1000}}</i>
        </div>
        <div class="content">
            <p>订单编号 <span>{{info.code}}</span></p>
            <p>充值金额 <span>{{info.amount / 1000}}</span></p>
            <p>打款凭证 <img :src="info.chargePdf | formatImg" /></p>
            <p>申请时间 <span>{{info.applyDatetime}}</span></p>
            <p>状态 <span>{{tips[info.status]}}</span></p>
        </div>
        <button :class="['btn',index != 4 ? 'hide' : '']" @click="check">确认收到款项</button>
        <div :class="['mask',show ? 'show' : '']" @click="lookOver"></div>
        <div :class="['img',show ? 'show' : '']">
            <img src="../../assets/imgs/buyimg.png">
        </div>
    </div>
</template>
<script>
import { queryIndentDetail, checkRecharge } from "api/baohuo";
import { formatDate } from "common/js/util";
import { commonMixin } from 'common/js/mixin';

export default {
  name: "chongzhichuli",
  mixins: [commonMixin],
  data() {
    return {
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
      ]
    };
  },
  methods: {
    formatImg(img) {
      return formatImg(img);
    },
    changeShow() {
      this.show = !this.show;
    },
    lookOver() {
      this.changeShow();
    },
    check() {
      checkRecharge(this.code).then(res => {
        if (res.isSuccess === true) {
          alert("充值成功！");
          setTimeout(this.$router.go(-1), 1000);
        } else {
          alert("充值失败！请联系管理员");
        }
      });
    }
  },
  mounted() {
    let code = this.$route.query.code;
    this.code = code;
    this.index = this.$route.query.index;
    queryIndentDetail(code).then(res => {
      res.applyDatetime = formatDate(res.applyDatetime);
      this.info = res;
    });
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
    .showImg {
      margin-top: 0.46rem;
      position: relative;
      height: 1.36rem;
      img {
        width: 1.36rem;
        position: absolute;
      }
      .mask-pic {
        padding: 0.3rem 0;
        width: 1.36rem;
        height: 1.36rem;
        background-color: rgba(0, 0, 0, 0.6);
        position: absolute;
        z-index: 3;
        p {
          text-align: center;
          color: #fff;
        }
        p + p {
          margin-top: 0.3rem;
        }
      }
    }
  }
  .btn {
    display: block;
    width: 90%;
    line-height: 0.9rem;
    margin: 0.84rem auto;
    background-color: $primary-color;
    color: #fff;
    border-radius: 0.1rem;
    &.hide {
      display: none;
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
