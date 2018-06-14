<template>
  <div class="structure">
      <div :class="['tip',tipshow ? 'none' : '']">
            <span>负责声明：此功能只是辅助上级管理下级的账目，与公司财务未发生任何关系，请代理们尽量严谨的审核充值金额，我公司对代理间因充值发生的纠纷概不负责</span>
            <img src="../../assets/threshold/close.png" @click="changeTipShow">
      </div>
      <div class="tab">
            <div class="header">
                <div>
                    <span :class="[kind === 1 ? 'active' : '']" @click="chooseKind(1)">收入相关</span>
                </div>
                <div>
                    <span :class="[kind === 0 ? 'active' : '']" @click="chooseKind(0)">支出相关</span>
                </div>
            </div>
            <div class="time clearfix">
                <span>开始</span>
                <span class="time-now">
                <date-picker 
                            :year="year"
                            :month="month"
                            :day="day"
                            @change="updateDate"></date-picker>
                    <img src="../../assets/imgs/xiala@2x.png" alt="">
                </span>
                <span>-</span>
                <span>结束</span>
                <span class="time-now">
                <date-picker 
                            :year="endyear"
                            :month="endmonth"
                            :day="endday"
                            @change="updateEndDate"></date-picker>
                    <img src="../../assets/imgs/xiala@2x.png" alt="">
                </span>
                <span class="confirm" @click="check">确定</span>
            </div>
      </div>
      <div class="tab-content">
          <div class="item" :class="['item', list.length > 0 ? 'itemshow' : '']" v-for="item in list">
              <div class="top">
                  订单编号：{{item.code}}
                  <span class="top-right">已发放</span>
              </div>
              <div class="bottom">
                  <p>奖励金额：<i>{{item.transAmount}}</i></p>
                  <p>{{item.createDatetime}}</p>
                  <img class="more" src="../../assets/imgs/more@2x.png">
              </div>
          </div>
          <div :class="['none',list.length > 0 ? 'hide' : '']">
              <img src="../../assets/imgs/hezi.png" alt="">
          </div>
          <div :class="['none-text',list.length > 0 ? 'hide' : '']">近期无记录</div>
      </div>
  </div>
</template>
<script>
import DatePicker from 'base/date-picker/date-picker';
import {formatDate} from 'common/js/util';
import {emptyValid} from 'common/js/util';
import {award} from 'api/baohuo'
export default {
    data(){
        return{
            itemshow:false,
            flag:false,
            tipshow : false,
            year:'',
            month:'',
            day:'',
            endyear:'',
            endmonth:'',
            endday:'',
            list:[],
            bizType:2,
            kind:1,
        }
    },
    methods:{
        changeTipShow(){
            this.tipshow = !this.tipshow
        },
        chooseKind(kind) {
            this.kind = kind
        },
        updateDate (year, month, day) {
            this.year = year;
            this.month = month;
            this.day = day;
            return this._yearValid();
        },
        updateEndDate (year, month, day) {
            this.endyear = year;
            this.endmonth = month;
            this.endday = day;
            return this._yearValid();
        },
        _yearValid() {
            let result = emptyValid(this.year);
            this.yearErr = result.msg;
            return !result.err;
        },
        check(){
            let options = {}
            options.bizType = this.bizType
            options.kind = this.kind
            options.dateStart = this.year + '-' + this.month + '-' + this.day
            options.dateEnd = this.endyear + '-' + this.endmonth + '-' + this.endday
            award(options).then(res => {
                res.list.map(function(item){
                    //格式化时间
                    item.createDatetime = formatDate(item.createDatetime)
                })
                this.list = res.list
            })
        }

    },
    mounted(){
    },
    components:{
        DatePicker,
    }
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
@import "../../common/scss/base.scss";
    .structure{
        background-color: #f7f7f7;
        height: 100%;
        .fl{
            float: left;
        }
        .show{
            display: block !important;
        }
        .tip{
            line-height: 0.4rem;
            padding:0  0.3rem;
            background-color: #fff9e3;
            color: #feaa00;
            font-size: $font-size-small;
            position: relative;
            &.none{
                display: none;
            }
            img{
                position: absolute;
                top: 50%;
                right: 0.2rem;
                transform: translateY(-50%);
                width: 0.24rem;
            }
        }
        .tab{
            margin-top: 0.2rem;
            background-color: #fff;
            .header{
                height: 0.9rem;
                border-bottom: 1px solid #eee;
                >div{
                    float: left;
                    width: 50%;
                    height: 100%;
                    position: relative;
                    span{
                        position: absolute;
                        top: -6px;
                        left: 50%;
                        transform: translateX(-50%);
                        line-height: 0.9rem;
                        font-size: $font-size-medium-x;
                        &.active{
                            border-bottom: 6px solid $primary-color;
                            color: $primary-color;
                        }
                    }
                }
            }
            .time{
                padding:0.15rem 0.3rem;
                color: #2e2e2e;
                font-size: $font-size-small;
                span{
                    float: left;
                    line-height: 0.6rem;
                }
                span + span {
                    margin-left: 0.1rem;
                }
                .time-now{
                    height: 0.6rem;
                    width: 1.8rem;
                    padding: 0 0.1rem;
                    border: 1px solid #eee;
                    border-radius: 0.1rem;
                    position: relative;
                    img{
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        right: 0.1rem;
                    }
                    input{
                        width: 1.45rem;
                    }
                }
                .confirm{
                    margin-left: 0.3rem;
                    width: 1.5rem;
                    background-color: $primary-color;
                    color: #fff;
                    border-radius: 0.1rem;
                    text-align: center;
                }
            }
        }
        .tab-content{
            margin-top: 0.2rem;
            position: relative;
            .item + .item{
                margin-top: 0.2rem;
            }
            .item {
                font-size: $font-size-small-s;
                background-color: #fff;
                display: none;
                &.itemshow{
                    display: block;
                }
                .top{
                    padding: 0 0.3rem;
                    line-height: 0.6rem;
                    border-bottom: 1px solid #eee;
                    .top-right{
                        float: right;
                    }
                }
                .bottom{
                    padding: 0.3rem;
                    position: relative;
                    p + p {
                        margin-top: 0.36rem;
                    }
                    .more{
                        width: 0.2rem;
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        right: 0.3rem;
                    }
                }
            }
            .none{
                margin: 1.08rem auto;
                width: 2.25rem;
                height: 2.25rem;
                &.hide{
                    display: none;
                }
                img{
                    width: 100%;
                }
            }
            .none-text{
                margin-top: 0.4rem;
                font-size: $font-size-medium;
                color: #2e2e2e;
                text-align: center;
                &.hide{
                    display: none;
                }
            }
        }
        
    }
</style>
