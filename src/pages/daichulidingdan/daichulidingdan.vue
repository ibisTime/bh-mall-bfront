<template>
  <div class="intentionalAgent">
      <div class="header clearfix">
          <div @click="changeIndex(1)" :class="[index == '1' ? 'active' : '']">
              <i>全部</i>
          </div>
          <div @click="changeIndex(2)" :class="[index == 2 ? 'active' : '']">
              <i>待发货</i>
          </div>
          <div @click="changeIndex(5)" :class="[index == 5 ? 'active' : '']">
              <i class="width">申请取消</i>
          </div>
      </div>
      <div class="item clearfix" v-for="(item,index) in list">
            <div class="top clearfix">
                <span class="user">提交人：{{item.user.realName}}</span>
                <span class="status">{{status[item.status]}}</span>
            </div>
            <div :class="['info']" ref="divInfo">
                <div class="downward" @click="changeHeight($event)">></div>
                <p>订单编号：{{item.code}}</p>
                <p>订单类型：{{item.kind}}</p>
                <p>下单时间：{{item.applyDatetime}}</p>
                <p>收货人：{{item.signer}}{{item.mobile}}</p>
                <p>收货地址：<i>{{ item.user.province}}</i><i>{{ item.user.city}}</i><i>{{ item.user.area}}</i><i>{{ item.user.address}}</i></p>
            </div>
            <div class="pic">
                <img :src="item.pic" alt="">
                <div class="content">
                    <p>{{ item.productName}}</p>
                    <i>￥{{ item.amount/1000}}</i>
                    <span>{{ item.quantity}}瓶</span>
                </div>
            </div>
            <div class="item clearfix">
            <div class="bottom clearfix">
                <div @click="changeFlag">云仓发</div>
                <div @click="changeFlag1">自发</div>
                <div>作废</div>
            </div>
                  <div :class="['mask',flag ? 'show' : '']" @click="changeFlag"></div>
                  <div :class="['line',flag ? 'show' : '']" ></div>
                  <div :class="['erweima',flag ? 'show' : '']">
                      <div class="erweima-top">
                          <div class="info">
                            <p>确认发货？</p>
                            <p>请输入物流编号</p><input v-model='logisticsCode'/>
                            <p>请输入物流公司</p><input v-model='logisticsCompany'/>
                            <p>请输入物流单</p><input v-model='pdf'/>
                          </div>
                           <div>
                             <button @click="fahuo(item.code)">确认</button>
                             <button>返回</button>
                          </div>
                      </div>
                  </div>
                  <div :class="['mask',flag ? 'show' : '']" @click="changeFlag1"></div>
                  <div :class="['line',flag ? 'show' : '']" ></div>
                  <div :class="['erweima',flag ? 'show' : '']">
                      <div class="erweima-top">
                          <div class="info1">
                            <p>确认发货？</p>
                            <p>请输入物流编号</p><input v-model='logisticsCode'/>
                            <p>请输入物流公司</p><input v-model='logisticsCompany'/>
                            <p>请输入物流单</p><input v-model='pdf'/>
                          </div>
                           <div>
                             <button @click="zifafahuo(item.code)">确认</button>
                             <button>返回</button>
                          </div>
                      </div>
                  </div>
      </div>
      </div>

  </div>
