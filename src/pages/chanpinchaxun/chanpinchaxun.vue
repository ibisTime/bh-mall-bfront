<template>
    <div class="buycloud">
      <div class="item" v-for="item in list" v-show="list.length" @click="$router.push('/chanpinchaxun/chanpinDetail?code=' + item.code)">
          <img :src="item.product.pic">
          <div class="content">
            <p>产品名称：{{item.productName}}</p>
            <div class="baozhuang" v-for="v in item.specsList">
              <p>包装：{{v.specsName}}</p>
              <p>单价：￥{{formatAmount(v.price)}}</p>
              <p>库存{{v.quantity}}</p>
            </div>
          </div>
      </div>
      <div v-show="!list.length">
        <no-result title="抱歉，暂无内容"></no-result>
      </div>
    </div>
</template>
<script>
import { getCloudList, productDetail } from "api/baohuo";
import { setCookie, getCookie } from "common/js/cookie.js";
import { formatDate, formatImg, formatAmount } from "common/js/util";
import NoResult from 'base/no-result/no-result';

export default {
  data() {
    return {
      list: []
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    }
  },
  created() {
    //获取用户等级
    getCloudList().then(res => {
      //遍历格式化图片
      res.list.map(function(item) {
        //查询产品详情
        item.product.pic = formatImg(item.product.pic);
      });
      this.list = res.list;
    }).catch(() => {});
  },
  components: {
    NoResult
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
      .baozhuang {
        height: 0.5rem;
        line-height: 0.5rem;
        p {
          display: inline-block;
        }
      }
    }
  }
}
</style>
