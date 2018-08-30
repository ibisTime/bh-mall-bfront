<template>
  <div class="recharge">
        <div class="bank-card">
            <span class="card">{{options.payCardInfo}}</span>
            <span class="carnum">{{options.payCardNo}}</span>
            <i class="downward" @click="changeShow">></i>
        </div>
        <router-link to='/yejizhanghu/addBankCard' tag='div' class="add-bankCard">
         添加银行卡
        </router-link>
        <div :class="['menu',show ? 'show' : '']">
            <div
            v-for="item in cardList"
            class="item"
            :code="item.code"
            @click="(queryBankCardDetail(item.code))"
            ><span>{{item.bankName}}：</span><i>{{item.bankcardNumber}}</i></div>
        </div>
        <div class="header">
            <div class="top">取现金额</div>
            <span class="yuan">￥</span>
            <input v-model="options.account" type="number">
            <div class="bottom">当前余额：{{formatAmount(account)}}</div>
        </div>
        <div class="servicCharge">
            <i>本次提现手续费：</i><span>{{servicCharge}}元</span>
        </div>
        <div class="footer">
            <span  @click="recharge" >取现</span>
        </div>
        <div class="tip">
          <p>取现规则:</p>
          <div v-for="item in rules">
            <p>{{item.remark}}: {{item.cvalue}}</p>
          </div>
        </div>
    <toast ref="mytoast" :text="text"></toast>
  </div>
</template>
<script>
import { getCookie } from "common/js/cookie";
import { formatAmount } from "common/js/util";
import {
  queryAmount,
  queryBankCard,
  getPercent,
  quxian,
  queryBankCardDetail
} from "api/baohuo";
import { getConfig } from "../../api/general";
import Toast from 'base/toast/toast';
export default {
  name: "quxian",
  data() {
    return {
      account: "",
      percent: "",
      show: false,
      cardList: [],
      rules: [],
      options: {
        account: "",
        accountNumber: "",
        payCardInfo: "银行卡号",
        payCardNo: ""
      },
      text: ''
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    recharge() {
      if(!this.options.payCardNo) {
        this.text = "请选择银行卡";
        this.$refs.mytoast.show();
      } else {
        quxian(this.options).then(res => {
          if(res.code) {
            this.text = "操作成功";
            this.$refs.mytoast.show();
            setTimeout(() => {
              this.$router.push('/yejizhanghu');
            }, 300)
          }
        });
      }
    },
    queryBankCardDetail(code) {
      this.changeShow();
      queryBankCardDetail(code).then(res => {
        this.options.payCardInfo = res.bankName;
        this.options.payCardNo = res.bankcardNumber;
      });
    },
    changeShow() {
      this.show = !this.show;
    }
  },
  mounted() {
    this.options.accountNumber = this.$route.query.accountNumber;
    Promise.all([
      queryAmount(this.options.accountNumber),
      getPercent("BUSERQXFL"),
      queryBankCard(),
      getConfig({ type: 'AT_QX' })
    ]).then(([res1, res2, res3, res4]) => {
      this.account = res1.amount;
      this.percent = res2.cvalue;
      this.options.payCardInfo = res3[0].bankName;
      this.options.payCardNo = res3[0].bankcardNumber;
      this.cardList = res3;
      this.rules = res4.list;
      if(!this.cardList.length) {
        this.text = "您暂无银行卡，请添加";
        this.$refs.mytoast.show();
        setTimeout(() => {
          this.$router.push('/yejizhanghu/addBankCard');
        }, 300)
      }
    });
  },
  computed: {
    servicCharge() {
      let sum = this.options.account * this.percent;
      return sum.toFixed(2);
    }
  },
  components: {
    Toast
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.recharge {
  background-color: #f7f7f7;
  height: 100%;
  .bank-card {
    height: 1rem;
    line-height: 1rem;
    padding: 0 0.3rem;
    font-size: $font-size-medium-x;
    color: #333;
    background-color: #fff;
    position: relative;
    z-index: 10;
    .carnum {
      position: absolute;
      left: 2.5rem;
    }
    .downward {
      position: absolute;
      top: 50%;
      right: 0.3rem;
      transform: translateY(-50%) rotateZ(90deg);
      width: 1rem;
      text-align: center;
    }
  }
  .menu {
    width: 100%;
    position: absolute;
    background-color: #333;
    font-size: $font-size-medium-x;
    color: #f7f7f7;
    z-index: 3;
    display: none;
    &.show {
      display: block;
    }
    .item {
      display: block;
      padding: 0 0.3rem;
      line-height: 0.7rem;
      border-bottom: 1px dashed #eee;
      z-index: 10;
      > i {
        position: absolute;
        left: 2.5rem;
      }
    }
  }
  .header {
    margin-top: 0.2rem;
    padding: 0.3rem;
    background-color: #fff;
    position: relative;
    border: 1px solid #eee;
    .top {
      font-size: $font-size-medium-x;
      color: #333;
    }
    .bottom {
      font-size: $font-size-medium;
      color: #999;
    }
    input {
      width: 6rem;
      margin: 0.58rem 0;
      font-size: 0.6rem;
      color: #333;
      padding-left: 0.6rem;
    }
    .yuan {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      margin-left: 2px;
    }
  }
  .servicCharge {
    line-height: 1rem;
    padding: 0 0.3rem;
    font-size: $font-size-medium-x;
    background-color: #fff;
    span {
      margin-left: 0.6rem;
      color: $primary-color;
    }
  }
  .footer {
    height: 0.9rem;
    margin-top: 0.8rem;
    padding: 0 0.3rem;
    span {
      display: block;
      width: 100%;
      line-height: 0.9rem;
      background-color: $primary-color;
      border-radius: 0.1rem;
      text-align: center;
      color: #fff;
      font-size: $font-size-medium-xx;
    }
  }
  .tip {
    margin-top: 0.2rem;
    padding: 0 0.3rem;
    p {
      line-height: 0.6rem;
      color: #999;
      font-size: $font-size-medium-s;
    }
  }
  .add-bankCard {
    font-size: 0.28rem;
    color: blue;
    line-height: 0.5rem;
    height: 0.5rem
  }
}
</style>
