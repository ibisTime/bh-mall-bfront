<template>
    <div class="huopinjilu">
        <div class="header">
            <img :src="formatImg(info.product && info.product.pic)" alt="">
            <div class="content">
                <p>{{ info.productName}}</p>
                <i v-for="item in info.specsList" class="guige">￥{{formatAmount(item.price)}}元/{{item.specsName}}</br></i>
            </div>
        </div>
    </div>
</template>
<script>
import {queryProductDetail,getCloudDetail} from 'api/baohuo'
import {formatDate, formatImg, formatAmount} from 'common/js/util';
export default {
  data(){
      return{
          info:{}
      }
  },
  methods: {
    formatImg(pic) {
        return formatImg(pic);
    },
    formatAmount(amount) {
      return formatAmount(amount);
    }
  },
  mounted(){
      let code =  this.$route.query.code
      let productCode = this.$route.query.productCode
    //   queryProductDetail(productCode).then(res => {
    //         console.log(res)
    //         res.list.map(function(item){

    //             //格式化时间
    //             item.approveDatetime = formatDate(item.approveDatetime)
    //         })
    //       this.list = res.list
    //   })
      getCloudDetail(code).then(res => {
          this.info = res
      })
  }
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
    .huopinjilu{
        background-color: #f7f7f7;
        height: 100%;
        line-height: 0.03rem !important;
        .header {
            margin-bottom: 0.2rem;
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
                    font-size: $font-size-small;
                    color: $primary-color;
                }
                span {
                    width: 1.2rem;
                    line-height: 0.5rem;
                    position: absolute;
                    top: 0;
                    right: 0;
                    font-size:$font-size-medium-x;
                    border-radius: 0.1rem;
                    color: #333;
                    text-align: center;
                }
                .guige {
                    display: inline-block;
                    width: 100%;
                    margin: 0;
                    padding: 0
                }
            }
        }
        .item{
            padding: 0.26rem 0.3rem;
            color: #333;
            border-bottom: 1px solid #eee;
            background-color: #fff;
            p + p {
                margin-top: 0.2rem;
            }
            .top{
                font-size: $font-size-medium-s;
                overflow: hidden;
                span{
                    float: left;
                }
                i{
                    float: right;
                }
            }
            .center{
                font-size:$font-size-small;
            }
            .bottom{
                font-size: $font-size-small-s;
                color: #999;
            }
        }
    }
</style>
