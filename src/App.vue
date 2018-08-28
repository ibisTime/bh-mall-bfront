<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { isLogin, setUser } from "common/js/util";
export default {
  name: "App",
  mounted() {
    // setUser({ userId: 'U201808261104285013162' });
    if (!isLogin()) {
      if (this.$route.path !== '/fenxiangshangcheng') {
        this.$router.push('/?userReferee=' + this.$route.query.userReferee || '');
      }
    }
    this.resetFontSize();
  },
  methods: {
    resetFontSize() {
      if (typeof WeixinJSBridge === 'object' && typeof WeixinJSBridge.invoke === 'function') {
        this.handleFontSize();
      } else {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', this.handleFontSize, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', this.handleFontSize);
          document.attachEvent('onWeixinJSBridgeReady', this.handleFontSize);
        }
      }
    },
    handleFontSize() {
      WeixinJSBridge.invoke('setFontSizeCallback', {
        'fontSize': 0
      });
      WeixinJSBridge.on('menu:setfont', function () {
        WeixinJSBridge.invoke('setFontSizeCallback', {
          'fontSize': 0
        });
      });
    }
  }
};
</script>

<style>
@import "./common/scss/index.scss";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #fff;
  min-height: 100%;
}
</style>
