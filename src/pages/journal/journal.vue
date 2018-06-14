<template>
  <div class="journal">
      <div class="item" v-for="item in list">
          <p>操作人：{{name}}</p>
          <p>流转时间：{{item.approveDatetime}}</p>
      </div>
  </div>
</template>
<script>
import {getUserById,getTrack} from 'api/baohuo'
import {formatDate} from 'common/js/util'
export default {
  name:'journal',
  data(){
      return{
          list:[],
          name:''
      }
  },
  methods:{},
  mounted(){
        this.name = this.$route.query.name
        let userId = this.$route.query.id
        getTrack(userId).then(res => {
            res.logList.map(item => {
                item.approveDatetime = formatDate(item.approveDatetime)
            })
            this.list = res
        })
  },
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';
    .journal{
        background-color: #f7f7f7;
        font-size: $font-size-medium-s;
        color: #333;
        .item{
            height: 1.4rem;
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
