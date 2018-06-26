<template>
    <div class="loginAwait">
      <loading></loading>
      <toast ref="toast" :text="text"></toast>
      <confirm ref="confirm" :text="confirmText" :isAlert="isAlert" @confirm="handleConfirm"></confirm>
    </div>
</template>
<script>
import { getAppId, usergo2, usergo1, getUserStatu, checkRed } from "api/baohuo";
import { isLogin, setUser, getWxMobAndCapt, formatAmount, getUserId } from "common/js/util";
import { setCookie, getCookie } from "common/js/cookie";
import Loading from "base/loading/loading";
import Toast from 'base/toast/toast';
import Confirm from 'base/confirm/confirm';

export default {
  data() {
    return {
      isAlert: true,
      confirmText: "",
      code: "",
      info: "",
      userReferee: "",
      text: ""
    };
  },
  mounted() {
    if (!isLogin()) {
      if (/userReferee=([^&]+)&code=([^&]+)&state=/.exec(location.href)) {
        this.userReferee = RegExp.$1;
        this.code = RegExp.$2;
        this.toOther();
      } else if (/code=([^&]+)&state=/.exec(location.href)) {
        this.code = RegExp.$1;
        this.toOther();
      } else if (/userReferee=([^&$]+)/.exec(location.href)) {
        this.userReferee = RegExp.$1;
        this.AppId();
      } else {
        this.AppId();
      }
    }
  },
  methods: {
    //获取用户微信code
    AppId() {
      //获取用户appid
      getAppId("wx_h5_access_key").then(res => {
        var appId = res.cvalue;
        let redirect_uri = `${location.origin}?${location.hash}`;
        if (this.userReferee) {
          redirect_uri += `&userReferee=${this.userReferee}`;
        }
        // 获取当前地址
        let redirectUri = encodeURIComponent(redirect_uri);
        let url = "https://open.weixin.qq.com/connect/oauth2/authorize";
        let suffix =
          "&response_type=code&scope=snsapi_userinfo#wechat_redirect";

        //发送微信网页授权地址，由此获取code
        setTimeout(() => {
          location.replace(
            `${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`
          );
        }, 100);
      });
    },

    //根据用户状态进入别的页面
    toOther() {
      if (this.userReferee) {
        usergo2(this.code, this.userReferee).then(info => {
          this.info = info;
          let userId = info.userId;
          let status = info.status;
          setUser(info);
          this.goLogin(userId, status);
        });
      } else {
        usergo1(this.code).then(info => {
          this.info = info;
          setUser(info);
          let userId = info.userId;
          let status = info.status;
          this.goLogin(userId, status);
        });
      }
    },
    checkUser(userId) {
      checkRed(userId).then(res => {
        setCookie('level', res.level);
        if (res.result == '4') {
          this.redirectPage(`您需要充值门槛费${formatAmount(res.chargeAmount)}元`, '/recharge');
        } else if (res.result == "0") {
          this.redirectPage(`您需要先购买${formatAmount(res.redAmount)}元的云仓`, '/threshold');
        } else if (res.result == '1') {
          this.redirectPage(`您需要先购买${formatAmount(res.redAmount)}元的授权单`, '/woyaochuhuo');
        } else if (res.result == '2') {
          this.redirectPage(`您需要先购买${formatAmount(res.redAmount)}元的升级单`, '/woyaochuhuo');
        } else if (res.result == '3') {
          this.redirectPage(`您的门槛余额已经高于${formatAmount(res.minAmount)}元，请前去购买云仓`, '/threshold');
        } else {
          this.$router.push('/home');
        }
      });
    },
    handleConfirm() {
      this.$router.push(this.url);
    },
    redirectPage(text, url) {
      this.confirmText = text;
      this.$refs.confirm.show();
      this.url = url;
    },
    goLogin(userId, status) {
      setCookie("status", status);
      //1,2禁止登陆
      if (status == 1 || status == 2) {
        this.text = '对不起，你被禁登录';
        this.$refs.toast.show();
      } else if (status == 19) {
        this.$router.push(
          "/login/loginuserReferee?userId=" +
            userId +
            "&userReferee=" +
            this.userReferee
        );
      } else if (status == 16) {
        this.$router.push("/login/login?userId=" + userId);
      } else if (status == 18) {
        this.$router.push("/login/supplyInfo?userId=" + userId);
      } else if (status == 6 || status == 5 || status == 11) {
        this.$router.push("/login/replying");
        //10没通过
      } else if (status == 3 || status == 4 || status == 9 || status == 10) {
        this.text = '对不起,您没有被授权！';
        this.$refs.toast.show();
      } else {
        this.checkUser(userId);
      }
    }
  },
  components: {
    Loading,
    Confirm,
    Toast
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.loginAwait {
  font-size: 0.3rem;
  padding: 0.3rem;
  input {
    width: 100%;
  }
}
</style>
