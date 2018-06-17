<template>
    <div class="shangpinliebiao">
        <div class="header">
            <span class="left" @click="back">取消</span>
            <span class="center">商品列表</span>
            <span class="right" @click="backParams">确定</span>
        </div>
        <div v-if="flag == 1" class="item" v-for="(item,index) in list" @click="choose(item.code,index)">
            <div :class="['circle',num === index ? 'active' : '']"></div>
            <img :src="item.pic">
            <div class="content">
                <p>{{item.name}}</p>
                <i>￥{{item.specsList[0].priceList[0].price / 1000}}</i>
                <span>1{{item.specsList[0].name}}</span>
            </div>
        </div>
        <div v-else="flag == 2" class="item" v-for="(item,index) in list" @click="choose(item.code,index)">
            <div :class="['circle',num === index ? 'active' : '']"></div>
            <img :src="item.pic">
            <div class="content">
                <p>{{item.productName}}</p>
                <i>￥{{item.price / 1000}}</i>
                <span>{{item.quantity}}{{item.productSpecsName}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import {queryProduct,getCloudList,productDetail,getCloudDetail,_productDetail} from 'api/baohuo'
import {getUser,getUserById} from 'api/user';
import {setCookie,getCookie} from 'common/js/cookie.js';
import {formatDate,formatImg} from 'common/js/util';
export default {
    data(){
        return{
            list:[],
            code:'',
            flag:'',
            num:'',
            level:'',
        }
    },
    methods:{
        choose(code,index){
            this.code = code
            this.num = index
            if(this.flag == 1) {
                productDetail(this.code,this.level).then(res => {
                    setCookie('myDetail',JSON.stringify(res))
                })
            }else if(this.flag == 2) {
                getCloudDetail(this.code).then(res => {
                    setCookie('cloudDetail',JSON.stringify(res))
                })
            }
        },
        backParams(){
            this.$router.push('/woyaozhihuan?flag='+ this.flag +'&code=' + this.code)
        },
        back(){
            this.$router.push('/woyaozhihuan')
        }
    },
    mounted(){
        this.flag = this.$route.query.flag
        this.level = getCookie('level')
        let self = this
        if(this.flag == 1) {

            
            //查询我的商品
            queryProduct(this.level).then(res =>{
                res.list.map(function(item){
                    item.pic = formatImg(item.pic)
                })
                this.list = res.list
            })
        }else if(this.flag == 2) {

            //获取云仓商品
            getCloudList().then(res => {    
                //遍历格式化图片
                res.list.map(function(item){
                    
                    //查询产品详情
                    getCloudDetail(item.code).then(info => {
                        item.pic = formatImg(info.pic)
                    })
                })
                console.log(res)
                this.list = res.list
            })
        }
    },
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
@import "../../common/scss/base.scss";
    .shangpinliebiao{
        background-color: #f7f7f7;
        height: 100%;
        .header{
            height: 1rem;
            position: relative;
            border-bottom: 1px solid #eee;
            background-color: #fff;
            >span{
                position: absolute;
                top: 0;
                line-height: 1rem;
                font-size: $font-size-medium-x;
                text-align: center;
                &.left{
                    left: 0;
                    width: 1.4rem;
                    color: #999;
                }
                &.right{
                    right: 0;
                    width: 1.4rem;
                    color: $primary-color;
                }
                &.center{
                    width: 1.4rem;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: $font-size-medium-xx;
                }
            }
        }
        .item{
            padding: 0.2rem 0.3rem;
            padding-left: 0.9rem;
            background-color: #fff;
            overflow: hidden;
            border-bottom: 1px solid #eee;
            position: relative;
            .circle{
                width: 0.4rem;
                height: 0.4rem;
                position: absolute;
                left: 0.25rem;
                top: 50%;
                transform: translateY(-50%);
                border: 1px solid #dedede;
                border-radius: 50%;
                &.active{
                    background-color: $primary-color;
                }
            }
            img {
            float: left;
            width: 1.8rem;
            height: 1.8rem;
            }
            .content {
                margin-left: 2rem;
                position: relative;
                p {
                    font-size: $font-size-medium-s;
                    color: #333;
                    line-height: 0.4rem;
                }
                i {
                    position: absolute;
                    top: 1.15rem;
                    left: 0;
                    font-size: $font-size-small;
                    color: $primary-color;
                }
                span {
                    width: 1.2rem;
                    line-height: 0.5rem;
                    position: absolute;
                    top: 0;
                    right: 0;
                    font-size:$font-size-medium-x;
                    border-radius: 0.1rem;
                    color: #333;
                    text-align: center;
                }
            }
        }
    }
</style>
