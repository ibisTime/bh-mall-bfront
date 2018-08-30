<template>
    <div class="detail">
        <div class="detail-top">
            <p>
                <span>订单编号：{{info.code}}</span>
            </p>
            <p>
                <span>取现金额：{{formatAmount(info.amount)}}</span>
            </p>
            <p>
                <span>申请时间：{{info.applyDatetime}}</span>
            </p>
            <p>
                <span>状态：{{statusObj[info.status]}}</span>
            </p>
            <p>到账银行卡信息：</p>
            <p>银行：{{info.payCardInfo}}</p>
            <p>卡号：{{info.payCardNo}}</p>
        </div>
    </div>
</template>
<script>
import {checkRechargeBillDetail} from 'api/baohuo'
import { getDictList } from 'api/general'
import {formatDate, formatAmount} from 'common/js/util';
export default {
    name:'xixiandetail',
    data(){
      return{
        info:{},
        statusObj: {}
      }
    },
    methods:{
      formatAmount(amount) {
        return formatAmount(amount);
      }
    },
    mounted(){
      let code = this.$route.query.code;
      Promise.all([
        getDictList('withdraw_status'),
        checkRechargeBillDetail(code)
      ]).then(([res1, res2]) => {
        res1.map((item) => {
          this.statusObj[item.dkey] = item.dvalue;
        });
        res2.applyDatetime = formatDate(res2.applyDatetime)
        this.info = res2
      });
    },
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.detail {
    background-color: #f7f7f7;
    font-size: $font-size-small;
  .detail-top {
    margin-top: 0.2rem;
    padding: 0.3rem;
    background-color: #fff;
    p + p {
      margin-top: 0.36rem;
    }
    .tip {
        width: 1.4rem;
        height: 0.54rem;
        line-height: 0.54rem;
        float: right;
        background-color: $primary-color;
        border-radius: 0.2rem;
        color: #fff;
        text-align: center;
    }
    .tel {
      margin-left: 1.1rem;
    }
    img {
      float: right;
    }
  }
  .detail-bottom{
        padding: 0.3rem;
        margin-top: 0.2rem;
        background-color: #fff;
        p + p {
            margin-top: 0.36rem;
        }
  }
  .choose{
      overflow: hidden;
      padding: 0.26rem 0;
      background-color: #fff;
      border-top: 1px solid #eee;
      &.hide{
          display: none;
      }
      .item{
          width: 33.3%;
          float: left;
          line-height: 0.36rem;
          text-align: center;
          img{
              width: 0.3rem;
              vertical-align: text-bottom;
              margin-right: 0.12rem;
          }
      }
      .item + .item {
          border-left: 1px solid #eee;
      }
  }
.mask{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: $color-background-m;
    display: none;
    &.show{
        display: block;
    }
}
.panel{
    width: 50%;
    max-height: 5rem;
    overflow: hidden;
    overflow-y: auto;
    position: fixed;
    top: 4rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    display: none;
    &.show{
        display: block;
    }
    i{
        padding: 0.2rem 0.3rem;
        display: block;
        line-height: 0.2rem;
        width: 100%;
        border-bottom: 1px dashed #dedede;
    }
}

}
</style>
