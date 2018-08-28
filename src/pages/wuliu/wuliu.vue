<template>
    <div>
      <div class="text">
        <div><span>物流单号:{{this.code}}</span></div>
        <br/>
        <div><span>物流公司:{{this.company}}</span></div>
      </div>
    </div>
</template>
<script>
import { getAcceptImg } from 'api/baohuo'
import { getUserById } from 'api/user'
import { getDictList } from 'api/general'
import { formatImg, formatDateDate } from 'common/js/util'
export default {
    data(){
      return{
        code: '',
        company: ''
      }
    },
    mounted(){
      this.code =  this.$route.query.code;
      this.company =  this.$route.query.company;
      getDictList('kd_company').then((res) => {
        res.map((item) => {
          if(item.dkey === this.company)
            this.company = item.dvalue;
        })
      })
    }
}
</script>
<style lang="scss" scoped>
    .text {
      /*padding: 0.2rem;*/

      div {
        font-size: 0.4rem;
        display: inline-block;
        margin: 0 auto;
        text-align: center;
        padding-left: 0.3rem;
      }
    }
</style>
