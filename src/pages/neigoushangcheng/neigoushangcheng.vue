<template>
    <div class="neigoushangcheng">
        <div class="top">
            <img class="search" src="../../assets/imgs/search@2x.png">
            <input class="proName" type="text" placeholder="请输入您感兴趣的商品"></input>
        </div>
        <div>
            <div v-for="(item,index) in list" class="indexShow" @click="$router.push('/neigoushangcheng/goumaishangping?code=' + item.code)">
                <img :src="item.pic">
                <div class="showDetail">
                    <span class="showTitle">{{item.name}}</span>
                    <!-- <span class="showServe">美颜相机，让你跟我一样帅</span> -->
                    <div class="showPrice">
                        <span class="price">{{item.specsList[0].priceList[0].price / 1000}}</span>
                        <span class="showOldPrice">市场参考价：{{item.specsList[0].priceList[0].changePrice / 1000}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {queryProduct} from 'api/baohuo'
import {setCookie,getCookie} from 'common/js/cookie.js';
import {formatImg} from 'common/js/util';
export default {
  data(){
      return{
        list:[],
      }
  },
  methods:{

  },
  mounted(){
      let level = getCookie('level')
      queryProduct(level).then(res => {
          res.list.map(function(item){
              item.pic = formatImg(item.pic)
          })
          this.list = res.list
      })
  }
}
</script>
<style lang="scss" scoped>
.neigoushangcheng {
  /* 头部 */
  .top {
    height: 0.88rem;
    padding: 0.14rem 0.24rem;
    position: relative;
  }
  .proName {
    width: 100%;
    height: 0.60rem;
    padding-left: 0.70rem;
    font-size: 0.28rem;
    color: rgb(179, 179, 179);
    background-color: rgb(245, 245, 245);
    border-radius: 0.40rem;
    float: left;
  }
  .search {
    width: 0.24rem;
    height: 0.24rem;
    position: absolute;
    top: 50%;
    left: 0.61rem;
    transform: translateY(-50%);
  }

  /* 商品列表 */
  .indexShow {
    padding: 0.30rem 0.24rem;
    border-bottom: 1px solid #eee;
    position: relative;
    overflow: hidden;
  }
  .indexShow img {
    width: 2.40rem;
    height: 2.40rem;
    float: left;
  }
  .indexShow > div {
    margin-left: 2.60rem;
  }
  .showDetail {
    height: 2.40rem;
    padding: 0.10rem 0;
    position: relative;
  }
  .showDetail span {
    display: block;
    font-size: 16px;
  }
  .showDetail .showTitle {
    font-size: 0.28rem;
    color: rgb(72, 72, 72);
  }
  .showDetail .showServe {
    margin-top: 0.20rem;
    font-size: 0.24rem;
    color: rgb(102, 102, 102);
  }
  .showDetail .showPrice {
    position: absolute;
    left: 0;
    bottom: 0.10rem;
  }
  .showDetail .showPrice .price {
    display: inline-block;
    color: rgb(255, 80, 0);
    font-size: 0.34rem;
  }
  .showDetail .showPrice .showOldPrice {
    display: inline-block;
    margin-left: 0.30rem;
    font-size: 0.22rem;
    color: rgb(153, 153, 153);
  }
  .showPrice {
    color: #e92322;
  }
}
</style>