</template>
<script>
import { queryOrderForm1, yunfahuo, noyunfahuo } from "api/baohuo";
import { formatDate, formatImg } from "common/js/util";
import { getUser, getUserById } from "api/user";
import { MessageBox } from "mint-ui";
import Vue from "vue";
Vue.component(MessageBox.name, MessageBox);
export default {
  name: "IntentionalAgent",
  data() {
    return {
      flag: false,
      index: 1,
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
      logisticsCode: "",
      logisticsCompany: "",
      pdf: ""
    };
  },
  methods: {
    changeFlag() {
      this.flag = !this.flag;
    },
    changeFlag1() {
      this.flag = !this.flag;
    },
    changeIndex(index) {
      this.index = index;
      this.check();
    },
    fahuo(code) {
      if (
        this.logisticsCode == "" &&
        this.logisticsCompany == "" &&
        this.pdf == ""
      ) {
        alert("请填写完整的发货信息！");
      }
      let options = {
        logisticsCode: this.logisticsCode,
        logisticsCompany: this.logisticsCompany,
        pdf: this.pdf,
        code: code
      };
      noyunfahuo(options).then(res => {
        if (res) {
          alert("发货成功！");
        }
      });
    },
    zifafahuo(code) {
      if (
        this.logisticsCode == "" &&
        this.logisticsCompany == "" &&
        this.pdf == ""
      ) {
        alert("请填写完整的发货信息！");
      }
      let options = {
        logisticsCode: this.logisticsCode,
        logisticsCompany: this.logisticsCompany,
        pdf: this.pdf,
        code: code
      };
      yunfahuo(options).then(res => {
        if (res) {
          alert("发货成功！");
        }
      });
    },
    changeHeight(event) {
    },
    check() {
      if (this.index == "2") {
        var status = [1, 2];
      }
      if (this.index == '1') {
         var status = [];
      }
      queryOrderForm1(status || [this.index]).then(res => {
        if (res.list.length <= 1) {
          console.log(this.$refs.divInfo);
        }
        res.list.map(function(item) {
          //格式化图片
          item.pic = formatImg(item.pic);
          //格式化时间
          item.applyDatetime = formatDate(item.applyDatetime);
        });
        this.list = res.list;
      });
    }
  },
  mounted() {
    this.check();
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
      width: 33.33%;
      height: 0.9rem;
      position: relative;
      i {
        font-size: $font-size-medium;
        color: #333;
        line-height: 0.9rem;
        position: absolute;
        left: 50%;
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
      // height: 0.9rem;
      position: relative;
      &.height {
        height: 4rem;
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
        top: 0.3rem;
        right: 0.3rem;
        color: $primary-color;
        transform: rotateZ(90deg);
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
          text-align: center;
        }
      }
    }
    .bottom {
      padding: 0.3rem 0;
      > div {
        float: left;
        width: 33.33%;
        height: 0.3rem;
        line-height: 0.3rem;
        color: $primary-color;
        font-size: $font-size-medium-s;
        text-align: center;
      }
      div + div {
        border-left: 1px solid $primary-color;
      }
    }
  }
  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.7);
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    &.show {
      display: block;
    }
  }
  .line {
    width: 0.03rem;
    height: 2.2rem;
    background-color: #fd8340;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    display: none;
    &.show {
      display: block;
    }
  }
  .erweima {
    width: 5rem;
    height: 6rem;
    border-radius: 0.1rem;
    background-color: #fff;
    background-size: cover;
    padding: 0.2rem 0;
    position: absolute;
    top: 2.2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9;
    display: none;
    &.show {
      display: block;
    }
    .erweima-top {
      img {
        display: inline-block;
        width: 1rem;
        margin-left: 0.86rem;
        vertical-align: top;
      }
      button {
        width: 1rem;
      }
      .info1 {
        height: 1rem;
        display: inline-block;
        // margin-left: 0.2rem;
        h3 {
          font-size: $font-size-medium-xx;
        }
        p {
          margin-top: 0.2rem;
          font-size: $font-size-small;
        }
        input {
        width: 100%;
        /* font-size: 0.3rem; */
        /* line-height: 1.2; */
        }
      }
    }
    .erweima-middle {
      font-size: $font-size-small;
      padding-left: 0.86rem;
      p + p {
        margin-top: 0.14rem;
      }
    }
    .erweima-bottom {
      margin-top: 0.24rem;
      margin-left: 0.86rem;
      width: 3.8rem;
      height: 3.8rem;
      padding: 0.26rem;
      background-color: #fff;
      position: relative;
      .erweimaPic {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
