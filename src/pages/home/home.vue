<template>
  <div class=" home">
    <div class="header">
      <div class="header-top">
        <div class="user-img fl">
          <img :src="userinfo.photo">
        </div>
        <div class="userinfo">
          <p class="username">{{userinfo.realName}}</p>
          <p class="userpost">等级：{{userinfo.level}}</p>
          <p>团队：{{userinfo.teamName}}</p>
        </div>
      </div>
      <!-- <div class="header-bottom">
        <div class="header-bottom-left">
          <img src="../../assets/imgs/certificate@2x.png" alt="">
          <span>财富管理</span>
        </div>
        <div class="header-bottom-right" @click="$router.push('/systemMessage');">
          <img src="../../assets/imgs/xitongxiaoxi@2x.png" alt="">
          <span>系统消息</span>
        </div>
      </div> -->
    </div>
    <div class="middle">
      <div class="middle-top" @click="goYuncan">
        <span class="asset fl">云仓余额</span>
        <span class="money fl">￥{{formatAmount(balance)}}</span>
        <i class="fr more">
          <img src="../../assets/imgs/more@2x.png" alt="">
        </i>
      </div>
      <div class="middle-bottom">
        <div class="fl middle-bottom-left" @click="$router.push('/IntentionalAgent')">
          <img src="../../assets/imgs/daili@2x.png" alt="">
          <span>意向代理</span>
        </div>
        <div class="fl middle-bottom-right" @click="$router.push('/shenhechongzhi')">
          <img src="../../assets/imgs/chongzhi@2x.png" alt="">
          <span>审核充值</span>
        </div>
      </div>
    </div>
    <div class="blank"></div>
    <div class="block">
      <div class="title">
        <span>代理管理</span>
      </div>
      <div v-for="(item,key) in dailiManage" :key="key" class="item" @click="$router.push(item.to);">
        <img v-bind:src="item.src"><br>
        <span>{{item.text}}</span>
      </div>
    </div>
    <div class="blank"></div>
    <div class="block">
      <div class="title">
        <span>财务管理</span>
      </div>
      <div v-for="(item,key) in caiwuManage" :key="key" class="item" @click="$router.push(item.to);">
        <img v-bind:src="item.src"><br>
        <span>{{item.text}}</span>
      </div>
    </div>
    <div class="blank"></div>
    <div class="block">
      <div class="title">
        <span>云仓账户</span>
      </div>
      <div v-for="(item,key) in cloudManage" :key="key" class="item" @click="$router.push(item.to);">
        <img v-bind:src="item.src"><br>
        <span>{{item.text}}</span>
      </div>
    </div>
    <div class="blank"></div>
    <div class="block">
      <div class="title">
        <span>营销推广</span>
      </div>
      <div v-for="(item,key) in SalesManage" :key="key" class="item" @click="$router.push(item.to);">
        <img v-bind:src="item.src"><br>
        <span>{{item.text}}</span>
      </div>
    </div>
    <div class="blank"></div>
    <div class="block">
      <div class="title">
        <span>内购商城</span>
      </div>
      <div v-for="(item,key) in PurchaseManage" :key="key" class="item" @click="$router.push(item.to);">
        <img v-bind:src="item.src"><br>
        <span>{{item.text}}</span>
      </div>
    </div>
    <div class="blank"></div>
    <div class="block">
      <div class="title">
        <span>统计分析</span>
      </div>
      <div v-for="(item,key) in StatisticsManage" :key="key" class="item" @click="$router.push(item.to);">
        <img v-bind:src="item.src"><br>
        <span>{{item.text}}</span>
      </div>
    </div>
    <full-loading :title="title" v-show="loading"></full-loading>
    <toast ref="toast" :text="toastText"></toast>
  </div>
