<template>
  <div class="shangpinliebiao">
    <div class="header">
      <span class="left" @click="back">取消</span>
      <span class="center">商品列表</span>
      <span class="right" @click="backParams">确定</span>
    </div>
    <div v-if="flag == 1" class="item" v-for="(item,index) in list" @click="choose(item.code,index)">
      <div :class="['circle',num === index ? 'active' : '']"></div>
      <img :src="item.pic">
      <div class="content">
        <p>{{item.name}}</p>
        <div v-for="v in item.specsList">
          <p>￥{{v.priceList[0].changePrice / 1000}}/{{v.name}}</p>
        </div>
      </div>
    </div>
    <div v-if="flag == 2" class="item" v-for="(item,index) in list" @click="choose(item.code,index)">
      <div :class="['circle',num === index ? 'active' : '']"></div>
      <img :src="item.product.pic">
      <div class="content">
        <p>{{item.productName}}</p>
        <i>￥{{item.price / 1000}}</i>
        <span>{{item.quantity}}{{item.specsName}}</span>
      </div>
    </div>
    <full-loading :title="title" v-show="loading"></full-loading>
  </div>
</template>
<script>
import FullLoading from 'base/full-loading/full-loading';
import {queryProduct,getCloudList,productDetail,getCloudDetail,_productDetail} from 'api/baohuo'
import {getUser,getUserById} from 'api/user';
import {setCookie,getCookie} from 'common/js/cookie.js';
import {formatDate,formatImg} from 'common/js/util';
export default {
    data(){
      return{
        list:[],
        code:'',
        flag:'',
        num:'',
        level:'',
        title: '正在加载...',
        loading: false
      }
    },
    methods:{
        choose(code,index){
            this.code = code;
            this.num = index;
            if(this.flag == 1) {
              this.loading = true;
                productDetail({
                  level: this.level,
                  code: this,code
                }).then(res => {
                  this.loading = false;
                  setCookie('myDetail',JSON.stringify(res))
                })
            }else if(this.flag == 2) {
              this.loading = true;
              getCloudDetail(this.code).then(res => {
                this.loading = false;
                setCookie('cloudDetail',JSON.stringify(res))
              })
            }
        },
        backParams(){
            this.$router.push('/woyaozhihuan?flag='+ this.flag +'&code=' + this.code)
        },
        back(){
            this.$router.push('/woyaozhihuan')
        }
    },
    mounted(){
      this.flag = this.$route.query.flag;
      if(this.flag == '1') {
        //查询我的商品
        this.loading = true;
        getUser().then((res) => {
          this.level = res.level;
          queryProduct({
            level: res.level,
            status: '2'
          }).then(res =>{
            this.loading = false;
            res.list.map(function(item){
              item.pic = formatImg(item.pic)
            });
            this.list = res.list
          })
        });
      }else if(this.flag == '2') {
        //获取云仓商品
        this.loading = true;
        getCloudList().then(res => {
          //遍历格式化图片
          this.loading = false;
          res.list.map(function(item){
            item.product.pic = formatImg(item.product.pic)
            //查询产品详情
            // getCloudDetail(item.code).then(info => {
            //     item.pic = formatImg(info.pic)
            // })
          });
          this.list = res.list;
        }).catch(() => { this.loading = false })
      }
    },
  components: {
    FullLoading
  }
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
@import "../../common/scss/base.scss";
    .shangpinliebiao{
        background-color: #f7f7f7;
        height: 100%;
        .header{
            height: 1rem;
            position: relative;
            border-bottom: 1px solid #eee;
            background-color: #fff;
            >span{
                position: absolute;
                top: 0;
                line-height: 1rem;
                font-size: $font-size-medium-x;
                text-align: center;
                &.left{
                    left: 0;
                    width: 1.4rem;
                    color: #999;
                }
                &.right{
                    right: 0;
                    width: 1.4rem;
                    color: $primary-color;
                }
                &.center{
                    width: 1.4rem;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: $font-size-medium-xx;
                }
            }
        }
        .item{
            padding: 0.2rem 0.3rem;
            padding-left: 0.9rem;
            background-color: #fff;
            overflow: hidden;
            border-bottom: 1px solid #eee;
            position: relative;
            .circle{
                width: 0.4rem;
                height: 0.4rem;
                position: absolute;
                left: 0.25rem;
                top: 50%;
                transform: translateY(-50%);
                border: 1px solid #dedede;
                border-radius: 50%;
                &.active{
                    background-color: $primary-color;
                }
            }
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
                    font-size:$font-size-medium-x;
                    border-radius: 0.1rem;
                    color: #333;
                    text-align: center;
                }
            }
        }
    }
</style>
