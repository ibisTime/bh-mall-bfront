<template>
    <div class="sucaichaxun">
        <div class="header clearfix">
            <div @click="changeIndex(item.dkey)" :class="[num == item.dkey ? 'active' : '']" v-for="(item,index) in list">
                <i>{{item.dvalue}}</i>
            </div>
            <!-- <div @click="changeIndex(2)" :class="[index == 2 ? 'active' : '']">
                <i>培训素材</i>
            </div> -->
            <!-- <div @click="changeIndex(3)" :class="[index == 3 ? 'active' : '']">
                <i>素材三</i>
            </div>
            <div @click="changeIndex(4)" :class="[index == 4 ? 'active' : '']">
                <i>素材四</i>
            </div> -->
        </div>
        <div class="container">
            <div class="item" v-for="v in shopList">
                <img :src="v.pic">
                <p>{{v.title}}</p>
            </div>
            <!-- <div class="item">
                <img src="../../assets/imgs/buyimg.png">
                <p>商品名称</p>
            </div>
            <div class="item">
                <img src="../../assets/imgs/buyimg.png">
                <p>商品名称</p>
            </div> -->
        </div>
    </div>
</template>
<script>
import {queryFodder,queryFodderName} from 'api/baohuo';
import {formatDate,formatImg} from 'common/js/util';
export default {
    data(){
        return{
            num:0,
            list:[],
            shopList:[],
        }
    },
    methods:{
        changeIndex(num) {
            this.num = num
            this.check()
        },
        check(){
            queryFodder(this.num).then(res => {
                // console.log(res)
                res.list.map(function(item){
                    item.pic = formatImg(item.pic)
                })
                this.shopList = res.list
            })
        }
    },
    mounted(){
        queryFodderName().then(res => {
            this.list = res
        })
        this.check()
    }

}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
@import "../../common/scss/base.scss";
    .sucaichaxun{
        background-color: #f7f7f7;
        .header{
            background-color: #fff;
            >div{
                float: left;
                width: 50%;
                height: 0.9rem;
                position: relative;
                i{
                    font-size: $font-size-medium;
                    color:#333;
                    height: 0.9rem;
                    line-height: 0.9rem;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                }
                &.active{
                    i{
                        color: $primary-color;
                        border-bottom: 0.06rem solid $primary-color;
                    }
                }
            }
        }
        .container{
            // padding: 0.3rem;
            overflow: hidden;
            background-color: #fff;
            .item{
                float: left;
                margin-top: 0.3rem;
                margin-left: 0.3rem;
                >img{
                    width: 3.3rem;
                    height: 3.3rem;
                }
                p{
                    margin-top: 0.3rem;
                    font-size: $font-size-medium-s;
                    color: #333;
                    text-align: center;
                }
            }
        }
    }
</style>
