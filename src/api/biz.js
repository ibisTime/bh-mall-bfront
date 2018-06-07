import fetch from 'common/js/fetch';
import {getUserId} from 'common/js/util';

/**
 * 分页查询模板
 * @param {string} limit
 * @param {string} start
 */
export function queryTemplet(start = 1, limit = 10) {
  return fetch(805235, {
    limit,
    start,
    userId: getUserId()
  });
}

/**
 * 详情查询模板
 * @param {string} code
 */
export function queryTempletDetail(code) {
  return fetch(805236, { code });
}

/**
 * 新增模板
 * @param {string} isDefault
 * @param {string} name
 * @param {string} portList
 */
export function addTemplet(isDefault, name, portList) {
  return fetch(805230, {
    isDefault,
    name,
    portList,
    userId: getUserId(),
    updater: getUserId()
  });
}

/**
 * 修改模板
 * @param {string} code
 * @param {string} name
 * @param {string} portList
 * @param {string} updater
 */
export function editTemplet(code, name, portList) {
  return fetch(805232, {
    code,
    name,
    portList,
    updater: getUserId()
  });
}

/**
 * 设置默认模板
 * @param {string} code
 * @param {string} updater
 */
export function editIsDefault(code) {
  return fetch(805233, {
    code,
    updater: getUserId()
  });
}

/**
 * 删除模版
 * @param templetCode
 */
export function delTemplet(code) {
  return fetch(805231, { code });
}

/**
 * 详情查询接口
 * @param {string} code
 */
export function queryInterface(code) {
  return fetch(805226, { code });
}

/***
 * 分页查接口
 * @param name
 */
export function getInterface() {
  return fetch(805225, {
    start: 1,
    limit: 100
  });
}

/**
 * 发送客户
 * @param {string} captcha
 * @param {string} mobile
 * @param {string} modelCode
 */
export function sendToClient(captcha, mobile, modelCode) {
  return fetch(805250, {
    captcha,
    mobile,
    modelCode,
    salesUser: getUserId()
  });
}

/**
 * 查询默认模板
 */
export function queryMoren() {
  return fetch(805237, {
    userId: getUserId()
  });
}

/**
 * 分页查询客户
 * @param {string} start
 * @param {string} limit
 */
export function getPageCustomers(start, limit) {
  return fetch(805350, {
    start,
    limit,
    salesUser: getUserId()
  });
}

/**
 * 详情查询报告单
 * @param {string} reportCode
 */
export function getReport(reportCode) {
  return fetch(805331, { reportCode });
}

/**
 * 转发报告
 * @param {string} mobile
 * @param {string} password
 * @param {string} reportCode
 */
export function transmitReport(mobile, password, reportCode) {
  return fetch(805300, {
    mobile,
    password,
    reportCode
  });
}

/**
 * 给报告添加备注
 * @param remark
 * @param reportCode
 */
export function addRemark (remark, reportCode) {
  return fetch(805301, {
    remark,
    reportCode,
    creater: getUserId()
  });
}

/**
 * 获取充值订单
 */
export function getOrders (accountNumber, start, limit, status) {
  return fetch(802705, {
    start: start,
    limit: limit,
    payAccountNumber: accountNumber,
    status: status
  });
}

/**
 * 获取我的充值订单
 */
export function getOrders1 (accountNumber, start, limit, status) {
  return fetch(802705, {
    start: start,
    limit: limit,
    accountNumber: accountNumber,
    status: status
  });
}
/**
 * 获取账单详情
 * @param code
 */
export function getOrderDetail (code) {
  return fetch(802706, {
    code: code
  });
}
/**
 * 审核账单
 * @param codeList
 * @param payResult
 * @param payNote
 */
export function check (codeList, payResult, payNote) {
  return fetch(802701, {
    codeList: codeList,
    payUser: getUserId(),
    payResult: payResult,
    payNote: payNote
  });
}
