<template>
    <div class="neigouchuhuo">
        <div class="top" @click="$router.push('/dizhi?address=' + 3)">
            <img src="../../assets/imgs/more@2x.png" class="right">
            <img src="../../assets/imgs/shouhuodizhi@2x.png" class="left">
            <p class="name-mobile">
                <span>姓名：{{address.receiver}}</span>
                <i>电话：{{address.mobile}}</i>
            </p>
            <p class="address">
                收货地址：
                <i>{{address.province}}</i>
                <i>{{address.city}}</i>
                <i>{{address.area}}</i> {{address.address}}
            </p>
        </div>
        <div class="item" v-for="item in list">
            <img :src="item.product.pic" alt="">
            <div class="content">
                <div><p>产品名称：{{item.productName}}<p>数量：{{item.quantity}}</p><p>价格：{{item.product.price / 1000}}</p></p></div>

                <!-- <i>规格：{{item.product.specsList[0].name}}</i> -->
                <span @click="prodectDetail(item.code)">我要出货</span>
            </div>
        </div>
            <div :class="['mask',flag ? 'show' : '']" @click="genghuan"></div>
            <div :class="['buypart',buypartFlag ? 'show' : '']" v-if="detail.product">
              <div class="title">
                <div class="title-pic">
                  <img :src="detail.product.pic" alt="">
                </div>
                <div class="title-right">
                  <p>产品名称：{{detail.productName}}</p>
                  <span>请选择</span>
                  <i @click="genghuan">X</i>
                </div>
              </div>
              <div class="packaging">
                <p>包装</p>
              </div>
              <div class="packaging">
                <p>规格</p><input type="text" v-model="toUser" placeholder="输入收件人">
              </div>
              <div class="total-money">
                <div class="left">
                  <i class="text">合计：</i>
                  <i class="symbol">￥</i>
                  <i class="sum">{{detail.product.price / 1000 * number}}</i>
                </div>
                <div class="right">
                  <span class="diamonds" @click="add">+</span>
                  <span class="num">{{number}}</span>
                  <span class="diamonds" @click="sub">-</span>
                </div>
              </div>
              <div class="buypart-bottom" @click="confirm(detail.productSpecsCode)">
                提交订单
              </div>
            </div>
    </div>
