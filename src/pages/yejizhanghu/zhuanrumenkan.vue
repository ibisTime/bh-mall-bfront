<template>
  <div class="recharge">
      <div class="header">
          <div class="top">转入金额</div>
          <span class="yuan">￥</span>
          <input v-model="moneyNum" type="number">
          <div class="bottom">当前余额：{{formatAmount(account)}}</div>
      </div>
      <div class="footer">
          <span  @click="recharge" >确定转入</span>
      </div>
      <toast ref="toast" :text="text"></toast>
  </div>
</template>
<script>
import {transfer,queryAmount} from 'api/baohuo'
import { formatAmount } from 'common/js/util'
import Toast from 'base/toast/toast';
export default {
    name:'quxian',
    data(){
        return{
            moneyNum:'',
            account:'',
            text:'',
        }
    },
    methods:{
      formatAmount(amount) {
        return formatAmount(amount);
      },
      recharge(){
        if(+this.moneyNum > 0) {
          transfer({
            amount: this.moneyNum * 1000,
            fromAccount: 'TX_CNY',
            toAccount: 'MK_CNY'
          }).then(res => {
            this.text = '转入成功';
            this.account -= (this.moneyNum * 1000)
            this.$refs.toast.show();
            this.moneyNum = '';
            setTimeout(() => {
              this.$router.back();
            }, 500);
          })
        } else {
          this.text = '请输入大于0的数字';
          this.$refs.toast.show();
        }
      }
    },
    mounted(){
        this.accountNumber = this.$route.query.accountNumber
        queryAmount(this.accountNumber).then(res => {
            this.account = res.amount
        })
    },
    components:{
        Toast
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';
    .recharge{
        background-color: #f7f7f7;
        height: 100%;
        .header{
            margin-top: 0.2rem;
            padding: 0.3rem;
            background-color: #fff;
            position: relative;
            .top{
                font-size: $font-size-medium-x;
                color: #333;
            }
            .bottom{
                font-size: $font-size-medium;
                color: #999;
            }
            input{
                width: 6rem;
                margin: 0.58rem 0;
                font-size: 0.6rem;
                color: #333;
                padding-left: 0.6rem;
            }
            .yuan{
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
            }
        }
        .footer{
            height: 0.9rem;
            margin-top: 0.8rem;
            padding: 0 0.3rem;
            span{
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
        .tip{
            margin-top: 0.2rem;
            padding: 0 0.3rem;
            p{
                line-height: 0.6rem;
                color: #999;
                font-size: $font-size-medium-s;
            }
        }
    }
</style>
