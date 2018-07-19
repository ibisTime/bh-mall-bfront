<template>
  <div class="intentionalAgent">
      <div class="header clearfix">
          <div @click="changeIndex('')" :class="[index == '' ? 'active' : '']">
              <i>全部</i>
          </div>
          <div @click="changeIndex('2')" :class="[index == '2' ? 'active' : '']">
              <i>待发货</i>
          </div>
          <div @click="changeIndex('3')" :class="[index == '3' ? 'active' : '']">
              <i>已发货</i>
          </div>
          <div @click="changeIndex('4')" :class="[index == '4' ? 'active' : '']">
              <i>已收货</i>
          </div>
          <div @click="changeIndex('0','1')" :class="[index == '0' ? 'active' : '']&&[index == '1' ? 'active' : '']">
              <i class="width">申请取消</i>
          </div>
      </div>
      <div class="item clearfix" v-for="(item,index) in list">
            <div class="top clearfix">
                <span class="user">提交人：{{item.user.realName || item.user.nickName}}（{{item.user.mobile}}）</span>
                <span class="status">{{status[item.status]}}</span>
            </div>
            <div class="info" :class="{ active: heightActive === index }" ref="divInfo">
                <div class="downward" @click="changeHeight(index)">></div>
                <p>订单编号：{{item.code}}</p>
                <p>订单类型：{{item.kind}}</p>
                <p>下单时间：{{item.applyDatetime}}</p>
                <p>收货人：{{item.signer}}（{{item.mobile}}）</p>
                <p>收货地址：<i>{{item.province}}</i><i>{{item.city}}</i><i>{{item.area}}</i><i>{{item.address}}</i></p>
            </div>
            <div class="pic">
                <img :src="formatImg(item.pic)" alt="">
                <div class="content">
                    <p>{{item.productName}}</p>
                    <p style="padding-top:0.1rem;">{{item.productSpecsName}}</p>
                    <i>￥{{item.price/1000}}</i>
                    <span>{{item.quantity}}{{item.productSpecsName}}</span><span class="status">{{item.kind == '2' ? '购买云仓' : '云仓提货'}}</span>
                    <div class="shouhuo" @click="shouhuo(item.code)" v-if="item.status == '3'">收货</div>
                    <div class="wuliu" @click="wuliu(item.logisticsCode, item.logisticsCompany)" v-if="item.status == '3'">物流信息</div>
                  <div class="quxiao" @click="shenqingquxiao(item.code)" v-if="item.status == '0'">取消</div>
                  <div class="quxiao" @click="shenqingquxiao(item.code)" v-if="item.status == '1'">取消</div>
                </div>
            </div>
      </div>
      <toast ref="toast" :text="toastText"></toast>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import { queryOrderForm, receiveNromalOrder,quXiao} from "api/baohuo";