</template>
<script>
import Toast from 'base/toast/toast';
import FullLoading from 'base/full-loading/full-loading';
import { setCookie, getCookie, clearAllCookie } from "common/js/cookie.js";
import { isLogin, getUserId, formatAmount } from "common/js/util";
import { getUser1, getUserById } from "api/user";
import { getBill, getLevel, checkRed } from "api/baohuo";
export default {
  name: "home",
  data() {
    return {
      //代理管理
      dailiManage: [
        {
          text: "门槛账户",
          src: require("../../assets/imgs/menkan@2x.png"),
          to: "/threshold"
        },
        {
          text: "代理轨迹",
          src: require("../../assets/imgs/guiji@2x.png"),
          to: "/agentTrajectory"
        },
        {
          text: "代理结构图",
          src: require("../../assets/imgs/daili2@2x.png"),
          to: "/structure"
        },
        {
          text: "授权证书",
          src: require("../../assets/imgs/certification2@2x.png"),
          to: "/acceptimg"
        },
        {
          text: "邀请链接",
          src: require("../../assets/imgs/yaoqinglianjie@2x.png"),
          to: "/Invitation"
        },
        {
          text: "下级代理",
          src: require("../../assets/imgs/xiajidaili@2x.png"),
          to: "/subAgent"
        },
        {
          text: "意向代理",
          src: require("../../assets/imgs/constructor@2x.png"),
          to: "/IntentionalAgent"
        },
        {
          text: "代理审核",
          src: require("../../assets/imgs/shenhe@2x.png"),
          to: "/check"
        },
        {
          text: "申请升级",
          src: require("../../assets/imgs/cancel@2x.png"),
          to: "/upgrade"
        },
        {
          text: "申请退出",
          src: require("../../assets/imgs/cancel@2x.png"),
          to: "/logout"
        }
      ],

      //财务管理
      caiwuManage: [
        {
          text: "业绩账户",
          src: require("../../assets/imgs/yejizhanghu@2x.png"),
          to: "/yejizhanghu"
        },
        {
          text: "提现记录",
          src: require("../../assets/imgs/tixianjilu@2x.png"),
          to: "/tixianjilu"
        },
        {
          text: "微店账户",
          src: require("../../assets/imgs/weidianzhanghu.png"),
          to: "/weidianzhanghu"
        },
        {
          text: "推荐奖励",
          src: require("../../assets/imgs/tuijianjiangli@2x.png"),
          to: "/tuijianjiangli"
        },
        {
          text: "出货奖励",
          src: require("../../assets/imgs/chuhuojiangli@2x.png"),
          to: "/chuhuojiangli"
        },
        {
          text: "介绍奖励",
          src: require("../../assets/imgs/jieshaojiangli@2x.png"),
          to: "/jieshaojiangli"
        },
        {
          text: "审核充值",
          src: require("../../assets/imgs/shenhechongzhi2@2x.png"),
          to: "/shenhechongzhi"
        },
        {
          text: "审核提现",
          src: require("../../assets/imgs/shenhechongzhi2@2x.png"),
          to: "/shenhetixian"
        },
      ],

      //云仓账户
      cloudManage: [
        {
          text: "云仓账户",
          src: require("../../assets/imgs/yuncangzhanghu@2x.png"),
          to: "/yuncangzhanghu"
        },
        {
          text: "产品查询",
          src: require("../../assets/imgs/chanpinchaxun@2x.png"),
          to: "/chanpinchaxun"
        },
        {
          text: "我要出货",
          src: require("../../assets/imgs/jisongdaojia@2x.png"),
          to: "/woyaochuhuo"
        },
        {
          // text: "我的订单",
          text: "云仓订单",
          src: require("../../assets/imgs/wodedingdan@2x.png"),
          to: "/wodedingdan"
        },
        {
          text: "出货订单",
          src: require("../../assets/imgs/daichulidingdan@2x.png"),
          to: "/chuhuodingdan"
        },
        {
          text: "待处理订单",
          src: require("../../assets/imgs/waitOrder.png"),
          to: "/waitOrder"
        },
        {
          text: "购物车",
          src: require("../../assets/imgs/cart.png"),
          to: "/cart"
        }
      ],

      //营销推广
      SalesManage: [
        {
          text: "分享商城",
          src: require("../../assets/imgs/fenxiangshangcheng2@2x.png"),
          to: "/fenxiangshangcheng"
        },
        {
          text: "产品素材",
          src: require("../../assets/imgs/sucaichaxun@2x.png"),
          to: "/sucaichaxun"
        },
        // {
        //   text: "待处理订单",
        //   src: require("../../assets/imgs/daichulidingdan@2x.png"),
        //   to: "/daichulidingdan"
        // }
      ],

      //内购商城
      PurchaseManage: [
        {
          text: "选购商品",
          src: require("../../assets/imgs/xuangoushangpan@2x.png"),
          to: "/xuangoushangpin"
        },
        {
          text: "我的订单",
          src: require("../../assets/imgs/wodedingdan@2x.png"),
          to: "/neigoudingdan"
        }
      ],

      //统计分析
      StatisticsManage: [
        {
          text: "我的介绍",
          src: require("../../assets/imgs/wodejieshao@2x.png"),
          to: "/my-introduction"
        },
        {
          text: "我的推荐",
          src: require("../../assets/imgs/wodetuijian@2x.png"),
          to: "/my-recommend"
        },
        {
          text: "我的出货",
          src: require("../../assets/imgs/wodechuhuo@2x.png"),
          to: "/my-chuhuo"
        },
        {
          text: "差价利润",
          src: require("../../assets/imgs/chajialirun@2x.png"),
          to: "/profit"
        }
      ],
      userinfo: "",
      highuser: "",
      photo: "../../assets/imgs/head@2x.png",
      balance: "",
      title: '正在加载...',
      loading: true,
      toastText: ''
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    goYuncan() {
      this.$router.push('/yuncangzhanghu');
    },
    tuichu() {
      clearAllCookie();
      this.$router.push("/home");
    }
  },
  mounted() {
    let userId;
    if (this.$route.query.userId) {
      userId = this.$route.query.userId;
      setCookie("userId", userId);
    } else {
      userId = getCookie("userId");
    }
    Promise.all([
      getUser1(userId),
      checkRed(userId)
    ]).then(([res1, res2]) => {
      this.userinfo = res1;
      this.balance = res1.wareAmount;
      setCookie("level", res1.level);
      getLevel(res1.level).then(item => {
        this.loading = false;
        res1.level = item[0].name;
      });
      setCookie('isWare', res2.isWare);
      if(this.balance < res2.redAmount) {
        this.toastText = '您云仓余额低于红线，请购买';
        this.$refs.toast.show();
        setTimeout(() => {
          this.$router.push('/threshold');
        }, 2000)
      }
    }).catch(() => { this.loading = false });
  },
  components: {
    FullLoading,
    Toast
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
// .full-screen-wrapper {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
// }
.home {
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .blank {
    width: 100%;
    height: 0.2rem;
    background: $color-blank;
  }
  .header {
    background-image: url("../../assets/imgs/background@2x.png");
    .header-top {
      height: 3.5rem;
      position: relative;
      padding-left: 0.3rem;
      padding-top: 1.15rem;
      .user-img {
        width: 1.28rem;
        height: 1.28rem;
        background-color: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        padding: 0.04rem;
        overflow: hidden;
        img {
          width: 1.2rem;
        }
      }
      .userinfo {
        height: 1.2rem;
        margin-left: 1.8rem;
        p {
          text-align: left;
          font-size: $font-size-small;
          color: #fff;
        }
        .username {
          font-size: $font-size-large-s;
          margin-bottom: 0.2rem;
        }
        .userpost {
          margin-bottom: 0.14rem;
        }
      }
    }
    .header-bottom {
      height: 0.9rem;
      background-color: rgba(0, 0, 0, 0.03);
      > div {
        float: left;
        width: 50%;
        height: 100%;
        color: #fff;
        font-size: $font-size-medium-x;
        text-align: center;
        // padding-top: 0.3rem;
        i {
          display: inline-block;
          width: 0.3rem;
          height: 0.4rem;
          margin-top: 0.3rem;
        }
        span {
          display: inline-block;
          height: 0.4rem;
          line-height: 0.4rem;
          margin-left: 0.2rem;
        }
      }
      .header-bottom-left {
        line-height: 0.9rem;
        img {
          width: 0.25rem;
        }
      }
      .header-bottom-right {
        line-height: 0.9rem;
        img {
          width: 0.3rem;
        }
      }
    }
  }
  .middle {
    .middle-top {
      height: 1.2rem;
      line-height: 1.2rem;
      border-bottom: 1px solid #eee;
      .asset {
        margin-left: 0.6rem;
        font-size: $font-size-medium-xx;
      }
      .money {
        margin-left: 0.4rem;
        font-size: $font-size-large-ss;
        color: $primary-color;
      }
      .more {
        height: 1.2rem;
        width: 0.4rem;
        margin-right: 0.3rem;
        position: relative;
        img {
          position: absolute;
          top: 50%;
          transform: translateY(-50%) scale(0.8);
        }
      }
    }
    .middle-bottom {
      height: 1.2rem;
      line-height: 1.2rem;
      text-align: center;
      font-size: $font-size-medium-xx;
      > div {
        width: 50%;
        border-bottom: 1px solid #eee;
        border-right: 1px solid #eee;
        img {
          vertical-align: sub;
          width: 0.36rem;
        }
      }
    }
  }
  .block {
    .title {
      height: 0.7rem;
      padding: 0.2rem 0.3rem;
      border-bottom: 1px solid #eee;
      span {
        display: block;
        font-size: $font-size-medium-x;
        color: $color-text;
        padding-left: 0.18rem;
        border-left: 0.08rem solid $primary-color;
      }
    }
    .item {
      width: 33.3%;
      height: 1.9rem;
      padding-top: 0.24rem;
      text-align: center;
      border-bottom: 1px solid $color-border;
      border-right: 1px solid $color-border;
      display: inline-block;
      img {
        margin-bottom: 0.22rem;
        width: 0.46rem;
        height: 0.46rem;
      }
      span {
        display: block;
        font-size: $font-size-medium;
        color: #666;
        margin: 0 auto;
      }
    }
  }
  .tuichu {
    position: fixed;
    right: 0.3rem;
    top: 0.3rem;
    font-size: 0.3rem;
    color: #333;
  }
}
</style>
