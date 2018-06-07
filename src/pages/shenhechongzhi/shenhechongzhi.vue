<template>
  <div class="intentionalAgent">
      <div class="header clearfix">
          <div @click="changeIndex(1)" :class="[index == 1 ? 'active' : '']">
              <i>待确认</i>
          </div>
          <div @click="changeIndex(3)" :class="[index == 3 ? 'active' : '']">
              <i>已确认</i>
          </div>
          <div @click="changeIndex(2)" :class="[index == 2 ? 'active' : '']">
              <i>已否决</i>
          </div>
      </div>
      <div class="item" v-for="item in list"  @click="$router.push('/shenhechongzhi/chongzhichuli?code=' + item.code + '&index=' + index);">
          <p>订单编号：{{item.code}}<i class="tip">{{tips[item.status]}}</i></p>
          <p>充值金额：<span>￥{{item.amount}}</span><img src="../../assets/imgs/more@2x.png" alt=""></p>
          <p>申请时间：{{item.applyDatetime}}</p>
      </div>
      <!-- <div class="item" @click="$router.push('/shenhechongzhi/chongzhichuli?code=U20180328101135370654&index=' + index);">
          <p>订单编号：CZ2017051619474103473<i class="tip">待审核</i></p>
          <p>充值金额：<span>￥200.00</span><img src="../../assets/imgs/more@2x.png" alt=""></p>
          <p>申请时间：2018-09-09 11:11:11</p>
      </div> -->
  </div>
</template>
<script>
import {intentional,queryIndent} from 'api/baohuo'
import {formatDate} from 'common/js/util';
export default {
    name:'IntentionalAgent',
    data(){
        return{
            index:1,
            list:[],
            tips:['待支付','支付失败','支付成功']
        }
    },
    methods:{
        changeIndex(index) {
            this.index = index
            queryIndent(this.index).then(res => {
                console.log(res)
                res.list.map(function(item){

                    //格式化时间
                    item.applyDatetime = formatDate(item.applyDatetime)
                })
                this.list = res.list
            })
        }
    },
    mounted(){
        queryIndent(this.index).then(res => {
            console.log(res)
            res.list.map(function(item){

                    //格式化时间
                    item.applyDatetime = formatDate(item.applyDatetime)
            })
            this.list = res.list
        })
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';
@import '../../common/scss/base.scss';
.intentionalAgent{
    background-color: #f7f7f7;
    .fl{
        float: left;
    }
    .header{
        background-color: #fff;
        >div{
            float: left;
            width: 33.3%;
            height: 0.9rem;
            // background-color: rgba($color: #000000, $alpha: 0.1);
            position: relative;
            i{
                font-size: $font-size-medium;
                color:#333;
                height: 0.9rem;
                line-height: 0.9rem;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
            }
            &.active{
                i{
                    color: $primary-color;
                    border-bottom: 0.06rem solid $primary-color;
                }
            }
        }
    }
    .item{
        margin-top: 0.2rem;
        padding: 0.3rem;
        font-size: $font-size-small;
        background-color: #fff;
        p + p{
            margin-top: 0.36rem;
        }
        .tip{
            float: right;
            color: #fa5440;
        }
        .tel{
            margin-left: 1.1rem;
        }
        img{
            width: 0.2rem;
            float: right;
        }
    }
}
</style>
