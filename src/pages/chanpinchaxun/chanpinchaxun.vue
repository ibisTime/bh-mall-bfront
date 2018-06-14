<template>
    <div class="buycloud">
        <div class="item" v-for="item in list">
            <img :src="item.product.pic">
            <div class="content">
                <p>产品名称：{{item.productName}}</p>
                <i>包装：{{item.productSpecsName}}</i>
                <span>￥{{item.product.price / 1000}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import { getCloudList, productDetail } from "api/baohuo";
import { setCookie, getCookie } from "common/js/cookie.js";
import { formatDate, formatImg } from "common/js/util";
export default {
  data() {
    return {
      list: []
    };
  },
  methods: {},
  created() {
    //获取用户等级
    let level = getCookie("level");

    getCloudList().then(res => {
      //遍历格式化图片
      res.list.map(function(item) {
        //查询产品详情
        item.product.pic = formatImg(item.product.pic);
      });
      this.list = res.list;
    });
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.buycloud {
  background-color: #f7f7f7;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .show {
    display: block !important;
  }
  .item {
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
        color: #999;
      }
      span {
        width: 1.2rem;
        line-height: 0.5rem;
        position: absolute;
        top: 1rem;
        right: 0;
        font-size: $font-size-small;
        border-radius: 0.1rem;
        color: $primary-color;
        text-align: center;
      }
    }
  }
}
</style>
