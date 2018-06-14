<template>
    <div class="loginAwait">
        <!-- <input type="text" :value="code"> -->
        <loading></loading>
    </div>
</template>
<script>
import { getAppId, usergo2, usergo1, getUserStatu } from "api/baohuo";
import { isLogin, setUser, getWxMobAndCapt } from "common/js/util";
import { setCookie, getCookie } from "common/js/cookie";
import loading from "base/loading/loading";
export default {
  data() {
    return {
      code: "",
      info: "",
      userReferee: ""
    };
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
          setCookie("token", info.token);
          this.goLogin(userId, status);
        });
      } else {
        usergo1(this.code).then(info => {
          alert(info.status + "专爱");
          this.info = info;
          setCookie("token", info.token);
          let userId = info.userId;
          let status = info.status;
          this.goLogin(userId, status);
        });
      }
    },
    goLogin(userId, status) {
      alert(status + "状态");
      //1,2禁止登陆
      if (status == 1 || status == 2) {
        alert("对不起，你被禁登录");
      } else if (status == 16 && this.userReferee) {
        this.$router.push(
          "/login/loginuserReferee?userId=" +
            userId +
            "&userReferee=" +
            this.userReferee
        );
      } else if (status == 16) {
        this.$router.push("/login/login?userId=" + userId);
      } else if (status == 6 || status == 5) {
        this.$router.push("/login/replying");
        //10没通过
      } else if (status == 4 || status == 9) {
        alert("对不起,您没有被授权！");
      } else {
        this.$router.push("/home?userId=" + userId);
      }
    }
  },

  mounted() {
    if (!isLogin()) {
      alert(location.href + "地址");
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
    } else {
      let status = getCookie("status");
      if (status == 1 || status == 2) {
        alert("对不起,你被禁登录");
      } else if (status == 3) {
        this.$router.push("/login/login");
      } else if (status == 6 || status == 5) {
        this.$router.push("/login/replying");
        //10没通过
      } else if (status == 4 || status == 9) {
        alert("对不起,您没有被授权！");
      } else {
        this.$router.push("/home");
      }
    }
  },
  components: {
    loading
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
