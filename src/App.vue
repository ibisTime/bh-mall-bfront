<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { isLogin } from "common/js/util";
export default {
  name: "App",
  mounted() {
    if (!isLogin()) {
      this.$router.push('/?userReferee=' + this.$route.query.userReferee);
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
  height: 100%;
}
</style>
