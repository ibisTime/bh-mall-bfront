<template>
  <div class="invitation full-screen-wrapper">
      <div class="container" >
          <div class="top">
              <div>
                  <span>成功邀请（人）</span>
                  <i>{{number}}</i>
                  <button @click="showMask">分享链接</button>
              </div>
              <div>
                  <span>提成收益（元）</span>
                  <i>{{formatAmount(refreeAward)}}</i>
                  <button @click="changeFlag">分享二维码</button>
              </div>
          </div>
          <!--<div class="bottom">-->
              <!--<h3>活动规则</h3>-->
              <!--<span></span>-->
              <!--<div class="content">-->
                  <!--<p>1. 首次邀请五位</p>-->
                  <!--<p>2. 再次邀请送20元现金</p>-->
                  <!--<p>3. 就是有钱就是有钱就是有钱就是有钱就是有钱就是有钱就是有钱就是有钱就是有钱</p>-->
              <!--</div>-->
          <!--</div>-->
      </div>
      <div :class="['mask',flag ? 'show' : '']" @click="changeFlag"></div>
      <div :class="['line',flag ? 'show' : '']" ></div>
      <div :class="['erweima',flag ? 'show' : '']">
          <div class="erweima-top">
              <img src="../../assets/imgs/touxiangfang@2x.png" alt="">
              <div class="info">
                  <h3>{{ realName }}</h3>
                  <p>代理品牌：麦记</p>
              </div>
          </div>
          <div class="erweima-middle">
              <p>欢迎关注麦记新零售,扫描下方二维码即可关注</p>
              <p>在线办理授权，期待您的加入</p>
          </div>
          <div class="erweima-bottom">
              <div class="erweimaPic" id="qrcode"></div>
          </div>
      </div>
    <share-mask ref="shareMask"></share-mask>
  </div>
</template>
<script>
//二维码插件引入
import { inquireConfig, getStatistics } from "api/baohuo";
import { initShare } from "common/js/weixin";
import { getCookie } from "common/js/cookie";
import { isLogin, formatAmount, getUserId } from "common/js/util";
import { getUser } from "api/user";
const QRCode = require("js-qrcode");
import ShareMask from 'components/share-mask/share-mask';
export default {
  name: "Invitation",
  data() {
    return {
      flag: false,
      // 177
     wxUrl: "http://mj.bfront.zjqiyu.com/#/?userReferee=",
      // 183
      //  wxUrl: "http://front.bhxt.hichengdai.com/#/?userReferee=",
      // info: {
      //   title: "麦记新零售邀请链接",
      //   desc: "邀请链接",
      //   link: location.origin.split('#')[0] + '?userReferee=' + this.userReferee,
      //   imgUrl: "http://otoieuivb.bkt.clouddn.com/下载_1522114909652.jpg"
      // },
      realName: '',
      status:'',
      number: 0,
      refreeAward: 0
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    changeFlag() {
      this.flag = !this.flag;
    },
    initShare() {
      initShare({
        title: "麦记新零售邀请链接",
        desc: "邀请链接",
        link: location.href.split('#')[0] + '/#/?userReferee=' + getUserId(),
        imgUrl: "http://otoieuivb.bkt.clouddn.com/下载_1522114909652.jpg"
      });
    },
    success() {
      // alert("点击右上角，进行分享");
      this.showMask();
    },
    error(e) {
      alert(e);
    },
    cancel() {
      alert("cancel");
    },
    showMask() {
      this.$refs.shareMask.show();
    }
  },
  mounted() {
    this.loading = true;
    this.status = getCookie('status');
    if (isLogin()) {
      this.userReferee = getCookie("userId");

      this.wxUrl += this.userReferee;
      //用插件生成二维码
      const container = document.getElementById("qrcode");

      //设置转换二维码图片的参数
      const qr = new QRCode(container, {
        width: 275,
        height: 275,
        typeNumber: -1,
        correctLevel: 2,
        background: "#ffffff",
        foreground: "#000000"
      });
      qr.make(this.wxUrl);
      getUser().then(res => {
        this.realName = res.realName;
        this.initShare();
      });

    }
    getStatistics({
      referrer: getUserId()
    }).then((res) => {
      this.loading = false;
      this.number = res.number;
      this.refreeAward = res.refreeAward;
    })
  },
  components: {
    ShareMask
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.invitation {
  background-image: url("../../assets/invitationLink/yaoqinglianjie@2x.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-color: #f19a02;
  .container {
    padding: 0 0.3rem;
    font-size: $font-size-small;
    overflow: hidden;
    .top {
      height: 3.9rem;
      margin-top: 5.16rem;
      background-image: url("../../assets/invitationLink/juxing3.png");
      background-repeat: no-repeat;
      > div {
        float: left;
        width: 50%;
        height: 3.9rem;
        position: relative;
        span {
          width: 100%;
          position: absolute;
          text-align: center;
          top: 0.7rem;
          color: #f19a02;
        }
        i {
          width: 100%;
          position: absolute;
          top: 1.45rem;
          text-align: center;
          font-size: $font-size-large-s;
          color: #fe7300;
        }
        button {
          width: 2.5rem;
          height: 1rem;
          line-height: 1rem;
          background-color: #fe8729;
          border-radius: 0.1rem;
          background-size: cover;
          text-align: center;
          position: absolute;
          left: 50%;
          bottom: 0.6rem;
          transform: translateX(-50%);
          font-size: $font-size-large-ss;
          color: #fff;
        }
      }
    }
    .bottom {
      height: 3.9rem;
      margin-top: 0.4rem;
      background-image: url("../../assets/invitationLink/juxing3.png");
      background-repeat: no-repeat;
      overflow: hidden;
      position: relative;
      h3 {
        text-align: center;
        margin-top: 0.4rem;
        font-size: $font-size-large;
        color: #b07c43;
        z-index: 2;
        position: relative;
      }
      span {
        width: 2.38rem;
        height: 0.24rem;
        background-color: #feebcc;
        border-radius: 0.1rem;
        position: absolute;
        top: 0.6rem;
        left: 50%;
        transform: translateX(-50%);
      }
      .content {
        padding: 0.56rem 0.5rem;
        position: absolute;
        top: 0.78rem;
        color: #c58c58;
        p {
          line-height: 0.5rem;
        }
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
    width: 5.7rem;
    height: 6.7rem;
    border-radius: 0.1rem;
    background-image: url("../../assets/imgs/erweima@2x(1).png");
    background-size: cover;
    padding: 0.2rem 0;
    position: absolute;
    top: 2.2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9;
    color: #fff;
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
      .info {
        height: 1rem;
        display: inline-block;
        margin-left: 0.2rem;
        h3 {
          font-size: $font-size-medium-xx;
        }
        p {
          margin-top: 0.2rem;
          font-size: $font-size-small;
        }
      }
    }
    .erweima-middle {
      font-size: $font-size-small;
      padding: 0 0.5rem;
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
