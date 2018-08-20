import {USER_KIND} from './config';
import fetch from 'common/js/fetch';
import {getUserId} from 'common/js/util';

/**
 * 用户手机号注册
 * @param mobile
 * @param smsCaptcha
 * @param loginPwd
 * @param userReferee
 */
export function register(mobile, smsCaptcha, loginPwd, userReferee) {
  return fetch(805041, {
    kind: USER_KIND,
    mobile,
    smsCaptcha,
    loginPwd,
    userReferee: userReferee,
    userRefereeKind: 'B'
  });
}

/**
 * 用户名密码登录
 * @param {string} loginName
 * @param {string} loginPwd
 */
export function login(loginName, loginPwd) {
  return fetch(805050, {
    kind: USER_KIND,
    loginName,
    loginPwd
  });
}

/**
 * 获取用户详情
 */
export function getUser() {
  return fetch(627327, {
    userId: getUserId()
  });
}

export function getUser1(userId) {
  return fetch(627327, {
    userId: userId
  });
}

/**
 * 获取用户详情
 * @param {string} userId
 */
export function getUserById(userId) {
  return fetch(627327, { userId });
}

/**
 * 分页获取用户
 * @param {string} start
 * @param {string} limit
 */
export function getPageChildren(start, limit) {
  return fetch(805120, {
    userReferee: getUserId(),
    start,
    limit
  });
}

/**
 * 绑定手机号
 * @param {string} mobile
 * @param {string} smsCaptcha
 * @param {string} isSendSms
 */
export function bindMobile(mobile, smsCaptcha, isSendSms = '0') {
  return fetch(805060, {
    mobile,
    smsCaptcha,
    isSendSms,
    userId: getUserId()
  });
}
// 修改手机号旧手机验证码校验
export function changeMobCaptValid (mobile, captcha, bizType) {
  return fetch(804082, {
    mobile,
    captcha,
    bizType
  });
}
/**
 * 修改手机号
 * @param {string} newMobile
 * @param {string} smsCaptcha
 */
export function changeMobile(newMobile, smsCaptcha) {
  return fetch(805061, {
    newMobile,
    smsCaptcha,
    userId: getUserId()
  });
}

/**
 * 修改登录密码
 * @param {string} oldLoginPwd
 * @param {string} newLoginPwd
 */
export function changePwd(oldLoginPwd, newLoginPwd) {
  return fetch(805064, {
    oldLoginPwd,
    newLoginPwd,
    userId: getUserId()
  });
}

/**
 * 设置支付密码
 * @param {string} tradePwd
 * @param {string} smsCaptcha
 */
export function setTradePwd(tradePwd, smsCaptcha) {
  return fetch(805066, {
    tradePwd,
    smsCaptcha,
    userId: getUserId()
  });
}

/**
 * 重置登录密码
 * @param {string} mobile
 * @param {string} smsCaptcha
 * @param {string} newLoginPwd
 */
export function resetPwd(mobile, smsCaptcha, newLoginPwd) {
  return fetch(805063, {
    kind: USER_KIND,
    mobile,
    smsCaptcha,
    newLoginPwd
  });
}

/**
 * 修改昵称
 * @param {string} nickname
 */
export function changeNickname(nickname) {
  return fetch(805082, {
    nickname,
    userId: getUserId()
  });
}

/**
 * 修改用户头像
 * @param {string} photo
 */
export function changeAvatar(photo) {
  return fetch(805080, {
    photo,
    userId: getUserId()
  });
}

/**
 * 实名认证
 * @param {string} realName
 * @param {string} idNo
 */
export function certification (realName, idNo) {
  return fetch(805190, {
    realName,
    idNo,
    idKind: 1,
    userId: getUserId()
  });
}

/**
 * 保存登录日志
 */
export function saveLoginLog () {
  return fetch(805350, {
    userId: getUserId()
  });
}

/** 修改模板名称
 * @param code
 * @param name
 * @param updater
 */
export function changeTempletName(code, name) {
  return fetch(805234, {
    code: code,
    name: name,
    updater: getUserId()
  });
}

/** 获取操作指南 */
export function operationHelp() {
  return fetch(805917, {
    ckey: 'supportCenter'
  });
}

/** 根据手机号获取用户
 * @param mobile
 */
export function getUserByMobile(mobile) {
  return fetch(627322, { mobile });
}
