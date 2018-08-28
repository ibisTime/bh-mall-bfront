import fetch from 'common/js/fetch';
import {
    getUserId
} from 'common/js/util';
import {
    getCookie
} from 'common/js/cookie';
import {user} from "../store/getters";

// 获取门槛账户
export function getBill(userId) {
    return fetch(627453, {
        userId: userId || getUserId(),
        currency: 'MK_CNY'
    });
}


//获取业绩账户
export function getPerformance(userId) {
    return fetch(627453, {
        userId: getUserId(),
        currency: 'TX_CNY'
    });
}
//获取C端账户
export function getCaccount(info) {
  return fetch(627453, {
    userId: getUserId(),
    currency: info.currency
  });
}
//待处理订单发货
export function yunfahuo(options) {
    return fetch(627645, {
        code: options.code,
        deliver: getUserId(),
        isCompanySend: 1,
        logisticsCode: options.logisticsCode,
        logisticsCompany: options.logisticsCompany,
        pdf: options.pdf
    });
}
//自发发货
export function noyunfahuo(options) {
    return fetch(627645, {
        code: options.code,
        deliver: getUserId(),
        isCompanySend: 0,
        logisticsCode: options.logisticsCode,
        logisticsCompany: options.logisticsCompany,
        pdf: options.pdf
    });
}
//申请取消云仓订单
export function cencelCloudOrder(code) {
    return fetch(627903, {
        code: code
    });
}
//申请取消出货订单
export function cencelChuHuoOrder(code) {
  return fetch(627646, {
    code: code
  });
}

//根据用户编号查询云仓
export function getCloud(userId) {
    return fetch(627814, {
        userId: getUserId(),
    });
}

//详情查询云仓产品
export function getCloudDetail(productCode) {
    return fetch(627813, {
        code: productCode,
    });
}

//分页查询云仓产品（front）
export function getCloudList(userId) {
    return fetch(627811, {
        start: 1,
        limit: 100,
        userId: userId || getUserId(),
    });
}

// 我的查询流水
export function queryBill(accountNumber) {
    return fetch(627494, {
        accountNumber: accountNumber,
        start: 1,
        limit: 100,
    });
}

// 获取代理轨迹（627358）
export function getTrack() {
    return fetch(627328, {
        limit: '100',
        start: '1',
        userId: getUserId()
    });
}

// 获取等级名称
export function getLevel(level) {
    return fetch(627006, {
        level: level
    });
}

//代理结构图
export function getStructure(userId) {
    return fetch(627351, {
        limit: '100',
        start: '0',
        userId: userId || getUserId()
    });
}

//我的下级
export function getMySub() {
    return fetch(627320, {
        limit: '100',
        start: '0',
        userId: getUserId(),
    });
}

export function getUserStatu(userId) {
    return fetch(627327, {
        userId: userId
    })
}

//我的下级==按照等级
export function getLevelSub(level) {
    return fetch(627320, {
        limit: '100',
        start: '0',
        userId: getUserId(),
        level: level
    });
}

//我的下级==按照关键字
export function getKeywordSub(info) {
    return fetch(627320, {
      limit: '100',
      start: '0',
      userId: getUserId(),
      keyword: info.keyword,
      status: info.status || ''
    });
}

//获取全部等级
export function getAllLevel(lowLevel) {
    return fetch(627005, {
        start: '1',
        limit: '100',
        lowLevel: lowLevel
    });
}

//获取全部等级
export function getAllLevel1(lowLevel) {
    return fetch(627005, {
        start: '1',
        limit: '100',
        lowLevel: lowLevel,
        orderColumn: 'level',
        orderDir: 'asc'
    });
}

//获取APPID
export function getAppId(ckey) {
    return fetch(627087, {
        'ckey': ckey
    });
}

//获取授权图片
export function getAcceptImg(ckey) {
    return fetch(627087, {
        'ckey': ckey
    });
}

//获取手续费
export function getPercent(ckey) {
    return fetch(627087, {
        'ckey': ckey
    });
}

