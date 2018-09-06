import Vue from 'vue'
import Router from 'vue-router'

//登录页面
import login from '@/pages/login/login'
import loginBtn from '@/pages/login/loginBtn' //新增
import loginAwait from '@/pages/login/loginAwait'
import toApply from '@/pages/login/toApply'
import replying from '@/pages/login/replying'
import loginuserReferee from '@/pages/login/loginuserReferee'
import reCharge from '@/pages/login/reCharge'
import supplyInfo from '@/pages/login/supplyInfo'
//ceshi
import ceshi from '@/pages/ceshi/ceshi'


//代理管理
import home from '@/pages/home/home'
import threshold from '@/pages/threshold/threshold'
import buyCloud from '@/pages/buyCloud/buyCloud'
import buyCloudDetail from '@/pages/buyCloud/buyCloudDetail'
import tijiaodingdan from '@/pages/buyCloud/tijiaodingdan'
import noWare from '@/pages/buyCloud/noWare'
import chuhuoNoWare from '@/pages/chuhuoNoWare/chuhuoNoWare'
import noWarePay from '@/pages/buyCloud/noWarePay'
import acceptimg from '@/pages/acceptimg/acceptimg'
import agentTrajectory from '@/pages/agentTrajectory/agentTrajectory'
import structure from '@/pages/structure/structure'
import systemMessage from '@/pages/systemMessage/systemMessage'
import subAgent from '@/pages/subAgent/subAgent'
import Invitation from '@/pages/Invitation/Invitation'
import IntentionalAgent from '@/pages/IntentionalAgent/IntentionalAgent'
import detail from '@/pages/IntentionalAgent/detail'
import logout from '@/pages/logout/logout'
import check from '@/pages/check/check'
import upgrade from '@/pages/upgrade/upgrade'
import checkdispose from '@/pages/check/checkdispose'
import chargemoney from '@/pages/chargemoney/chargemoney'
import journal from '@/pages/journal/journal'
import recharge from '@/pages/recharge/recharge'
import offine from '@/pages/recharge/offine'

// 财务管理
import quxiandingdan from '@/pages/quxiandingdan/quxiandingdan'

import yejizhanghu from '@/pages/yejizhanghu/yejizhanghu'
import quxian from '@/pages/yejizhanghu/quxian'
import zhuanrumenkan from '@/pages/yejizhanghu/zhuanrumenkan'
import addBankCard from '@/components/bankcard-addedit/bankcard-addedit'

import tixianjilu from '@/pages/tixianjilu/tixianjilu'

import shenhechongzhi from '@/pages/shenhechongzhi/shenhechongzhi'
import chongzhichuli from '@/pages/shenhechongzhi/chongzhichuli'

import shenhetixian from '@/pages/shenhetixian/shenhetixian'
import tixianchuli from '@/pages/shenhetixian/tixianchuli'
import tuijianjiangli from '@/pages/tuijianjiangli/tuijianjiangli'

import chuhuojiangli from '@/pages/chuhuojiangli/chuhuojiangli'
import jieshaojiangli from '@/pages/jieshaojiangli/jieshaojiangli'

//云仓账户
import yuncangzhanghu from '@/pages/yuncangzhanghu/yuncangzhanghu'
import huopinjilu from '@/pages/yuncangzhanghu/huopinjilu'

import woyaozhihuan from '@/pages/woyaozhihuan/woyaozhihuan'
import shangpinliebiao from '@/pages/woyaozhihuan/shangpinliebiao'
import chanpinchaxun from '@/pages/chanpinchaxun/chanpinchaxun'
import chanpinDetail from '@/pages/chanpinchaxun/chanpinDetail'
import woyaochuhuo from '@/pages/woyaochuhuo/woyaochuhuo'
import wodedingdan from '@/pages/wodedingdan/wodedingdan'
import chuhuodingdan from '@/pages/chuhuodingdan/chuhuodingdan'
import waitOrder from '@/pages/waitOrder/waitOrder'
import weidianzhanghu from '@/pages/weidianzhanghu/weidianzhanghu'
import cart from '@/pages/cart/cart'
import balance from '@/pages/cart/balance'
import quxianWeiDian from '@/pages/weidianzhanghu/quxianWeiDian'
import zrmkWeiDian from '@/pages/weidianzhanghu/zrmkWeiDian'

