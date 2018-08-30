<template>
  <div class="intentionalAgent">
      <div class="header clearfix">
          <div @click="changeIndex('')" :class="[index == '' ? 'active' : '']">
              <i>全部</i>
          </div>
          <div @click="changeIndex(1)" :class="[index == 1 ? 'active' : '']">
              <i>待审核</i>
          </div>
          <div @click="changeIndex(5)" :class="[index == 5 ? 'active' : '']">
              <i>已完成</i>
          </div>
      </div>
      <div class="item" v-for="item in list">
          <div class="title">
              订单编号：{{item.code}}
            <span class="active">{{statusObj[item.status]}}</span>
          </div>
          <div class="content" @click="$router.push('/quxiandingdan?code=' + item.code)">
              <p>取现金额：<i>￥{{formatAmount(item.amount)}}</i></p>
              <p>{{item.applyDatetime}}</p>
              <img class="more" src="../../assets/imgs/more@2x.png" alt="">
          </div>
      </div>
  </div>
</template>
<script>
import {checkRechargeBill} from 'api/baohuo'
import { getDictList } from 'api/general'
import { formatDate, formatAmount } from 'common/js/util';
export default {
  name:'tixianjilu',
  data(){
      return{
        index:'',
        list:[],
        statusObj: {}
      }
  },
  methods:{
    formatAmount(amount) {
      return formatAmount(amount);
    },
    changeIndex(index) {
      this.index = index;
      checkRechargeBill(this.index).then(res => {
        res.list.map(function(item){
          //格式化时间
          item.applyDatetime = formatDate(item.applyDatetime)
        });
        this.list = res.list
      })
    }
  },
  mounted(){
    Promise.all([
      getDictList('withdraw_status'),
      checkRechargeBill(this.index)
    ]).then(([res1, res2]) => {
      res1.map((item) => {
        this.statusObj[item.dkey] = item.dvalue;
      });
      res2.list.map(function(item){
        //格式化时间
        item.applyDatetime = formatDate(item.applyDatetime)
      });
      this.list = res2.list
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
        color: #333;
        background: #fff;
        .title{
            padding: 0 0.3rem;
            line-height: 0.6rem;
            border-bottom: 1px solid #eee;
            font-size: $font-size-small-s;
            span{
                float: right;
                font-size: $font-size-small;
                &.active{
                    color: #fa5450;
                }
            }
        }
        .content{
            height: 1.44rem;
            padding: 0.3rem;
            font-size: $font-size-medium-s;
            position: relative;
            p{
                color: #333;
            }
            p + p {
                margin-top: 0.36rem;
            }
            .more{
                width: 0.2rem;
                position: absolute;
                top: 50%;
                right: 0.3rem;
                transform: translateY(-50%);
            }
        }
    }
}
</style>