</template>
<script>
import { getUser, getUserById } from "api/user";
import {
  getCloudList,
  queryDefaultAddress,
  getCloudDetail,
  cloudSend
} from "api/baohuo";
import { formatImg } from "common/js/util";
export default {
  data() {
    return {
      tipshow: false,
      buypartFlag: false,
      flag: false,
      userinfo: {},
      list: [],
      detail: {},
      address: {},
      text: "",
      num: 0,
      number: 1,
      toUser: ""
    };
  },
  methods: {
    changeTipShow() {
      this.tipshow = !this.tipshow;
    },

    //变换遮罩层显示与隐藏
    changeFlag() {
      this.flag = !this.flag;
    },

    //我的商品详情展示与隐藏
    changebuypartFlag() {
      this.buypartFlag = !this.buypartFlag;
    },
    genghuan() {
      this.changeFlag();
      this.changebuypartFlag();
      this.num = 0;
    },
    //选购产品数量+1
    add() {
      this.number++;
    },

    // 选购产品数量-1
    sub() {
      if (this.number >= 2) {
        this.number--;
      }
    },
    confirm(code) {
      let options = {
        address: this.address.address,
        area: this.address.area,
        city: this.address.city,
        province: this.address.province,
        mobile: this.address.mobile,
        quantity: this.number,
        productSpecsCode: code,
        signer: this.toUser
      };

      cloudSend(options).then(res => {
        if (res.isSuccess) {
          alert("发件成功！");
        }
      });
    },
    prodectDetail(code) {
      this.genghuan();

      //保存this
      let self = this;
      getCloudDetail(code).then(res => {
        res[0].product.pic = formatImg(res[0].product.pic);
        self.detail = res[0];
      });
    }
  },
  mounted() {
    getCloudList().then(res => {
      res.list.map(function(item) {
        item.product.pic = formatImg(item.product.pic);
      });
      this.list = res.list;
    });
    queryDefaultAddress().then(res => {
      this.address = res[0];
    });
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.woyaochuhuo {
  background-color: #f7f7f7;
  height: 100%;
  .top {
    height: 1.8rem;
    padding: 0.3rem 0.8rem;
    background-color: #fff;
    position: relative;
    img {
      width: 0.3rem;
      position: absolute;
      top: 50%;
      right: 0.3rem;
      transform: translateY(-50%);
      &.left {
        left: 0.28rem;
      }
      &.right {
        width: 0.2rem;
      }
    }
    .name-mobile {
      position: relative;
      i {
        position: absolute;
        left: 2.7rem;
      }
    }
    p {
      font-size: $font-size-medium;
      color: #333;
      &.address {
        margin-top: 0.24rem;
        font-size: $font-size-small;
        line-height: 0.4rem;
      }
    }
  }
  .header {
    height: 1.8rem;
    padding: 0.3rem 0.8rem;
    background-color: #fff;
    position: relative;
    img {
      width: 0.15rem;
      position: absolute;
      top: 50%;
      right: 0.3rem;
      transform: translateY(-50%);
      &.left {
        left: 0.3rem;
      }
    }
    p {
      font-size: $font-size-medium;
      color: #333;
      &.address {
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
        span {
          float: right;
        }
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
  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.7);
    position: fixed;
    top: 0;
    left: 0;
    display: none;
    &.show {
      display: block;
    }
  }
  .buypart {
    width: 100%;
    height: 8rem;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    display: none;
    z-index: 9;
    &.show {
      display: block;
    }
    // padding: 0 0.3rem;
    .title {
      height: 2.1rem;
      position: relative;
      border-bottom: 1px solid #eee;
      margin: 0 0.3rem;
      .title-pic {
        width: 2.26rem;
        height: 2.26rem;
        position: absolute;
        left: 0;
        bottom: 0.28rem;
        padding: 0.03rem;
        border-radius: 0.1rem;
        background-color: #fff;
        img {
          width: 2.2rem;
          height: 2.2rem;
        }
      }
      .title-right {
        margin-left: 2.46rem;
        position: relative;
        overflow: hidden;
        p {
          margin-top: 0.2rem;
          font-size: $font-size-medium;
          color: #333;
        }
        span {
          margin-top: 0.4rem;
          font-size: $font-size-medium;
          color: #999;
        }
        i {
          width: 0.34rem;
          line-height: 0.34rem;
          line-height: 0.34rem;
          font-size: $font-size-medium;
          text-align: center;
          color: #333;
          border: 1px solid #333;
          border-radius: 50%;
          position: absolute;
          top: 0.2rem;
          right: 0;
        }
      }
    }
    .packaging {
      height: 1.9rem;
      border-bottom: 1px solid #eee;
      overflow: hidden;
      margin: 0 0.3rem;
      p {
        margin-top: 0.3rem;
        margin-bottom: 0.4rem;
        font-size: $font-size-medium-xx;
        color: #333;
      }
      .select {
        overflow: hidden;
        span {
          float: left;
          width: 1.18rem;
          line-height: 0.64rem;
          border: 1px solid #ccc;
          text-align: center;
          font-size: $font-size-medium-s;
          border-radius: 0.1rem;
          border: 1px solid $primary-color;
          &.active {
            background-color: $primary-color;
            color: #fff;
          }
        }
        span + span {
          margin-left: 0.2rem;
        }
      }
    }
    .total-money {
      height: 1.2rem;
      border-bottom: 1px solid #eee;
      margin: 0 0.3rem;
      > div {
        width: 50%;
        height: 100%;
        float: left;
        overflow: hidden;
      }
      .left {
        i {
          float: left;
          margin-top: 0.4rem;
        }
        .text {
          font-size: $font-size-medium;
        }
        .symbol {
          font-size: $font-size-small;
          color: $primary-color;
        }
        .sum {
          font-size: $font-size-medium-xx;
          color: $primary-color;
        }
      }
      .right {
        span {
          margin-top: 0.4rem;
          float: right;
          text-align: center;
          line-height: 0.5rem;
        }
        .diamonds {
          width: 0.5rem;
          height: 0.5rem;
          background-color: #f5f5f5;
          font-size: $font-size-large-ss;
          color: #888;
        }
        .num {
          width: 0.9rem;
          font-size: $font-size-medium-x;
          color: #333;
        }
      }
    }
    .buypart-bottom {
      height: 0.9rem;
      line-height: 0.9rem;
      background-color: $primary-color;
      color: #fff;
      text-align: center;
      font-size: $font-size-medium-xx;
    }
  }
  .footer {
    width: 100%;
    line-height: 1rem;
    position: fixed;
    padding-left: 0.3rem;
    bottom: 0;
    background-color: #fff;
    span,
    i {
      float: left;
    }
    span {
      font-size: $font-size-medium-s;
      color: #333;
    }
    i {
      font-size: $font-size-medium-x;
      color: $primary-color;
    }
    .rigth {
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