//申请代理  传入一个对象（包含推荐人）（627251）
export function replyAgent(options) {
    return fetch(627270, {
      address: options.address,
      applyLevel: options.applyLevel,
      area: options.district,
      city: options.city,
      // fromInfo: '微信推荐',
      idHand: options.idHand,
      idKind: '1',
      idNo: options.idNo,
      introducer: options.introducer,
      mobile: options.mobile,
      province: options.province,
      realName: options.realName,

      wxId: options.wxId,
      userId: options.userId,
      // idBehind: options.idBehind,
      // idFront: options.idFront,
      // payPdf: options.payPdf,
      // userReferee: options.userReferee,
      teamName: options.teamName
    });
}

//_代理申请没有推荐人
export function _replyAgent(options, userId) {
    return fetch(627250, {
        address: options.address,
        area: options.district,
        city: options.city,
        applyLevel: options.applyLevel,
        mobile: options.mobile,
        province: options.province,
        realName: options.realName,
        wxId: options.wxId,
        userId: userId,
        fromInfo: '微信推荐'
    });
}

//用户登录
export function userLogin(loginName, loginPwd) {
    return fetch(627300, {
        loginName: loginName,
        loginPwd: loginPwd,
        kind: 'P'
    });
}

//代理查询（意向代理，审核代理）（627353）
export function intentional(status) {
    return fetch(627325, {
        status: status,
        userId: getUserId(),
        start: 1,
        limit: 100,
    });
}
// 分页查待审核代理（627361）
export function agent(status) {
    return fetch(627285, {
        status: status,
        userId: getUserId(),
        start: 1,
        limit: 100,
    });
}
// 分页查升级单
export function upgradeList(status) {
  return fetch(627305, {
    status: status,
    userId: getUserId(),
    start: 1,
    limit: 100,
  });
}
//登录
export function usergo1(code) {
    return fetch(627310, {
        code: code
    });
}
//红线检查
export function checkRed(userId) {
    return fetch(627805, {
        userId: userId
    })
}
export function usergo2(code, userReferee) {
    return fetch(627310, {
        code: code,
        userReferee: userReferee
    });
}

//申请退出
export function userExit(code) {
    return fetch(627274, {
        userId: getUserId(),
    });
}

//向下分配
export function allotAgent(options) {
    return fetch(627252, {
        approver: getUserId(),
        // manager: options.manager,
        userId: options.userId,
        toUserId: options.toUserId
    });
}

//管理员查询
export function queryManager() {
    return fetch(627045, {
        limit: 100,
        start: 0,
    });
}

//接受
export function acceptAgent(userId) {
    return fetch(627254, {
        approver: getUserId(),
        userId: userId,
    });
}

//忽略
export function ignoreAgent(userId) {
    return fetch(627256, {
        approver: getUserId(),
        userId: userId,
    });
}

//审核授权(627257)
export function accredit(userId, result, remark) {
    return fetch(627273, {
        result,
        userId,
        remark,
        approver: getUserId()
    });
}

//审核升级
export function upgrade(userId, result, remark) {
    return fetch(627292, {
        result,
        userId,
        remark,
        approver: getUserId()
    });
}

//升级申请
export function upgradeApplica(options) {
    return fetch(627290, {
      highLevel: options.highLevel,
      idNo: options.idNo || '',
      idHand: options.idHand || '',
      padAmount: options.padAmount,
      payPdf: options.payPdf,
      teamName: options.teamName || '',
      userId: getUserId()
    })
}

//审核取消授权（627258）
export function accreditCancel(userId, result, remark) {
    return fetch(627276, {
        userId,
        result,
        remark,
        approver: getUserId()
    });
}

//分页查询产品
export function queryProduct(info) {
    return fetch(627555, {
      level: info.level,
      limit: info.limit || 100,
      name: info.name || '',
      start: info.start || 1,
      status: info.status || ''
    });
}

//获取内购商品列表
export function neigouProduct(status) {
    return fetch(627710, {
        start: 1,
        limit: 100,
        status: status || ''
    })
}

