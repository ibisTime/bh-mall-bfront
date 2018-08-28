<template>
  <div class="recharge">
      <div class="header">
          <div class="top">充值金额</div>
          <span class="yuan">￥</span>
          <input v-model="moneyNum" type="number">
          <div class="bottom">当前余额：{{account / 1000}}</div>
      </div>
      <div class="center">
          <div class="mode">充值方式</div>
          <div class="chongzhi" @click="changeStatus(1)">
              <img class="zhifu" src="../../assets/imgs/xianxiachongzhi@2x.png">
              线下充值
              <img :class="['xuanzhong', status == 1 ? 'show' : '']" src="../../assets/imgs/xuanzhong@2x.png" alt="">
              <img :class="['xuanzhong', status == 1 ? '' : 'show']" src="../../assets/imgs/unchoosed.png" alt="">
          </div>
          <div class="chongzhi" @click="changeStatus(2)">
              <img class="zhifu" src="../../assets/imgs/weixinchongzhi@2x.png">
              微信充值
              <img :class="['xuanzhong', status == 2 ? 'show' : '']" src="../../assets/imgs/xuanzhong@2x.png" alt="">
              <img :class="['xuanzhong', status == 2 ? '' : 'show']" src="../../assets/imgs/unchoosed.png" alt="">
          </div>
      </div>
      <div class="footer">
          <span  @click="recharge" >充值</span>
      </div>
      <toast ref="toast" :text="text"></toast>
      <full-loading :title="title" v-show="loading"></full-loading>
      <confirm ref="confirm" :text="confirmText" :isAlert="isAlert" @confirm="handleConfirm"></confirm>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import FullLoading from 'base/full-loading/full-loading';
import Confirm from 'base/confirm/confirm';
import { getCookie, setCookie } from 'common/js/cookie'
import { queryConfig, queryAmount, checkRed, getCaccount } from 'api/baohuo'
import { initPay } from 'common/js/weixin';
import { getUserId, formatAmount } from 'common/js/util';
export default {
  name:'recharge',
  data() {
      return {
          isAlert: true,
          confirmText: '',
          status: 2,
          moneyNum: '',
          accountNumber: '',
          account: '',
          text: '',
          loading: true,
          title: '正在载入...'
      };
  },
  methods:{
      handleConfirm() {
        this.$router.push(this.url);
      },
      checkUser() {
        checkRed(getUserId()).then(res => {
          setCookie('isWare', res.isWare);
          if (res.result == '4') {
            this.redirectPage(`您需要充值门槛费${formatAmount(res.chargeAmount)}元`, '/recharge?type=MK_CNY');
          } else if (res.result == "0") {
            this.redirectPage(`您需要先购买${formatAmount(res.redAmount)}元的云仓`, '/threshold');
          } else if (res.result == '1') {
            this.redirectPage(`您需要先购买${formatAmount(res.amount)}元的授权单`, '/woyaochuhuo');
          } else if (res.result == '2') {
            this.redirectPage(`您需要先购买${formatAmount(res.amount)}元的升级单`, '/woyaochuhuo');
          } else if (res.result == '3') {
            this.redirectPage(`您的门槛余额已经高于${formatAmount(res.minAmount)}元，请前去购买云仓`, '/threshold');
          } else {
            this.$router.push('/home');
          }
        });
      },
      redirectPage(text, url) {
        this.confirmText = text;
        this.$refs.confirm.show();
        this.url = url;
      },
      changeStatus(status){
          this.status = status
      },
      success() {
          this.loading = false;
          this.text = '充值成功';
          this.$refs.toast.show(this.checkUser);
      },
      error(err) {
          this.loading = false;
          this.text = '充值失败';
          this.$refs.toast.show();
      },
      cancel() {
          this.loading = false;
      },
      recharge(){
          if (this.status === 1) {
              this.$router.push('/recharge/offine?accountNumber=' + this.accountNumber)
          } else if(this.status === 2) {
              this.loading = true;
              this.title = '充值中...';
              queryConfig(this.accountNumber,this.moneyNum * 1000).then(res => {
                  let wxConfig = {
                      appId: res.appId, // 公众号名称，由商户传入
                      timeStamp: res.timeStamp, // 时间戳，自1970年以来的秒数
                      nonceStr: res.nonceStr, // 随机串
                      wechatPackage: res.wechatPackage,
                      signType: res.signType, // 微信签名方式：
                      paySign: res.paySign // 微信签名
                  }
                  initPay(wxConfig, this.success, this.error, this.cancel)
              }).catch(() => { this.loading = false; })
            // this.success();
          }
      }
  },
  mounted(){
    let currency = this.$route.query.type;
    getCaccount({
      currency: currency
    }).then(data => {
      this.loading = false;
      this.accountNumber = data[0].accountNumber;
      this.account = data[0].amount;
    }).catch(() => this.loading = false);
  },
  components: {
    Toast,
    Confirm,
    FullLoading
  }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';
    .recharge{
        background-color: #f7f7f7;
        .header{
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
        .center{
            margin-top: 0.2rem;
            background-color: #fff;
            .mode{
                line-height: 0.6rem;
                padding-left: 0.3rem;
                color: #999;
                font-size: $font-size-small;
            }
            .chongzhi{
                line-height: 1rem;
                padding: 0 0.3rem;
                font-size: $font-size-medium-x;
                border-top: 1px solid #eee;
                .zhifu{
                    width: 0.5rem;
                    margin-right: 0.2rem;
                    vertical-align: sub;
                }
                .xuanzhong{
                    width: 0.4rem;
                    float: right;
                    margin-top: 0.5rem;
                    transform: translateY(-50%);
                    display: none;
                    &.show{
                        display: block;
                    }
                }
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
    }
</style>
