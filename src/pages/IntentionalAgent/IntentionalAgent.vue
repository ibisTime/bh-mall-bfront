<template>
  <div class="intentionalAgent">
    <div class="category-wrapper">
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
    </div>
    <div class="orders-content">
      <scroll :data="userlist"
              :hasMore="hasMore"
              @pullingUp="getPageOrders">
        <div v-for="item in userlist" class="item" @click="$router.push('/IntentionalAgent/detail?id=' + item.userId + '&index=' + index);">
            <p>姓名：{{item.realName}} <i class="tip">{{item.applyLevel}}</i></p>
            <p><span>微信号：{{item.wxId}}</span><img src="../../assets/imgs/more@2x.png" alt=""></p>
            <p><i class="tel">手机号：{{item.mobile}}</i></p>
            <p>区域：<i>{{item.province}}</i> <i>{{item.city}}</i> <i>{{item.area}}</i></p>
        </div>
      </scroll>
    </div>
    <full-loading :title="title" v-show="loading"></full-loading>
  </div>
</template>
<script>
import FullLoading from 'base/full-loading/full-loading';
import Scroll from 'base/scroll/scroll';
import { intentional, getLevel, getYixiang } from "api/baohuo";
import { formatDate, getUserId } from "common/js/util";
export default {
  name: "IntentionalAgent",
  data() {
    return {
      loading: false,
      title: '正在加载...',
      index: '0',
      userlist: [],
      start: 1,
      limit: 10,
      hasMore: true
    };
  },
  methods: {
    changeIndex(index) {
      this.index = index;
      this.start = 1;
      this.limit = 10;
      let params = {
        status: index,
        start: this.start,
        limit: this.limit
      };
      if(index === '0') {
        params.toUserId = getUserId()
        params.status = '3';
      } else {
        params.approver = getUserId()
      }
      this.userlist = [];
      this.getPageOrders(params);
    },
    getPageOrders(params) {
      this.loading = true;
      getYixiang(params).then(res => {
        if (res.list.length < this.limit || res.totalCount <= this.limit) {
          this.hasMore = false;
        }
        // debugger;
        this.loading = false;
        res.list && res.list.map(function(item) {
          //格式化时间
          item.approveDatetime = formatDate(item.approveDatetime);

          //数字等级转化文字等级
          getLevel(item.applyLevel).then(res => {
            item.applyLevel = res[0].name;
          });
        });
        this.userlist = this.userlist.concat(res.list);
        this.start++;
      }).catch(() => { this.loading = false });
    }
  },
  mounted() {
    this.changeIndex('0');
  },
  components: {
    FullLoading,
    Scroll
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
  .category-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    overflow: hidden;
    height: 0.8rem;
    line-height: 0.8rem;
    background: #fff;
    border-bottom: 1px solid $color-border;
  }
  .orders-content {
    position: absolute;
    top: 0.8rem;
    left: 0;
    width: 100%;
    bottom: 0;
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
    }
    img {
      width: 0.2rem;
      float: right;
    }
  }
}
</style>
