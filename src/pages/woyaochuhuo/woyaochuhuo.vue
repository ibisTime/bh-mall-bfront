<template>
    <div class="woyaochuhuo">
        <div class="header">
            <img src="../../assets/imgs/more@2x.png"  class="right">
            <img src="../../assets/imgs/more@2x.png"  class="left">
            <p class="name-mobile">
                <span>姓名：{{userinfo.realName}}</span>
                <i>电话：{{userinfo.mobile}}</i>
            </p>
            <p class="address">
                收货地址：<i>{{userinfo.province}}</i> <i>{{userinfo.city}}</i> <i>{{userinfo.area}}</i> {{userinfo.address}}
            </p>
        </div>
        <div class="item">
            <img src="../../assets/imgs/buyimg.png" alt="">
            <div class="content">
                <p>{{'如意金箍棒'}}</p>
                <i>包装：{{'根'}}</i>
                <span>我要出货</span>
            </div>
        </div>
        <div class="item">
            <img src="../../assets/imgs/buyimg.png" alt="">
            <div class="content">
                <p>{{'如意金箍棒'}}</p>
                <i>包装：{{'根'}}</i>
                <span>我要出货</span>
            </div>
        </div>
        <div class="footer">
            <span >金额：</span><i>190积分</i>
            <div class="rigth">
                确定
            </div>
        </div>
    </div>
</template>
<script>
import {getUser,getUserById} from 'api/user';
export default {
  data(){
      return{
          userinfo:{},
      }
  },
  methods:{

  },
  mounted(){
      getUser().then(res => {
          this.userinfo = res
      })
  }
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
    .woyaochuhuo{
        background-color: #f7f7f7;
        height: 100%;
        .header{
            height: 1.8rem;
            padding: 0.3rem 0.8rem;
            background-color: #fff;
            position: relative;
            img{
                width: 0.15rem;
                position: absolute;
                top: 50%;
                right: 0.3rem;
                transform: translateY(-50%);
                &.left{
                    left: 0.3rem;
                }
            }
            p{
                font-size: $font-size-medium;
                color:#333;
                &.address{
                    margin-top: 0.24rem;
                    font-size: $font-size-small;
                    line-height: 0.4rem;
                }
            }
        }
        .item {
            margin-top: 0.2rem;
            padding: 0.2rem 0.3rem;
            background-color: #fff;
            overflow: hidden;
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
                    color: #999;
                }
                span {
                    width: 1.2rem;
                    line-height: 0.5rem;
                    position: absolute;
                    top: 1rem;
                    right: 0;
                    background-color: $primary-color;
                    font-size: $font-size-small;
                    border-radius: 0.1rem;
                    color: #fff;
                    text-align: center;
                }
            }
        }
        .footer{
            width: 100%;
            line-height: 1rem;
            position: fixed;
            padding-left: 0.3rem;
            bottom: 0;
            background-color: #fff;
            span,i{
                float: left;
            }
            span{
                font-size: $font-size-medium-s;
                color: #333;
            }
            i{
                font-size: $font-size-medium-x;
                color:$primary-color;
            }
            .rigth{
                float: right;
                width: 2.1rem;
                color: #fff;
                font-size: $font-size-medium-x;
                background-color: $primary-color;
                text-align: center;
            }
        }
    }
</style>