//获取内购产品详情
export function neigouProductDetail(code) {
    return fetch(627712, {
        code: code
    })
}

//查询产品详情
export function productDetail(info) {
    return fetch(627558, {
      code: info.code,
      level: info.level,
    });
}

// 根据产品规格查
export function productDetailBySpec(info) {
    return fetch(627559, {
        level: info.level || '',
        specsCode: info.specsCode || ''
    });
}

//获取用户余额
export function getAccount(userId) {
    return fetch(627814, {
        userId: userId || getUserId(),
    });
}

//线下充值
export function sendMoney(accountNumber, chargeAmount, chargePdf) {
    return fetch(627460, {
        accountNumber: accountNumber,
        applyUser: getUserId(),
        chargeAmount: chargeAmount,
        chargePdf: chargePdf,
        type: 'AJ_CZ',
    });
}

//查询微信充值config
export function queryConfig(accountNumber, amount) {
    return fetch(627462, {
        accountNumber: accountNumber,
        amount: amount,
        applyUser: getUserId(),
        channelType: '35'
    });
}

//获取微信分享config  'http://cm.hw.hichengdai.com'
export function inquireConfig(url) {
    return fetch(627092, {
        url: url,
    });
}

//支付
export function payment(codeList, payType) {
    return fetch(627721, {
      codeList: codeList,
        payType: payType
    })
}
//云仓支付
export function cloudPayment(codeList, payType) {
    return fetch(627902, {
        codeList: codeList,
        payType: payType
    })
}

//云仓出货
export function cloudSend(options) {
    return fetch(627815, {
        address: options.address,
        applyNote: options.applyNote,
        area: options.area,
        city: options.city,
        mobile: options.mobile,
        productSpecsCode: options.productSpecsCode,
        province: options.province,
        quantity: options.quantity,
        signer: options.signer,
        userId: getUserId()
    })
}

//云仓下单
export function cloudBill(options) {
    return fetch(627900, {
      applyUser: getUserId(),
      quantity: options.quantity,
      specsCode: options.specsCode,
      applyNote: options.applyNote || ''
    });
}

//商城下单
export function shopBill(options) {
    return fetch(627641, {
        address: options.address,
        applyUser: getUserId(),
        area: options.area,
        city: options.city,
        mobile: options.mobile,
        province: options.province,
        signer: options.receiver,
        productSpecsCode: options.productSpecsCode,
        quantity: options.quantity,
        toUser: getUserId(),
        isSendHome: 1,
        applyNote: options.applyNote,
    });
}

export function palceOrder(options) {
    return fetch(627720, {
        address: options.address,
        applyUser: getUserId(),
        area: options.area,
        city: options.city,
        mobile: options.mobile,
        province: options.province,
        signer: options.signer,
        specsCode: options.specsCode,
        quantity: options.quantity,
        toUser: getUserId(),
        applyNote: options.applyNote,
    })
}

//业绩账户转门槛账户
export function transfer(info) {
    return fetch(627440, {
      amount: info.amount,
      fromAccount: info.fromAccount,
      toAccount: info.toAccount,
      userId: getUserId(),
    });
}

//查询账户详情
export function queryAmount(accountNumber) {
    return fetch(627452, {
        accountNumber: accountNumber,
    });
}

//列表查询银行卡
export function queryBankCard() {
    return fetch(627531, {
        token: getCookie('token'),
        userId: getUserId(),
    });
}

//详情查询银行卡
export function queryBankCardDetail(code) {
    return fetch(627532, {
        token: getCookie('token'),
        code: code,
    });
}

//取现
export function quxian(options) {
    return fetch(627501, {
        accountNumber: options.accountNumber,
        amount: options.account * 1000,
        applyUser: getUserId(),
        payCardInfo: options.payCardInfo,
        payCardNo: options.payCardNo,
    });
}

//审核充值
export function queryIndent(status) {
    return fetch(627473, {
        userId: getUserId(),
        start: 1,
        limit: 100,
        status: status,
    });
}

