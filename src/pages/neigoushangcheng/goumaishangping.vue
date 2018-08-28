<template>
    <div class="goumaishangping">
        <div class="top">
            <img src="../../assets/imgs/more@2x.png"  class="right">
            <img src="../../assets/imgs/shouhuodizhi@2x.png"  class="left">
            <p class="name-mobile">
                <span>姓名：{{userinfo.realName}}</span>
                <i>电话：{{userinfo.mobile}}</i>
            </p>
            <p class="address">
                收货地址：<i>{{userinfo.province}}</i> <i>{{userinfo.city}}</i> <i>{{userinfo.area}}</i> {{userinfo.address}}
                111111111111111
            </p>
        </div>
        <div class="header">
            <p class="title">name</p>
            <div class="price">
                <div class="newPrice">
                    <span class="ico">￥</span>
                    <span>49.00</span>
                </div>
                <div class="oldPrice">市场参考价：￥20</div>
            </div>
        </div>
    </div>
</template>
<script>
import {productDetail} from 'api/baohuo'
import {setCookie,getCookie} from 'common/js/cookie.js';
import {formatImg} from 'common/js/util';
import {getUser,getUserById} from 'api/user';
export default {
  data(){
      return{
          userinfo:{},
      }
  },
  methods:{},
  mounted(){
      getUser().then(res => {
          this.userinfo = res;
          this.level = res.level;
      })
      let code = this.$route.query.code;
      productDetail({
        level: this.level,
        code: code
      }).then(res => {
      })
  },
}
</script>

<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
    .goumaishangping{
        height: 100%;
        background-color: #f7f7f7;
        .top{
            height: 1.8rem;
            padding: 0.3rem 0.8rem;
            background-color: #fff;
            position: relative;
            img{
                width: 0.3rem;
                position: absolute;
                top: 50%;
                right: 0.3rem;
                transform: translateY(-50%);
                &.left{
                    left: 0.28rem;
                }
                &.right{
                    width: 0.2rem;
                }
            }
            .name-mobile{
                position: relative;
                i{
                    position: absolute;
                    left: 2.7rem;
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
        .header{
            margin-top: 0.2rem;
            padding: 0.28rem 0.24rem;
            background-color: #fff;
            .title{
                font-size: $font-size-medium-xx;
                color: rgb(51, 51, 51);
                line-height: 0.4rem;
            }
            .price{
                margin-top: 0.3rem;
                >div{
                    float: left;
                }
                .newPrice{
                    font-size: $font-size-large-s;
                    color: $primary-color;
                    .ico{
                        font-size: $font-size-small
                    }
                }
                .oldPrice{
                    margin-left: 1.6rem;
                    font-size: $font-size-small;
                    color: #999;
                }
            }
        }
    }
</style>

