<template>
  <div class="intentionalAgent">
      <div class="header clearfix">
          <div @click="changeIndex('')" :class="[index == '' ? 'active' : '']">
              <i>全部</i>
          </div>
          <div @click="changeIndex(2)" :class="[index == 2 ? 'active' : '']">
              <i>待发货</i>
          </div>
          <div @click="changeIndex(5)" :class="[index == 5 ? 'active' : '']">
              <i class="width">申请取消</i>
          </div>
      </div>
      <div class="item clearfix" v-for="(item,index) in list">
            <div class="top clearfix">
                <span class="user">提交人：{{'11' || item.user.realName || item.user.nickName}}（12345678901））</span>
                <span class="status">{{'11' || status[item.status]}}</span>
            </div>
            <div :class="['info']" ref="divInfo">
                <div class="downward" @click="changeHeight($event)">></div>
                <p>订单编号：{{'11' || item.code}}</p>
                <p>订单类型：{{'11' || item.kind}}</p>
                <p>下单时间：{{'11' || item.applyDatetime}}</p>
                <p>收货人：{{'11' || item.signer}}（{{'11' || item.mobile}}）</p>
                <p>收货地址：<i>{{'11' || item.province}}</i><i>{{'11' || item.city}}</i><i>{{'11' || item.area}}</i><i>{{'11' || item.address}}</i></p>
            </div>
            <div class="pic">
                <img :src="item.pic" alt="">
                <div class="content">
                    <p>{{'11' || item.productName}}</p>
                    <i>￥{{'11' || item.amount/1000}}</i>
                    <span>{{'11' || item.quantity}}瓶</span>
                </div>
            </div>
      </div>
      <div class="item clearfix">
            <div class="top clearfix">
                <span class="user">提交人：{{'11' || item.user.realName || item.user.nickName}}（12345678901））</span>
                <span class="status">{{'11' || status[item.status]}}</span>
            </div>
            <div :class="['info']" ref="divInfo">
                <div class="downward" @click="changeHeight($event)">></div>
                <p>订单编号：{{'11' || item.code}}</p>
                <p>订单类型：{{'11' || item.kind}}</p>
                <p>下单时间：{{'11' || item.applyDatetime}}</p>
                <p>收货人：{{'11' || item.signer}}（{{'11' || item.mobile}}）</p>
                <p>收货地址：<i>{{'11' || item.province}}</i><i>{{'11' || item.city}}</i><i>{{'11' || item.area}}</i><i>{{'11' || item.address}}</i></p>
            </div>
            <div class="pic">
                <img src="../../assets/imgs/buyimg.png" alt="">
                <div class="content">
                    <p>{{'11' || item.productName}}</p>
                    <i>￥{{'11' || item.amount/1000}}</i>
                    <span>{{'11' || item.quantity}}瓶</span>
                </div>
            </div>
            <div class="bottom clearfix">
                <div>汇总</div>
                <div>发货</div>
                <div>作废</div>
            </div>
      </div>
  </div>
</template>
<script>
import {queryOrderForm} from 'api/baohuo'
import {formatDate,formatImg} from 'common/js/util';
import {getUser,getUserById} from 'api/user';
export default {
  name:'IntentionalAgent',
  data(){
      return{
          index:'',
          list:[],
          hightShow:false,
          num:'',
          status:[
                "待支付",
                "已支付待审核",
                "已审单待发货",
                "待收货",
                "已收货",
                "申请取消",
                "已取消",

          ]
      }
  },
  methods:{
        changeIndex(index) {
            this.index = index
            this.check()
        },
        changeHeight(event) {
            console.log(event.target)
        },
        check(){
            queryOrderForm(this.index).then(res => {
                if(res.list.length <= 1) {
                    console.log(this.$refs.divInfo)
                }
                res.list.map(function(item){

                    //格式化图片
                    res.pic = formatImg(res.pic)
                    //格式化时间
                    res.applyDatetime = formatDate(res.applyDatetime)

                })
                this.list = res.list
            })
        }
  },
  mounted(){
      this.check()
  }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';
@import '../../common/scss/base.scss';
.intentionalAgent{
    background-color: #f7f7f7;
    height: 100%;
    .fl{
        float: left;
    }
    .header{
        background-color: #fff;
        >div{
            float: left;
            width: 33.33%;
            height: 0.9rem;
            position: relative;
            i{
                font-size: $font-size-medium;
                color:#333;
                line-height: 0.9rem;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                &.width{
                    width: 1.2rem;
                }
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
        background-color: #fff;
        .top{
            line-height: 0.8rem;
            color: #333;
            border-bottom: 1px solid #eee;
            .user{
                float: left;
                margin-left: 0.35rem;
                font-size: $font-size-small-s;
            }
            .status{
                float: right;
                color:$primary-color;
                font-size: $font-size-small;
                margin-right: 0.3rem;
            }
        }
        .info{
            padding: 0.3rem;
            border-bottom: 1px solid #eee;
            background-color: #fff;
            font-size: $font-size-small;
            // height: 0.9rem;
            overflow: hidden;
            position: relative;
            &.height{
                height: 4rem;
            }
            p + p {
                margin-top: 0.36rem;
            }
            p{
                i{
                    margin-left: 0.2rem;
                }
            }
            .downward{
                position: absolute;
                top: 0.3rem;
                right: 0.3rem;
                color: $primary-color;
                transform: rotateZ(90deg)
            }
        }
        .pic{
            padding: 0.2rem 0.3rem;
            background-color: #fff;
            overflow: hidden;
            border-bottom: 1px solid #eee;
            img {
            float: left;
            width: 1.8rem;
            height: 1.8rem;
            }
            .content {
                margin-left: 2rem;
                position: relative;
                p {
                    font-size: $font-size-medium-s;
                    color: #333;
                    line-height: 0.4rem;
                }
                i {
                    position: absolute;
                    top: 1.15rem;
                    left: 0;
                    font-size: $font-size-small;
                    color: $primary-color;
                }
                span {
                    width: 1.2rem;
                    line-height: 0.5rem;
                    position: absolute;
                    top: 0;
                    right: 0;
                    font-size: $font-size-small;
                    border-radius: 0.1rem;
                    color: #333;
                    text-align: center;
                }
            }
        }
        .bottom{
            padding: 0.3rem 0;
            >div{
                float: left;
                width:33.33%;
                height: 0.3rem;
                line-height: 0.3rem;
                color:$primary-color;
                font-size: $font-size-medium-s;
                text-align: center;
            }
            div+div{
                border-left: 1px solid $primary-color;
            }
        }
    }
}
</style>
