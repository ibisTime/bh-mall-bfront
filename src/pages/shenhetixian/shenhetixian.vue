<template>
  <div class="intentionalAgent">
    <div class="category-wrapper">
      <category-scroll :currentIndex="currentIndex"
                       :categorys="categorys"
                       @select="selectCategory"></category-scroll>
    </div>
    <div class="orders-content">
      <scroll :data="list"
              :hasMore="hasMore"
              @pullingUp="getPageOrders">
        <div class="item" v-for="item in list"  @click="$router.push('/shenhetixian/tixianchuli?code=' + item.code + '&status=' + categorys[index].key);">
          <p>订单编号：{{item.code}}</p>
          <p>申请人姓名：{{item.accountName}}  </p>
          <p>等级：{{levelObj[item.agent.level]}}</p>
          <p>充值金额：<span>￥{{formatAmount(item.amount)}}</span><img src="../../assets/imgs/more@2x.png" alt=""></p>
          <p>申请时间：{{formatDate(item.applyDatetime)}}</p>
        </div>
      </scroll>
    </div>
    <full-loading :title="title" v-show="loading"></full-loading>
  </div>
</template>
<script>
import { intentional, queryQuxian, getLevel } from "api/baohuo";
import { formatDate, formatAmount, getUserId } from "common/js/util";
import FullLoading from 'base/full-loading/full-loading';
import CategoryScroll from 'base/category-scroll/category-scroll';
import Scroll from 'base/scroll/scroll';


export default {
  name: "IntentionalAgent",
  data() {
    return {
      loading: false,
      title: '正在加载...',
      index: 0,
      list: [],
      categorys: [
        {value: '待审核',key: '1'},
        {value: '待打款',key: '3'},
        {value: '已回录',key: '5'},
        {value: '已否决',key: '2,4'}
      ],
      start: 1,
      limit: 10,
      hasMore: true,
      currentIndex: 0,
      levelObj: {}
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    formatDate(date) {
      return formatDate(date);
    },
    getPageOrders() {
      this.loading = true;
      queryQuxian({
        statusList: this.categorys[this.index].key.split(','),
        toUserId: getUserId(),
        start: this.start,
        limit: this.limit
      }).then(res => {
        this.loading = false;
        if (res.list.length < this.limit || res.totalCount <= this.limit) {
          this.hasMore = false;
        }
        this.list = this.list.concat(res.list);
        this.start++;
      }).catch(() => { this.loading = false });
    },
    selectCategory(index) {
      this.index = index;
      this.currentIndex = index;
      this.start = 1;
      this.limit = 10;
      this.list = [];
      this.getPageOrders();
    }
  },
  mounted() {
    this.loading = true;
    getLevel().then((res) => {
      this.loading = false;
      res.map((item) => {
        this.levelObj[item.level] = item.name;
      });
      this.selectCategory(this.index);
    }).catch(() => { this.loading = false; })
  },
  components: {
    FullLoading,
    CategoryScroll,
    Scroll
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
@import "../../common/scss/base.scss";
.intentionalAgent {
  background-color: #f7f7f7;
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
      color: #fa5440;
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
