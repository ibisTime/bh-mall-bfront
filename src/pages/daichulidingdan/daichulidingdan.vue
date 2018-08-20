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
      <div class="item clearfix" v-for="(item, index) in list">
            <div class="top clearfix">
                <span class="user">提交人：{{item.realName}}</span>
                <span class="status">{{status[item.status]}}</span>
            </div>
            <div class="info" :class="{ height: curIdx === index }" ref="divInfo">
                <div class="downward" @click="changeHeight(index)">></div>
                <p>订单编号：{{item.code}}</p>
                <p>订单类型：{{item.kind}}</p>
                <p>下单时间：{{item.applyDatetime}}</p>
                <p>收货人：{{item.signer}}{{item.mobile}}</p>
                <p>收货地址：<i>{{item.province}}</i><i>{{item.city}}</i><i>{{item.area}}</i><i>{{ item.address}}</i></p>
            </div>
            <div class="pic">
                <img :src="item.pic" alt="">
                <div class="content">
                    <p>{{ item.productName}}</p>
                    <i>￥{{ item.amount/1000}}</i>
                    <span>{{ item.quantity}}瓶</span>
                    <span class="kind-tip">{{ item.kind == '2' ? '云仓订单' : '提货订单' }}</span>
                </div>
            </div>
            <div class="item clearfix">
            <div class="bottom clearfix">
                <div v-if="item.status == '1' || item.status == '2'" @click="sendYc(item.code)">云仓发</div>
                <div v-if="item.status == '1' || item.status == '2'" @click="sendM(item.code)">自发</div>
                <div v-if="item.status == '5'" @click="passCancel(item.code)">通过</div>
                <div v-if="item.status == '5'" @click="unpassCancel(item.code)">不通过</div>
            </div>
        </div>
      </div>
      <send-modal ref="sendModal" @confirm="handleConfirm"></send-modal>
      <toast ref="toast" :text="toastText"></toast>
      <confirm ref="confirm" text="确认通过吗？" @confirm="handelPass"></confirm>
      <confirm-input ref="confirmInput" text="取消审核" @confirm="handelUnPass"></confirm-input>
      <full-loading title="提交中..." v-show="loading"></full-loading>
  </div>
</template>
<script>
import { queryOrderForm1, yunfahuo, noyunfahuo, checkCancel } from "api/baohuo";
import { getUser, getUserById } from "api/user";
import { formatDate, formatImg } from "common/js/util";
import SendModal from 'components/send-modal/send-modal';
import Toast from 'base/toast/toast';
import ConfirmInput from 'base/confirm-input/confirm-input';
import Confirm from 'base/confirm/confirm';
import FullLoading from 'base/full-loading/full-loading';

const YUN_CANG = 0;
const ZI_FA = 1;

export default {
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
      toastText: "",
      loading: false,
      curIdx: ''
    };
  },
  methods: {
    handleConfirm(wlCode, wlCompany) {
      if (!this.wlCompany || !this.wlCode) {
        this.showMsg('物流单号和物流公司未填写完整');
      } else {
        this.sendType === YUN_CANG ? this.fahuo(wlCode, wlCompany) : this.zifafahuo(wlCode, wlCompany);
      }
    },
    showMsg(msg) {
      this.toastText = msg;
      this.$refs.toast.show();
    },
    sendYc(code) {
      this.curCode = code;
      this.sendType = YUN_CANG;
      this.$refs.sendModal.show();
    },
    sendM(code) {
      this.curCode = code;
      this.sendType = ZI_FA;
      this.$refs.sendModal.show();
    },
    passCancel(code) {
      this.curCode = code;
      this.$refs.confirm.show();
    },
    handelPass() {
      this.checkCancel(1);
    },
    unpassCancel(code) {
      this.curCode = code;
      this.$refs.confirmInput.show();
    },
    handelUnPass(remark) {
      this.checkCancel(0, remark);
    },
    checkCancel(result, remark) {
      this.loading = true;
      checkCancel(this.curCode, result, remark).then(() => {
        this.loading = false;
        this.toastText = '操作成功';
        this.$refs.toast.show();
        this.check();
      }).catch(() => this.loading = false);
    },
    changeIndex(index) {
      this.index = index;
      this.check();
    },
    fahuo(logisticsCode, logisticsCompany) {
      let params = {
        logisticsCode,
        logisticsCompany,
        code: this.curCode
      };
      noyunfahuo(params).then(res => {
        if (res) {
          alert("发货成功！");
        }
      });
    },
    zifafahuo(logisticsCode, logisticsCompany) {
      let params = {
        logisticsCode,
        logisticsCompany,
        code: this.curCode
      };
      yunfahuo(params).then(res => {
        if (res) {
          alert("发货成功！");
        }
      });
    },
    changeHeight(index) {
      this.curIdx = this.curIdx === index ? '' : index;
    },
    check() {
      let status = [];
      if (this.index === "2") {
        status = [1, 2];
      } else if (this.index ==='5') {
        status = [5];
      }
      queryOrderForm1(status).then(res => {
        res.list.map(function(item) {
          //格式化图片
          item.pic = formatImg(item.pic);
          //格式化时间
          item.applyDatetime = formatDate(item.applyDatetime);
        });
        console.log(res.list);
        this.list = res.list;
      });
    }
  },
  mounted() {
    this.check();
  },
  components: {
    SendModal,
    Toast,
    Confirm,
    ConfirmInput,
    FullLoading
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
      position: relative;
      height: 0.9rem;
      overflow: hidden;
      &.height {
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

          &.kind-tip {
            top: 0.44rem;
          }
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
        h3 {
          font-size: $font-size-medium-xx;
        }
        p {
          margin-top: 0.2rem;
          font-size: $font-size-small;
        }
        input {
          width: 100%;
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