//营销推广
import fenxiangshangcheng from '@/pages/fenxiangshangcheng/fenxiangshangcheng'
import daichulidingdan from '@/pages/daichulidingdan/daichulidingdan'
import sucaichaxun from '@/pages/sucaichaxun/sucaichaxun'
import sucaiDetail from '@/pages/sucaichaxun/sucaiDetail'

// 内购商城
import xuangoushangpin from '@/pages/xuangoushangpin/xuangoushangpin'
import shangpingoumai from '@/pages/xuangoushangpin/shangpingoumai'
import tianjiadizhi from '@/pages/tianjiadizhi/tianjiadizhi'
import dizhi from '@/pages/dizhi/dizhi'

import neigoudingdan from '@/pages/neigoudingdan/neigoudingdan'
// import neigoushangcheng from '@/pages/neigoushangcheng/neigoushangcheng'
// import goumaishangping from '@/pages/neigoushangcheng/goumaishangping'

// 防伪溯源
import fwsyqrcode from '@/pages/fwsyqrcode/fwsyqrcode'

// 物流信息
import wuliu from '@/pages/wuliu/wuliu'

// 统计分析
import myIntroduction from '@/pages/my-introduction/my-introduction'
import myRecommend from '@/pages/my-recommend/my-recommend'
import myChuhuo from '@/pages/my-chuhuo/my-chuhuo'
import profit from '@/pages/profit/profit'
import noWare1 from '@/pages/noWare/noWare'
import noWarePay1 from '@/pages/noWare/noWarePay'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    routes: [
      //ceshi
      {
          path: '/ceshi',
          name: 'ceshi',
          component: ceshi
      },
      //登录页面
      {
          path: '/',
          name: 'loginAwait',
          component: loginAwait
      },
      {
          path: '/login/replying',
          name: 'replying',
          component: replying
      },
      {
          path: '/login/loginuserReferee',
          name: 'loginuserReferee',
          component: loginuserReferee
      },
      {
          path: '/login/reCharge',
          name: 'reCharge',
          component: reCharge
      },
      {
          path: '/login/login',
          name: 'login',
          component: login
      },
      {
          path: '/login/loginBtn',
          name: 'loginBtn',
          component: loginBtn
      },
      {
          path: '/login/supplyInfo',
          name: 'supplyInfo',
          component: supplyInfo
      },
      {
          path: '/login/toApply',
          name: 'toApply',
          component: toApply
      },
      //主页面
      {
          path: '/home',
          name: 'home',
          component: home
      },
      //门槛账户
      {
          path: '/threshold',
          name: 'threshold',
          component: threshold
      },
      //充值
      {
          path: '/recharge',
          name: 'recharge',
          component: recharge
      },
      //线下充值
      {
          path: '/recharge/offine',
          name: 'offine',
          component: offine
      },
      //代理轨迹
      {
          path: '/agentTrajectory',
          name: 'agentTrajectory',
          component: agentTrajectory
      },
      //代理结构图
      {
          path: '/structure',
          name: 'structure',
          component: structure
      },
      //授权证书
      {
          path: '/acceptimg',
          name: 'acceptimg',
          component: acceptimg
      },
      //系统信息
      {
          path: '/systemMessage',
          name: 'systemMessage',
          component: systemMessage
      },
      //下级代理
      {
          path: '/subAgent',
          name: 'subAgent',
          component: subAgent
      },
      //邀请链接
      {
          path: '/Invitation',
          name: 'Invitation',
          component: Invitation
      },
      //意向代理
      {
          path: '/IntentionalAgent',
          name: 'IntentionalAgent',
          component: IntentionalAgent
      },
      //意向代理 2级页面
      {
          path: '/IntentionalAgent/detail',
          name: 'detail',
          component: detail
      },
      //申请退出
      {
          path: '/logout',
          name: 'logout',
          component: logout
      },
      //代理审核
      {
          path: '/check',
          name: 'check',
          component: check
      },
      {
          path: '/upgrade',
          name: 'upgrade',
          component: upgrade
      },
      //代理审核 2级页面
      {
          path: '/check/checkdispose',
          name: 'checkdispose',
          component: checkdispose
      },
      //审核充值
      {
          path: '/chargemoney',
          name: 'chargemoney',
          component: chargemoney
      },
      //流转日志
      {
          path: '/journal',
          name: 'journal',
          component: journal
      },
      //购买云仓
      {
          path: '/buyCloud',
          name: 'buyCloud',
          component: buyCloud
      },
      // 购买云仓-产品详情
      {
        path: '/buyCloud/buyCloudDetail',
        name: 'buyCloudDetail',
        component: buyCloudDetail
      },
      // 购买云仓-提交订单
      {
          path: '/buyCloud/tijiaodingdan',
          name: 'tijiaodingdan',
          component: tijiaodingdan
      },
      // 购买云仓-提交订单-无云仓
      {
          path: '/buyCloud/noWare',
          name: 'noWare',
          component: noWare
      },
      // 购买云仓-支付-无云仓
      {
          path: '/buyCloud/noWarePay',
          name: 'noWarePay',
          component: noWarePay
      },
      // 出货-无云仓
      {
        path: '/chuhuoNoWare',
        name: 'chuhuoNoWare',
        component: chuhuoNoWare
      },
      //取现订单
      {
          path: '/quxiandingdan',
          name: 'quxiandingdan',
          component: quxiandingdan
      },
      //业绩账户
      {
          path: '/yejizhanghu',
          name: 'yejizhanghu',
          component: yejizhanghu
      },
      //取现(业绩账户二级页面)
      {
          path: '/yejizhanghu/quxian',
          name: 'quxian',
          component: quxian
      },
      //添加银行卡(业绩账户-取现-添加银行卡)
      {
          path: '/yejizhanghu/addBankCard',
          name: 'addBankCard',
          component: addBankCard
      },
      //转入门槛(业绩账户二级页面)
      {
          path: '/yejizhanghu/zhuanrumenkan',
          name: 'zhuanrumenkan',
          component: zhuanrumenkan
      },
      //提现记录
      {
          path: '/tixianjilu',
          name: 'tixianjilu',
          component: tixianjilu
      },
      //审核充值
      {
          path: '/shenhechongzhi',
          name: 'shenhechongzhi',
          component: shenhechongzhi
      },
      //充值处理（审核充值2级页面）
      {
          path: '/shenhechongzhi/chongzhichuli',
          name: 'chongzhichuli',
          component: chongzhichuli
      },
      //审核提现
      {
        path: '/shenhetixian',
        name: 'shenhetixina',
        component: shenhetixian
      },
      //审核提现-提现处理
      {
        path: '/shenhetixian/tixianchuli',
        name: 'tixianchuli',
        component: tixianchuli
      },
      //推荐奖励
      {
          path: '/tuijianjiangli',
          name: 'tuijianjiangli',
          component: tuijianjiangli
      },
      //出货奖励
      {
          path: '/chuhuojiangli',
          name: 'chuhuojiangli',
          component: chuhuojiangli
      },
      //介绍奖励
      {
          path: '/jieshaojiangli',
          name: 'jieshaojiangli',
          component: jieshaojiangli
      },
      // 微店账户
      {
        path: '/weidianzhanghu',
        name: 'weidianzhanghu',
        component: weidianzhanghu
      },
      // 微店账户-取现
      {
        path: '/weidianzhanghu/quxianWeiDian',
        name: 'quxianWeiDian',
        component: quxianWeiDian
      },
      // 微店账户-转入门槛
      {
        path: '/weidianzhanghu/zrmkWeiDian',
        name: 'zrmkWeiDian',
        component: zrmkWeiDian
      },
      //云仓账户
      {
          path: '/yuncangzhanghu',
          name: 'yuncangzhanghu',
          component: yuncangzhanghu
      },
      //货品记录
      {
          path: '/yuncangzhanghu/huopinjilu',
          name: 'huopinjilu',
          component: huopinjilu
      },
      //我要置换
      {
          path: '/woyaozhihuan',
          name: 'woyaozhihuan',
          component: woyaozhihuan
      },
      //商品列表
      {
          path: '/woyaozhihuan/shangpinliebiao',
          name: 'shangpinliebiao',
          component: shangpinliebiao
      },
      //产品查询
      {
          path: '/chanpinchaxun',
          name: 'chanpinchaxun',
          component: chanpinchaxun
      },
      // 产品查询-详情
      {
        path: '/chanpinchaxun/chanpinDetail',
        name: 'chanpinDetail',
        component: chanpinDetail
      },
      //寄送到家
      {
          path: '/woyaochuhuo',
          name: 'woyaochuhuo',
          component: woyaochuhuo
      },
      //云仓订单
      {
          path: '/wodedingdan',
          name: 'wodedingdan',
          component: wodedingdan
      },
      // 购物车
      {
        path: '/cart',
        name: 'cart',
        component: cart
      },
      // 购物车-结算
      {
        path: '/cart/balance',
        name: 'balance',
        component: balance
      },
      //出货订单
      {
        path: '/chuhuodingdan',
        name: 'chuhuodingdan',
        component: chuhuodingdan
      },
      //待处理订单
      {
        path: '/waitOrder',
        name: 'waitOrder',
        component: waitOrder
      },
      //分享商城
      {
          path: '/fenxiangshangcheng',
          name: 'fenxiangshangcheng',
          component: fenxiangshangcheng
      },
      //素材查询
      {
          path: '/sucaichaxun',
          name: 'sucaichaxun',
          component: sucaichaxun
      },
      //素材查询
      {
          path: '/sucaichaxun/sucaiDetail',
          name: 'sucaiDetail',
          component: sucaiDetail
      },
      //待处理订单
      {
          path: '/daichulidingdan',
          name: 'daichulidingdan',
          component: daichulidingdan
      },

      // //内购商城
      // {
      //   path: '/neigoushangcheng',
      //   name: 'neigoushangcheng',
      //   component: neigoushangcheng
      // },
      // //购买商品
      // {
      //   path: '/neigoushangcheng/goumaishangping',
      //   name: 'goumaishangping',
      //   component: goumaishangping
      // },
      //

      //选购商品
      {
          path: '/xuangoushangpin',
          name: 'xuangoushangpin',
          component: xuangoushangpin
      },
      //商品购买
      {
          path: '/xuangoushangpin/shangpingoumai',
          name: 'shangpingoumai',
          component: shangpingoumai
      },
      //添加地址
      {
          path: '/tianjiadizhi',
          name: 'tianjiadizhi',
          component: tianjiadizhi
      },
      //地址
      {
          path: '/dizhi',
          name: 'dizhi',
          component: dizhi
      },
      //内购商城我的订单
      {
          path: '/neigoudingdan',
          name: 'neigoudingdan',
          component: neigoudingdan
      },
      //测试防伪溯源二维码
      {
          path: '/fwsyqrcode',
          name: 'fwsyqrcode',
          component: fwsyqrcode
      },
      //测物流查看页面
      {
          path: '/wuliu',
          name: 'wuliu',
          component: wuliu
      },
      // 我的介绍
      {
        path: '/my-introduction',
        name: 'my-introductio',
        component: myIntroduction
      },
      // 我的推荐
      {
        path: '/my-recommend',
        name: 'my-recommend',
        component: myRecommend
      },
      // 我的出货
      {
        path: '/my-chuhuo',
        name: 'my-chuhuo',
        component: myChuhuo
      },
      // 差价利润
      {
        path: '/profit',
        name: 'profit',
        component: profit
      },
      // 差价利润
      {
        path: '/noWare',
        name: 'noWare',
        component: noWare1
      },
      // 差价利润
      {
        path: '/noWare/noWarePay',
        name: 'noWarePay',
        component: noWarePay1
      },
    ]
})