//详情查询审核充值订单
export function queryIndentDetail(code) {
    return fetch(627472, {
        code: code
    });
}

//审批线下充值订单
export function checkRecharge(code) {
    return fetch(627463, {
        code: code,
        payResult: '1',
        payUser: getUserId(),
        status: 6
    });
}

//审批线下充值订单-不通过
export function checkRechargeNo(code) {
  return fetch(627463, {
    code: code,
    payResult: '0',
    payUser: getUserId(),
    status: 6
  });
}

//分页查询取现订单
export function checkRechargeBill(status = '') {
    return fetch(627513, {
        start: 0,
        limit: 100,
        status: status,
        userId: getUserId(),
    });
}

//详情查询取现订单列表(oss)
export function checkRechargeBillDetail(code) {
    return fetch(627512, {
        code: code
    });
}

//收支明细（front/oss）
export function award(options) {
    return fetch(627492, {
        bizType: options.bizType,
        kind: options.kind,
        dateStart: options.dateStart,
        dateEnd: options.dateEnd,
        start: 1,
        limit: 100,
        userId: getUserId(),
    });
}

//详情查询云仓产品流水记录
export function queryProductDetail(productCode) {
    return fetch(627834, {
        start: 0,
        limit: 100,
        productCode: productCode
    });
}
//详情查询出货订单
export function outOrderDetail(code) {
  return fetch(627664, { code });
}
//分页查询出货订单
export function queryOrderForm(statusList) {
    return fetch(627665, {
        start: 1,
        limit: 100,
        statusList: statusList,
        applyUser: getUserId()
    });
}
export function queryOrderForm1(statusList) {
    return fetch(627665, {
        start: 1,
        limit: 100,
        statusList: statusList,
        toUserId: getUserId()
    });
}
export function queryOrderForm2(info) {
  return fetch(627665, {
    start: info.start || 1,
    limit: info.limit || 100,
    statusList: info.statusList || '',
    applyUser: getUserId()
  });
}
// 分页查云仓订单
export function queryYunOrder(info) {
  return fetch(627915, {
    start: info.start || 1,
    limit: info.limit || 100,
    status: info.status || '',
  });
}
//分页查询内购商城理订单
export function queryShopForm(statusList) {
    return fetch(627731, {
        start: 1,
        limit: 100,
        // toUserId: getUserId(),
        statusList: statusList,
    });
}
// 详情查内购订单
export function thingDrtail(code) {
    return fetch(627733, {
        code: code
    })
}
//627790_提交云仓置换申请单
export function requestNode(options) {
    return fetch(627790, {
        applyUser: getUserId(),
        changeSpecsCode: options.changeSpecsCode,
        productSpecsCode: options.productSpecsCode,
        quantity: options.quantity,
    });
}

//查看云仓置换价格
export function queryMoney(options) {
    return fetch(627804, {
        applyUser: getUserId(),
        changeSpecsCode: options.changeSpecsCode,
        productSpecsCode: options.productSpecsCode,
        quantity: options.quantity,
    });
}

//分页查询地址
export function queryAddress() {
    return fetch(627411, {
        start: 1,
        limit: 100,
        userId: getUserId(),
    });
}

//添加地址
export function addAddress(options) {
    return fetch(627400, {
        address: options.address,
        area: options.district,
        city: options.city,
        isDefault: 1,
        mobile: options.mobile,
        province: options.province,
        receiver: options.receiver,
        type: 1,
        userId: getUserId(),
    });
}

//设置默认地址
export function setDefultAddress(code) {
    return fetch(627403, {
        code: code
    })
}

//详情查询地址
export function queryAddressDetail(code) {
    return fetch(627412, {
        code: code,
    });
}

//查询默认地址
export function queryDefaultAddress() {
    return fetch(627411, {
        isDefault: 1,
        userId: getUserId(),
    });
}

