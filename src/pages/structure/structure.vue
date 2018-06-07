<template>
  <div class="structure">
      <div :class="['tip',tipshow ? 'none' : '']">
          <span>支出相关：啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊</span>
          <i @click="changeTipShow">
              <img src="../../assets/threshold/close.png" alt="">
          </i>
      </div>
      <div class="content">
          <div class="brand">
              <!-- <i class="title">当前品牌：小易</i> -->
              <div class="item">
                  <div>
                      <span class="fl text">联创</span>
                      <i class="fl bar"></i>
                        <span class="fl number">6</span>
                  </div>
              </div>
              <div class="item">
                  <div>
                      <span class="fl text">总代</span>
                      <i class="fl bar"></i>
                        <span class="fl number">6</span>
                  </div>
              </div>
              <div class="item">
                  <div>
                      <span class="fl text">总计</span>
                      <i class="fl bar"></i>
                        <span class="fl number">6</span>
                  </div>
              </div>
              <div class="item">
                  <div>
                      <span class="fl text">未授权</span>
                      <i class="fl bar"></i>
                        <span class="fl number">6</span>
                  </div>    
              </div>
          </div>
          <div class="blank"></div>
          <div class="list">
             <p @click="showInfo($event)" v-for="(item,index) in lists" :key="index" :id="item.userId">
                 <span :id="item.userId">[{{item.level}}]</span>
                 <i :id="item.userId">{{item.realName}}</i>
             </p>
          </div>
      </div>
      <div :class="['mask',show ? 'show' : '']" @click="changeShow"></div>
      <div :class="['modal-frame',show ? 'show' : '']">
          <div class="model-top">
              <div class="container">
                <div class="user-head">
                    <img src="../../assets/structure/head02.png" alt="">
                </div>
                <div class="user-info">
                    <p class="username">{{userInfo.realName}}</p>
                    <p class="userwx">微信号：{{userInfo.wxId}}</p>
                </div>
              </div>
          </div>
          <div class="model-mmiddle">
            <div class="item">
                <span>电话:</span>
                <i>{{userInfo.mobile}}</i>
            </div>
            <div class="item">
                <span>省市:</span>
                <i>{{userInfo.province}}{{userInfo.area}}</i>
            </div>
            <div class="item">
                <span>地址:</span>
                <i>{{userInfo.address}}</i>
            </div>
            <div class="item">
                <span>状态:</span>
                <i class="active">{{status[userInfo.status]}}</i>
            </div>
            <div class="item">
                <span>余额:</span>
                <i>{{amount}}</i>
            </div>
          </div>
          <div class="model-bottom">
              <div class="model-bottom-left fl" @click="$router.push('/acceptimg')">
                  查看授权证书
              </div>
              <div class="model-bottom-right fl">
                  查看代理出货
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import {getTrack,getLevel,getStructure,getMySub,getBill} from 'api/baohuo'
import {setCookie,getCookie} from 'common/js/cookie';
import {formatDate} from 'common/js/util';
import {getUser,getUserById} from 'api/user';
import {status} from 'api/status';
export default {
  data(){
      return{
          show : false,
          tipshow : false,
          lists:[],
          userInfo:{},
          amount:'',
          status:[],
      }
  },
  methods:{
      changeShow(){
          this.show = !this.show;
      },
      changeTipShow(){
          this.tipshow = !this.tipshow;
      },
      showInfo(event){
          this.show = !this.show;
          var userId = event.target.getAttribute('id')
            getBill(userId).then(res => {
                console.log(res)
                this.amount = res[0].amount
            })
            getUserById(userId).then(res => {
                this.userInfo = res
            })
      },
  },
  mounted(){
      this.status = status
        getMySub().then(res => {
            this.lists = res.list
            res.list.map(function(item){
                getLevel(item.level).then(res => {
                    item.level = res[0].name
                })
            })
        })





        // getStructure(userId).then(res => {
        //     console.log(res)
        //     this.lists = res.list
        //     res.list.map(function(item){
        //         getLevel(item.level).then(res => {
        //             item.level = res[0].name
        //         })
        //     })
        // })
  }
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
    .structure{

        .fl{
            float: left;
        }
        .show{
            display: block !important;
        }
        .tip{
            height: 0.6rem;
            line-height: 0.6rem;
            padding-left: 0.3rem;
            background-color: #fff9e3;
            color: #feaa00;
            font-size: $font-size-small;
            &.none{
                display: none;
            }
            i{
                width: 0.6rem;
                height: 0.6rem;
                float: right;
                text-align: center;
                margin-right: 12px;
                img{
                    width: 0.24rem;
                }
            }
        }
        .blank{
            height: 0.2rem;
            background-color: #f7f7f7;
        }
        .content{
            .brand{
                padding-left: 0.3rem;
                padding-top: 0.48rem;
                padding-bottom: 0.5rem;
                display: none;
                .title{
                    display: block;
                    font-size: $font-size-medium-x;
                    color: #333;
                    margin-bottom: 0.42rem;
                }
                .item + .item{
                    margin-top: 0.3rem;
                }
                .item {
                    overflow: hidden;
                        font-size: $font-size-small-s;
                    .text{
                        width: 0.9rem;
                        color: #333;
                        text-align: right;
                    }
                    .bar{
                        width: 3rem;
                        height: 0.24rem;
                        margin-left: 0.2rem;
                        border-radius: 0.04rem;
                        background-color: #b2da7b;
                    }
                    .number{
                        margin-left: 0.2rem;
                    }
                }
            }
            .list{
                p{
                    height: 0.9rem;
                    line-height: 0.9rem;
                    border-bottom: 1px solid #eee;
                    font-size: $font-size-medium;
                    span{
                        margin-left: 0.3rem;
                        color: $primary-color;
                    }
                    i{
                        margin-left: 0.2rem;
                        color: #333;
                    }
                }
            }
        }
        .mask{
            width: 100%;
            height: 100%;
            position: fixed;
            background-color: rgba($color: #000000, $alpha: 0.6);
            top: 0;
            left: 0;
            z-index: 99;
            display: none;
        }
        .modal-frame{
            width: 6.1rem;
            height: 5.3rem;
            border-radius: 0.2rem;
            background-color: #fff;
            position: fixed;
            top: 2.54rem;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
            overflow: hidden;
            display: none;
            .model-top{
                height: 1.3rem;
                position: relative;
                background-color: #f7f7f7;
                .container{
                    height: 0.84rem;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    .user-head{
                        width: 0.84rem;
                        height: 0.84rem;
                        padding: 0.02rem;
                        margin-left: 0.5rem;
                        border-radius: 50%;
                        display: inline-block;
                        img{
                            width: 0.8rem;
                        }
                    }
                    .user-info{
                        display: inline-block;
                        margin-left: 0.3rem;
                        .username{
                            font-size: $font-size-medium-s;
                            color: #333;
                        }
                        .userwx{
                            margin-top: 0.16rem;
                            font-size: $font-size-small;
                            color: #999;
                        }
                    }
                }
            }
            .model-mmiddle{
                height: 3.16rem;
                padding-top: 0.4rem;
                padding-left: 0.5rem;
                font-size: $font-size-small;
                color: #333;
                .item + .item {
                    margin-top: 0.24rem;
                }
                .item{
                    span{
                    letter-spacing: 0.1rem;
                }
                    i{
                        margin-left: 0.3rem;
                        &.active{
                            color: #f32626;
                        }
                    }
                }
            }
            .model-bottom{
                border-top: 1px solid #dedede;
                div + div{
                    border-left: 1px solid #dedede;
                }
                >div{
                    width: 50%;
                    height: 0.84rem;
                    line-height: 0.84rem;
                    text-align: center;
                    font-size: $font-size-small;
                    color: $primary-color;
                }
            }
        }
    }
</style>
