<template>
    <div class="agentTrajectory">
        <div class="header">
            <p><span>微信：</span> <i>{{info.wxId}}</i></p>
            <p><span>当前等级：</span> <i>{{level}}</i></p>
            <p><span>当前上级：</span> <i>{{highUserId}}</i></p>
            <p><span>推荐人：</span> <i>{{realName}}</i></p>
        </div>
        <div class="blank"></div>
        <div class="content">
            <div :class="['item',index !== 0 ? 'color' : '']" v-for="(item,index) in logList" :key="index">
                <div class="line"></div>
                <img src="../../assets/threshold/point01.png" alt="">
                <i></i>
                <div class="detail">
                    <p class="username">{{item.applyUser}}</p>
                    <p>{{item.applyDatetime}}</p>
                    <p>推荐人：</p>
                    <p>操作人：{{item.approvName}}</p>
                    <span class="tip">{{status[item.status]}}</span>
                </div>
            </div>
            <!-- <div class="item color">
                <div class="line"></div>
                <img src="../../assets/threshold/point02.png" alt="">
                <i></i>
                <div class="detail">
                    <p class="username">总代</p>
                    <p>2018-03-26 <i class="time">09:00:00</i></p>
                    <p>推荐人：</p>
                    <p>操作人：公司</p>
                    <span class="tip">审核授权通过</span>
                </div>
            </div> -->
        </div>
        <div class="backcenter">
            <span class="back" @click="$router.push('/home');">返回个人中心</span>
        </div>
    </div>
</template>
<script>
import {getTrack,getLevel} from 'api/baohuo'
import {formatDate} from 'common/js/util';
import {getCookie} from 'common/js/cookie';
import {getUser,getUserById} from 'api/user';
import {status} from 'api/status';
export default {
    data(){
        return{
            info:'',
            level:'',
            highuser: '',
            logList:[],
            status:[],
            userId: '',
            highUserId: '',
            realName: ''
        }
    },
    methods:{

    },
    mounted(){
        // console.log(status)
        this.status = status
        //当前用户以及轨迹
        getTrack().then(res => {
            console.log(res.highUserId);
            this.info = res
            this.logList = res.logList
            this.userId = res.userId
            this.highUserId = res.logList[0].highUserId
            this.realName = res.realName
            //当前等级
            getLevel(this.info.level).then(res =>{
                this.level = res[0].name;
            })

            //遍历轨迹 重新生成轨迹数组

            this.logList.map(function(item){
                item.applyDatetime = formatDate(item.applyDatetime)
            })

        })
    },
    computed:{
    }
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
    .agentTrajectory{
        font-size: $font-size-medium;
        .fl{
            float: left;
        }
        .header{
            height: 3.2rem;
            padding: 0.5rem 0.45rem;
            p + p{
                margin-top: 0.36rem;
            }
            p{
                span{
                    color: #666;
                }
                i{
                    color: #333;
                }
            }
        }
        .blank{
            height: 0.2rem;
            background-color: #f7f7f7;
        }
        .content{
            padding-left: 0.7rem;
            .item{
                position: relative;
                .line{
                    width: 0.04rem;
                    height: 2.65rem;
                    background-color: #f7f7f7;
                }
                img{
                    width: 0.3rem;
                    position: absolute;
                    top:50%;
                    transform: translate(-50%,-50%);
                }
                >i{
                    width: 0.3rem;
                    height: 2px;
                    position: absolute;
                    top: 50%;
                    left: 0.15rem;
                    transform: translateY(-50%);
                    background-color: #666;
                }
                .detail{
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left:0.45rem;
                    width: 5.58rem;
                    height: 2.16rem;
                    border-radius: 0.2rem;
                    background-color: #666;
                    color:#fff;
                    font-size: $font-size-small;
                    padding: 0.32rem 0.3rem;
                    .time{
                        font-size: $font-size-small-ss;
                    }
                    .tip{
                        position: absolute;
                        top: 0.32rem;
                        right: 0.3rem;
                    }
                    p + p{
                        margin-top: 0.21rem;
                        font-size: $font-size-small-ss;
                    }
                }
            }
            .color{
               .detail{
                    background-color: #f0f0f0 !important;
               }
                >i{
                    background-color: #f0f0f0 !important;
                }
                .username{
                    color: #333 !important;
                }
                p{
                    color: #999 !important;
                }
                .tip{
                    color: #333 !important;
                }
            }
        }
        .backcenter{
            margin-top: 1rem;
            margin-left: 0.7rem;
            width: 6rem;
            height: 0.89rem;
            line-height: 0.89rem;
            text-align: center;
            background-color: $primary-color;
            border-radius: 0.1rem;
            color: #fafafa;
            span{
                font-size: $font-size-medium-xx;
            }
        }
    }
</style>