//素材查询
export function queryFodder(type) {
    return fetch(627430, {
        start: 0,
        limit: 100,
        type: type,
    });
}
// 详情查素材
export function sucaiDetail(code) {
  return fetch(627432, {
    code
  });
}
//素材名称
export function queryFodderName() {
    return fetch(627076, {
        // start:0,
        // limit:100,
        parentKey: 'material_type',
    });

}

//补充信息
export function supplyInfo(info) {
    return fetch(627271, {
      applyLevel: info.applyLevel || '',
      idHand: info.idHand || '',
      idKind: info.idKind || '',
      idNo: info.idNo || '',
      introducer: info.introducer || '',
      mobile: info.mobile || '',
      teamName: info.teamName || '',
      userId: info.userId || ''
    });

}

//该等级是否需要实名认证
export function isRealName(userId) {
    return fetch(627363, {
        userId: userId
    });
}

//确认收货普通订单
export function receiveNromalOrder(code) {
    return fetch(627649, {
        code: code
    });
}

//确认收货内购订单
export function receiveNeigouOrder(code) {
    return fetch(627726, {
        code: code
    });
}
// 审核取消
export function checkCancel(code, result, remark) {
    return fetch(627647, {
        code,
        result,
        remark,
        updater: getUserId()
    });
}
// 前端查统计信息
export function getStatistics(info) {
  return fetch(627852, {
    start: 1,
    limit: 1000,
    userId: getUserId(),
    introducer: info.introducer || '',
    referrer: info.referrer || '',
    keyword: info.keyword || '',
    level: info.level || ''
  });
}
// 分页查流水
export function liushuiList(info) {
  return fetch(627490, {
    start: 1,
    limit: 1000,
    userId: getUserId(),
    bizType: info.bizType || ''
  });
}
// 统计分析-我的出货接口
export function myChuHuo(info) {
  return fetch(627854, {
    start: 1,
    limit: 100,
    statusList: info.statusList,
    applyUser: info.userId || getUserId()
  });
}
// 统计分析-差价利润接口
export function profit(info) {
  return fetch(627855, {
    start: 1,
    limit: 1000,
    userId: getUserId(),
    bizType: info.bizType || ''
  });
}
// 分页查购物车
export function getCartList() {
  return fetch(627630, {
    start: 1,
    limit: 1000,
    userId: getUserId()
  });
}
// 添加购物车
export function toCart(info) {
  return fetch(627620, {
    productSpecsCode: info.productSpecsCode,
    quantity: info.quantity,
    level: info.level,
    userId: getUserId()
  });
}
// 修改产品数量
export function editCart(info) {
  return fetch(627621, {
    code: info.code,
    quantity: info.quantity
  });
}

// 删除购物车产品
export function deleteCart(info) {
  return fetch(627622, {
    codeList: info.codeList
  });
}
// 购物车提交订单
export function placeOrderCart(info) {
  return fetch(627901, {
    codeList: info.codeList,
    applyNote: info.applyNote || '',
    applyUser: getUserId()
  });
}

// 详情查订单
export function orderDetail(info) {
  return fetch(627917, {
    code: info.code
  });
}

// 详情查授权单
export function shouquandanDetail(info) {
  return fetch(627287, {
    userId: info.userId
  });
}

// 详情查产品
export function getProductDetail(code) {
  return fetch(627557, {
    code: code
  });
}
// 发货
export function fahuo(info) {
  return fetch(627645, {
    code: info.code,
    deliver: getUserId(),
    logisticsCode: info.logisticsCode,
    logisticsCompany: info.logisticsCompany
  });
}

// 分页查意向代理
export function getYixiang(info) {
  return fetch(627265, {
    start: 1,
    limit: 100,
    toUserId: info.toUserId || '',
    approver: info.approver || '',
    status: info.status || ''
  });
}

// 详情查意向代理
export function getYixiangDetail(userId) {
  return fetch(627267, {
    userId
  });
}

// 支付出货订单
export function payOutOrder(info) {
  return fetch(627642, {
    codeList: info.codeList,
    payType: info.payType
  });
}
