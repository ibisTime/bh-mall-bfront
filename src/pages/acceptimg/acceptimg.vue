<template>
    <div class="acceptimg">
            <img :src="urlImg" alt="">
    </div>
</template>
<script>
import {getAcceptImg} from 'api/baohuo'
import {formatImg} from 'common/js/util'
export default {
    data(){
        return{
            urlImg:''
        }
    },
    mounted(){
        getAcceptImg('impower_pdf').then(res => {
            console.log(res)
            // this.urlImg = res.cvalue
            this.urlImg = formatImg(res.cvalue)
        })
    }
}
</script>
<style lang="scss" scoped>
    .acceptimg{
        img{
            width: 100%;
        }
    }
</style>
