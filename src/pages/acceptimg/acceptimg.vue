<template>
    <div class="acceptimg">
      <img :src="urlImg" alt="">
      <div class="text">
        <span class="code">{{code}}</span>
        <span class="name">{{name}}</span>
        <span class="wxId">{{wxId}}</span>
        <span class="level">{{level}}</span>
        <span class="impowerDatetime">{{impowerDatetime}}</span>
        <span class="shouquanfang">{{shouquanfang}}</span>
      </div>
      <full-loading v-show="loading" :title="text"></full-loading>
    </div>
</template>
<script>
import { getAcceptImg, getLevel } from 'api/baohuo'
import { getUserById } from 'api/user'
import { formatImg, formatDateDate } from 'common/js/util'
import FullLoading from 'base/full-loading/full-loading';
export default {
    data(){
        return{
          loading: false,
          text: '正在加载...',
          urlImg:'',
          name: '',
          wxId: '',
          impowerDatetime: '',
          shouquanfang: '',
          level: '',
          code: ''
        }
    },
    mounted(){
      this.loading = true;
      Promise.all([
        getAcceptImg('impower_pdf'),
        getUserById(sessionStorage.getItem('userId')),
        getLevel()
      ]).then(([data1, data2, data3]) => {
        this.loading = false;
        this.urlImg = formatImg(data1.cvalue);
        this.code = data2.userId;
        this.name = data2.realName;
        this.wxId = data2.wxId;
        this.impowerDatetime = formatDateDate(data2.impowerDatetime);
        this.shouquanfang = '杭州麦记科技有限公司';
        data3.map((item) => {
          if(item.level === data2.level) {
            this.level = item.name;
          }
        });
        this.loadingFlag = false;
      }).catch(() => { this.loading = false; });
    },
  components: {
    FullLoading
  }
}
</script>
<style lang="scss" scoped>
    .acceptimg{
        position: relative;
        img{
            width: 100%;
        }
        span {
          font-size: 0.35rem;
          z-index: 33;
          position: absolute;
        }
        .code {
          margin-top: -7.6rem;
          margin-left: 2.7rem;
        }
        .name {
          margin-top: -7.1rem;
          margin-left: 3rem;
        }
        .wxId {
          margin-top: -6.6rem;
          margin-left: 3rem;
        }
        .shouquanfang {
          font-size: 0.28rem;
          margin-top: -2.5rem;
          white-space: nowrap;
          transform: scale(0.9);
          /*-ms-transform: scale(0.9);*/
          /*-webkit-transform: scale(0.9);*/
          margin-left: 3.4rem;
        }
        .impowerDatetime {
          font-size: 0.3rem;
          margin-top: -2.8rem;
          white-space: nowrap;
          transform: scale(0.8);
          -ms-transform: scale(0.8);
          -webkit-transform: scale(0.8);
          margin-left: 3.5rem;
        }
        .level {
          color: white;
          font-size: 0.3rem;
          margin-left: 3.5rem;
          margin-top: -4.5rem;
        }
    }
</style>
