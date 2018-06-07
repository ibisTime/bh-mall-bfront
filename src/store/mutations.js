import * as types from './mutation-types';

const mutations = {
  [types.SET_USER](state, user) {
    state.user = user;
  },
  [types.SET_USER_MOBILE](state, mobile) {
    let user = state.user || {};
    user.mobile = mobile;
    state.user = user;
  },
  [types.SET_USER_NICKNAME](state, nickname) {
    let user = state.user || {};
    user.nickname = nickname;
    state.user = user;
  },
  [types.SET_USER_AVATAR](state, photo) {
    let user = state.user || {};
    user.photo = photo;
    state.user = user;
  },
  [types.SET_USER_REALNAME](state, { realName, idNo }) {
    let user = state.user || {};
    user.realName = realName;
    user.idNo = idNo;
    state.user = user;
  },
  [types.SET_ACCOUNT_MONEY](state, money) {
    let account = state.account || {};
    account.money = money;
    state.account = account;
  },
  [types.CHANGE_ACCOUNT_MONEY](state, money) {
    let account = state.account || {};
    account.money -= money * 1000;
    state.account = account;
  },
  [types.SET_MY_PRODUCT](state, myProduct) {
    debugger;
    state.myProduct = myProduct;
  },
};

export default mutations;
