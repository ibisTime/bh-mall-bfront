<template>
  <div class="intentionalAgent">
      <div class="header clearfix">
          <div @click="changeIndex('0')" :class="[index === '0' ? 'active' : '']">
              <i>待分配</i>
          </div>
          <div @click="changeIndex('3')" :class="[index === '3' ? 'active' : '']">
              <i>已分配</i>
          </div>
          <div @click="changeIndex('1')" :class="[index === '1' ? 'active' : '']">
              <i>已忽略</i>
          </div>
      </div>
      <div v-for="item in userlist" class="item" @click="$router.push('/IntentionalAgent/detail?id=' + item.userId + '&index=' + index);">
          <p>姓名：{{item.realName}} <i class="tip">{{item.applyLevel}}</i></p>
          <p><span>微信号：{{item.wxId}}</span> <i class="tel">手机号：{{item.mobile}}</i> <img src="../../assets/imgs/more@2x.png" alt=""></p>
          <p>区域：<i>{{item.province}}</i> <i>{{item.city}}</i> <i>{{item.area}}</i></p>
      </div>
    <full-loading :title="title" v-show="loading"></full-loading>
  </div>
</template>
<script>
import FullLoading from 'base/full-loading/full-loading';
import { intentional, getLevel, getYixiang } from "api/baohuo";
import { formatDate, getUserId } from "common/js/util";
export default {
  name: "IntentionalAgent",
  data() {
    return {
      loading: false,
      title: '正在加载...',
      index: '0',
      userlist: []
    };
  },
  methods: {
    changeIndex(index) {
      this.index = index;
      let params = {
        status: index
      };
      if(index === '0') {
        params.toUserId = getUserId()
        params.status = '3';
      } else if(index === '3') {
        params.approver = getUserId()
      }
      this.loading = true;

      getYixiang(params).then(res => {
        this.loading = false;
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
    this.changeIndex('0');
  },
  components: {
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
