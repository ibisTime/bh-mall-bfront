<template>
  <div class="intentionalAgent">
      <div class="header clearfix">
          <div @click="changeIndex(5)" :class="[index == 5 ? 'active' : '']">
              <i>待分配</i>
          </div>
          <div @click="changeIndex(3)" :class="[index == 3 ? 'active' : '']">
              <i>已分配</i>
          </div>
          <div @click="changeIndex(4)" :class="[index == 4 ? 'active' : '']">
              <i>已忽略</i>
          </div>
      </div>
      <div v-for="item in userlist" class="item" @click="$router.push('/IntentionalAgent/detail?id=' + item.user.userId);">
          <p>姓名：{{item.user.realName}} <i class="tip">{{item.applyLevel}}</i></p>
          <p><span>微信号：{{item.user.wxId}}</span> <i class="tel">手机号：{{item.user.mobile}}</i> <img src="../../assets/imgs/more@2x.png" alt=""></p>
          <p>区域：<i>{{item.user.province}}</i> <i>{{item.user.city}}</i> <i>{{item.user.area}}</i></p>
      </div>
      <!-- <div class="item"  @click="$router.push('/IntentionalAgent/detail?id=U20180328101135370654&index=' + index);">
          <p>姓名：张北 <i class="tip">二级代理</i></p>
          <p><span>微信号：哈哈哈</span> <i class="tel">手机号：12345678901</i> <img src="../../assets/imgs/more@2x.png" alt=""></p>
          <p>区域：<i>浙江省</i> <i>杭州市</i> <i>余杭区</i></p>
      </div> -->
  </div>
</template>
<script>
import { intentional, getLevel } from "api/baohuo";
import { formatDate } from "common/js/util";
export default {
  name: "IntentionalAgent",
  data() {
    return {
      index: 5,
      userlist: []
    };
  },
  methods: {
    changeIndex(index) {
      this.index = index;
      intentional(index + '').then(res => {
        res.list.map(function(item) {
          //格式化时间
          item.approveDatetime = formatDate(item.approveDatetime);

          //数字等级转化文字等级
          getLevel(item.applyLevel).then(res => {
            item.applyLevel = res[0].name;
          });
        });
        this.userlist = res.list;
      });
    }
  },
  mounted() {
    intentional(5).then(res => {
      res.list.map(function(item) {
        //格式化时间
        item.approveDatetime = formatDate(item.approveDatetime);

        //数字等级转化文字等级
        getLevel(item.applyLevel).then(res => {
          item.applyLevel = res[0].name;
        });
      });
      this.userlist = res.list;
    });
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
      width: 33.3%;
      height: 0.9rem;
      // background-color: rgba($color: #000000, $alpha: 0.1);
      position: relative;
      i {
        font-size: $font-size-medium;
        color: #333;
        height: 0.9rem;
        line-height: 0.9rem;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
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
    padding: 0.3rem;
    font-size: $font-size-small;
    background-color: #fff;
    p + p {
      margin-top: 0.36rem;
    }
    .tip {
      float: right;
      color: $primary-color;
    }
    .tel {
      margin-left: 1.1rem;
    }
    img {
      width: 0.2rem;
      float: right;
    }
  }
}
</style>
