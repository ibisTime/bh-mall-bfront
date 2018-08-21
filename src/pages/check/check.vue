<template>
  <div class="check">
      <div class="header clearfix">
          <div @click="changeIndex(6)" :class="[index == 6 ? 'active' : '']">
              <i>审核授权</i>
          </div>
          <div @click="changeIndex(12)" :class="[index == 12 ? 'active' : '']">
              <i>审核升级</i>
          </div>
          <div @click="changeIndex(10)" :class="[index == 10 ? 'active' : '']">
              <i>审核退出</i>
          </div>
      </div>
      <div :class="[index == 6 ? 'show' : '', 'item']" v-for="(item,key) in data1" :key="item.key"   @click="$router.push('/check/checkdispose?index=6&id=' + item.userId);">
          <p>姓名：{{item.realName}} <i class="tip">{{item.applyLevel}}</i></p>
          <p><span>微信号：{{item.wxId}}</span> <i class="tel">手机号：{{item.mobile}}</i> <img class="tiaozhuang" src="../../assets/imgs/more@2x.png" alt=""></p>
          <p>区域：<i>{{item.province}}</i> <i>{{item.city}}</i> <i>{{item.area}}</i></p>
      </div>
      <div :class="[index == 12 ? 'show' : '', 'item']" v-for="(item,key) in data2" :key="item.key"   @click="$router.push('/check/checkdispose?index=12&id=' + item.userId);">
          <p>姓名：{{item.realName}}</p>
          <p><i>{{item.level}}</i> <img class="shengji" src="../../assets/imgs/shengji@2x.png" alt=""> <i>{{item.applyLevel}}</i> <img class="tiaozhuang" src="../../assets/imgs/more@2x.png" alt=""></p>
          <p><span>微信号：{{item.user ? item.user.wxId : ''}}</span> <i class="tel">手机号：{{item.user ? item.user.mobile : ''}}</i> </p>
      </div>
      <div :class="[index == 10 ? 'show' : '', 'item']" v-for="(item,key) in data3" :key="item.key"   @click="$router.push('/check/checkdispose?index=8&id=' + item.userId);">
          <p>姓名：{{item.realName}} <i class="tip">{{item.applyLevel}}</i></p>
          <p><span>微信号：{{item.wxId}}</span> <i class="tel">手机号：{{item.mobile}}</i> <img class="tiaozhuang" src="../../assets/imgs/more@2x.png" alt=""></p>
      </div>
  </div>
</template>
<script>
import { getLevel, agent, upgradeList } from "api/baohuo";
export default {
  name: "check",
  data() {
    return {
      index: 6,
      data1: [],
      data2: [],
      data3: []
    };
  },
  methods: {
    changeIndex(index) {
      this.index = index;
      if(index === 12) {
        upgradeList(index).then((res) => {
          res.list.map(function(item) {
            getLevel(item.applyLevel).then(res => {
              item.applyLevel = res[0].name;
            });
            getLevel(item.level).then(info => {
              item.level = info[0].name;
            });
          });
          this.data2 = res.list;
        })
      } else {
        agent(index).then(res => {
          res.list.map(function(item) {
            getLevel(item.applyLevel).then(res => {
              item.applyLevel = res[0].name;
            });
            getLevel(item.level).then(info => {
              item.level = info[0].name;
            });
          });
          console.log(res.list);
          if (index === 6) {
            this.data1 = res.list;
          } else if (index === 10) {
            this.data3 = res.list;
          }
        });
      }
    }
  },
  mounted() {
    agent(6).then(res => {
      res.list.map(function(item) {
        getLevel(item.applyLevel).then(res => {
          item.applyLevel = res[0].name;
        });
        getLevel(item.level).then(info => {
          item.level = info[0].name;
        });
      });
      this.data1 = res.list;
    });
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
@import "../../common/scss/base.scss";
.check {
  background-color: #f7f7f7;
  .fl {
    float: left;
  }
  .show {
    display: block !important;
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
    display: none;
    p + p {
      margin-top: 0.36rem;
    }
    p {
      span {
        display: inline-block;
        width: 2.4rem;
      }
    }
    .tip {
      float: right;
      color: $primary-color;
    }
    .tel {
      margin-left: 1.1rem;
    }
    .tiaozhuang {
      width: 0.2rem;
      float: right;
    }
    .shengji {
      width: 0.38rem;
      margin: 0 0.62rem;
      vertical-align: middle;
    }
  }
}
</style>
