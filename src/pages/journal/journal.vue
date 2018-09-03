<template>
  <div class="journal">
    <div class="item" v-for="item in list.logList" v-show="list.logList.length">
      <p>操作人：{{name}}</p>
      <p>操作类型：{{logType[item.type] ? logType[item.type] : '无'}}</p>
      <p>流转时间：{{item.approveDatetime ? formatDate(item.approveDatetime) : formatDate(item.applyDatetime)}}</p>
      <p>备注：{{item.remark ? item.remark : '无' }}</p>
    </div>
    <no-result v-show="!list.logList.length" title="暂无流转日志"></no-result>
  </div>
</template>
<script>
import NoResult from 'base/no-result/no-result';
import {getUserById,getTrack} from 'api/baohuo'
import { getDictList } from 'api/general'
import {formatDate} from 'common/js/util'
export default {
  name:'journal',
  data(){
    return{
      list: [],
      logType: {},
      name: '',
      type: '',
      remark: ''
    }
  },
  methods:{
    formatDate(date) {
      return formatDate(date);
    }
  },
  mounted(){
    this.name = this.$route.query.name;
    let userId = this.$route.query.id;
    Promise.all([
      getDictList('agnecy_log_type'),
      getTrack(userId)
    ]).then(([res1, res2]) => {
      let arr = {};
      res1.map((item) => {
        arr[item.dkey] = item.dvalue;
      });
      this.logType = arr;
      this.list = res2;
    });
  },
  components: {
    NoResult
  }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';
  .journal{
    background-color: #f7f7f7;
    font-size: $font-size-medium-s;
    color: #333;
    .item{
      padding: 0.28rem 0.3rem;
      background-color: #fff;
      p + p {
        margin-top: 0.34rem;
      }
    }
    .item + .item {
      margin-top: 0.2rem;
    }
  }
</style>