import { formatDate, formatImg } from "common/js/util";
import { getUser, getUserById } from "api/user";
export default {
  data() {
    return {
      index: "",
      list: [],
      hightShow: false,
      num: "",
      status: [
        "待支付",
        "已支付待审核",
        "已审单待发货",
        "待收货",
        "已收货",
        "申请取消",
        "已取消"
      ],
      heightActive: '',
      toastText: ''
    };
  },
  methods: {
    changeIndex(index) {
      this.index = index;
      this.check();
    },
    changeHeight(index) {
      this.heightActive = this.heightActive === index ? '' : index;
    },
    formatImg(img) {
      return formatImg(img);
    },
    check() {
      if (this.index == 2) {
        queryOrderForm([1, 2]).then(res => {
          if (res.list.length <= 1) {
            console.log(this.$refs.divInfo);
          }
          res.list.forEach(function(item) {
            //格式化时间
            res.applyDatetime = formatDate(res.applyDatetime);
          });

          this.list = res.list;
        });
      }  else if (this.index == ''){
        queryOrderForm([]).then(res => {
          if (res.list.length <= 1) {
            console.log(this.$refs.divInfo);
          }
          res.list.map(function(item) {
            //格式化时间
            res.applyDatetime = formatDate(res.applyDatetime);
          });
          console.log(res.list);
          this.list = res.list;
        });
      }else {
        queryOrderForm([this.index]).then(res => {
          if (res.list.length <= 1) {
            console.log(this.$refs.divInfo);
          }
          res.list.map(function(item) {
            //格式化时间
            res.applyDatetime = formatDate(res.applyDatetime);
          });
          this.list = res.list;
        });
      }
    },
    shouhuo(code) {
      receiveNromalOrder(code).then(res => {
        if (res.isSuccess == true) {
          this.toastText = '收货成功';
          this.$refs.toast.show();
          this.list.map(item => {
            if (item.code == code) {
              item.status = '4'
            }
          })
        }
      })
    },
    wuliu(code, company) {
      // this.toastText = '物流单号：'+code+'物流公司：'+company;
      // this.$refs.toast.show();
      this.$router.push('/wuliu?code='+code+'&company='+company);
    },
    shenqingquxiao(code){
      quXiao(code).then(res => {
          if(res.isSuccess == true){
            this.toastText = '取消成功';
            this.$refs.toast.show();
            window.location.reload()
          }
      })
    }
  },
  mounted() {
    this.check();
  },
  components: {
      Toast
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
@import "../../common/scss/base.scss";
.intentionalAgent {
  background-color: #f7f7f7;
  height: 100%;
  .fl {
    float: left;
  }
  .header {
    background-color: #fff;
    > div {
      float: left;
      width: 20%;
      height: 0.9rem;
      position: relative;
      i {
        font-size: $font-size-medium;
        color: #333;
        line-height: 0.9rem;
        position: absolute;
        left: 43%;
        transform: translateX(-50%);
        &.width {
          width: 1.2rem;
        }
      }
      &.active {
        i {
          color: $primary-color;
          border-bottom: 0.06rem solid $primary-color;
        }
      }
    }
  }
  .item {
    margin-top: 0.2rem;
    background-color: #fff;
    .top {
      line-height: 0.8rem;
      color: #333;
      border-bottom: 1px solid #eee;
      .user {
        float: left;
        margin-left: 0.35rem;
        font-size: $font-size-small-s;
      }
      .status {
        float: right;
        color: $primary-color;
        font-size: $font-size-small;
        margin-right: 0.3rem;
      }
    }
    .info {
      padding: 0.3rem;
      border-bottom: 1px solid #eee;
      background-color: #fff;
      font-size: $font-size-small;
      height: 0.9rem;
      overflow: hidden;
      position: relative;
      &.active {
        height: auto;
      }
      p + p {
        margin-top: 0.36rem;
      }
      p {
        i {
          margin-left: 0.2rem;
        }
      }
      .downward {
        position: absolute;
        top: 0;
        right: 0;
        padding: 0.3rem;
        color: $primary-color;
        transform: rotateZ(90deg);
      }
      .status {
        float: right;
        color: #72a52c;
        font-size: 0.24rem;
      }
    }
    .pic {
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
          text-align: right;
          &.status {
            top: 0.5rem;
            color: #72a52c;
          }
        }
        .wuliu {
          font-size: 0.3rem;
          position: absolute;
          top: 1.15rem;
          right: 1.2rem;
          border: 1px solid #333;
          border-radius: 0.1rem;
          padding: 0.1rem 0.14rem;
        }
        .quxiao {
          font-size: 0.3rem;
          position: absolute;
          top: 1.15rem;
          right: 1.2rem;
          border: 1px solid #333;
          border-radius: 0.1rem;
          padding: 0.1rem 0.14rem;
        }
        .shouhuo {
          font-size: 0.3rem;
          position: absolute;
          top: 1.15rem;
          right: 0.2rem;
          border: 1px solid #333;
          border-radius: 0.1rem;
          padding: 0.1rem 0.14rem;
        }
      }
    }
    .total {
      padding: 0.3rem;
      border-bottom: 1px solid #eee;
      font-size: $font-size-medium-s;
      color: #333;
      text-align: right;
      p + p {
        margin-top: 0.18rem;
      }
    }
  }
}
</style>
