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
          </div>
          <div class="chongzhi" @click="changeStatus(2)">
              <img class="zhifu" src="../../assets/imgs/weixinchongzhi@2x.png">
              微信充值
              <img :class="['xuanzhong', status == 2 ? 'show' : '']" src="../../assets/imgs/xuanzhong@2x.png" alt="">
          </div>
      </div>
      <div class="footer">
          <span  @click="recharge" >充值</span>
      </div>
  </div>
</template>
<script>
import {getCookie} from 'common/js/cookie'
import {queryConfig,queryAmount} from 'api/baohuo'
import {initPay} from 'common/js/weixin'
export default {
  name:'recharge',
  data(){
      return{
          status:'',
          moneyNum:'',
          accountNumber:'',
          account:'',
      }
  },
  methods:{
        changeStatus(status){
            this.status = status
        },
        success(){
            // alert('success')
        },
        error(err){
            alert(JSON.stringify(err));
        },
        cancel(){
            // alert('cancel')
        },
        
        recharge(){
            if(this.status === 1) {
                this.$router.push('/recharge/offine?accountNumber=' + this.accountNumber)
            }else if(this.status === 2) {
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
                })
            }
        }
  },
  mounted(){
      this.accountNumber = this.$route.query.accountNumber
      queryAmount(this.accountNumber).then(res => {
          this.account = res.amount
      })
  },
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
