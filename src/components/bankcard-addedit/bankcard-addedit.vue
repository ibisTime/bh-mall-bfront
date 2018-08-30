<template>
  <transition name="slide">
    <div class="bankcard-edit-wrapper">
      <div class="form-wrapper">
        <div class="form-item border-bottom-1px">
          <div class="item-label">真实姓名</div>
          <div class="item-input-wrapper">
            <input type="text" class="item-input" v-model="realName" v-validate="'required'" name="realName" placeholder="请输入真实姓名">
            <span v-show="errors.has('realName')" class="error-tip">{{errors.first('realName')}}</span>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-label">开户银行</div>
          <div class="item-input-wrapper">
            <select class="item-input" v-model="bankName" name="bankName" v-validate="'required'">
              <option v-for="(bankcode,index) in bankcodeList" :key="index" :value="bankcode">
                {{bankcode.bankName}}
              </option>
            </select>
            <i class="arrow"></i>
            <span v-show="errors.has('bankName')" class="error-tip">{{errors.first('bankName')}}</span>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-label">开户支行</div>
          <div class="item-input-wrapper">
            <input type="text" class="item-input" v-model="subbranch" name="subbranch" v-validate="'required'" placeholder="请输入开户支行">
            <span v-show="errors.has('subbranch')" class="error-tip">{{errors.first('subbranch')}}</span>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-label">银行卡号</div>
          <div class="item-input-wrapper">
            <input type="text" class="item-input" v-model="bankcardNumber" name="bankCardNumber" v-validate="'required|bankcardNum'" placeholder="请输入银行卡号">
            <span v-show="errors.has('bankCardNumber')" class="error-tip">{{errors.first('bankCardNumber')}}</span>
          </div>
        </div>
        <div class="form-item">
          <div class="item-label">手机号</div>
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" v-model="bindMobile" name="mobile" v-validate="'required|mobile'" placeholder="请输入预留手机号">
            <span v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</span>
          </div>
        </div>

        <div class="buttons">
          <button :disabled="setting" @click="saveBankCard" class="btn">保存</button>
        </div>
        <full-loading v-show="showLoading()"></full-loading>
        <toast ref="toast" :text="text"></toast>
      </div>
    </div>
  </transition>
</template>
<script>
  import {SET_BANKCARD_LIST} from 'store/mutation-types';
  import {getBankCardList, getBankCodeList, addBankCard, editBankCard} from 'api/account';
  import FullLoading from 'base/full-loading/full-loading';
  import Toast from 'base/toast/toast';

  export default {
    data() {
      return {
        bankcodeList: [],
        setting: false,
        realName: '',
        bankName: '',
        subbranch: '',
        bankcardNumber: '',
        bindMobile: '',
        text: '新增成功'
      };
    },
    created() {
      if (this.$route.params.id) {
        Promise.all([
          this._getBankCardList(),
          this._getBankCodeList()
        ]).then(([bankCard, bankCode]) => {
          this._initPageData(bankCard, bankCode);
        }).catch(() => {});
      } else {
        Promise.all([
          this._getBankCardList(),
          this._getBankCodeList()
        ]).then(() => {}).catch(() => {});
      }
    },
    methods: {
      // 获取银行数据字典列表
      _getBankCodeList() {
        return getBankCodeList().then((data) => {
          this.bankcodeList = data;
          this.bankName = data[0];
          return data;
        });
      },
      _getBankCardList() {
        if (!this.bankcardList) {
          return getBankCardList().then((data) => {
            this.setBankCardList(data);
            return this._judgeBankCode(data);
          });
        } else {
          return this._judgeBankCode(this.bankcardList);
        }
      },
      _judgeBankCode(data) {
        if (this.$route.params.id) {
          let index = data.findIndex((item) => {
            return item.code === this.$route.params.id;
          });
          if (!~index) {
            this.text = '银行卡编号错误';
            setTimeout(() => {
              this.$refs.toast.show();
            }, 20);
            return Promise.reject('银行卡编号错误');
          }
          return Promise.resolve(data[index]);
        } else {
          return Promise.resolve(data);
        }
      },
      _initPageData(bankCard, bankCode) {
        setTimeout(() => {
          let index = bankCode.findIndex((item) => {
            return item.bankCode === bankCard.bankCode;
          });
          this.bankName = bankCode[index];
          this.realName = bankCard.realName;
          this.subbranch = bankCard.subbranch;
          this.bankcardNumber = bankCard.bankcardNumber;
          this.bindMobile = bankCard.bindMobile;
        }, 100);
      },
      showLoading() {
        if (!this.$route.params.id) {   // 新增
          return !this.bankcodeList.length;
        } else {   // 修改
          return !this.bankcodeList.length || !this.bankName;
        }
      },
      saveBankCard() {
        this.$validator.validateAll().then((result) => {
          if(result) {
            let param = {
              bankcardNumber: this.bankcardNumber,
              bankCode: this.bankName.bankCode,
              bankName: this.bankName.bankName,
              subbranch: this.subbranch,
              bindMobile: this.bindMobile,
              realName: this.realName
            };
            if (this.$route.params.id) {
              param.code = this.$route.params.id;
              this._editBankCard(param);
            } else {
              this._addBankCard(param);
            }
          }
        })

      },
      _addBankCard(param) {
        addBankCard(param).then((code) => {
          this.setting = false;
          this.text = '新增成功';
          this.$refs.toast.show();
          if (this.bankcardList) {
            param.code = code;
            this.addBankCard({
              bankcard: param
            });
          }
          setTimeout(() => {
            this.$router.back();
          }, 1000);
        }).catch(() => {
          this.setting = false;
        });
      },
      _editBankCard(param) {
        editBankCard(param).then(() => {
          this.setting = false;
          this.text = '修改成功';
          this.$refs.toast.show();
          this.editBankCard({
            bankcard: param
          });
          setTimeout(() => {
            this.$router.back();
          }, 1000);
        }).catch(() => {
          this.setting = false;
        });
      },
      // _valid() {
      //   let r1 = this._realNameValid();
      //   let r2 = this._bankNameValid();
      //   let r3 = this._subbranchValid();
      //   let r4 = this._bankcardNumberValid();
      //   let r5 = this._mobileValid();
      //   return r1 && r2 && r3 && r4 && r5;
      // },
      _realNameValid() {
        let result = realNameValid(this.realName);
        this.realErr = result.msg;
        return !result.err;
      },
      _bankNameValid() {
        let result = bankNameValid(this.bankName.bankName);
        this.bankErr = result.msg;
        return !result.err;
      },
      _subbranchValid() {
        let result = subbranchValid(this.subbranch);
        this.subErr = result.msg;
        return !result.err;
      },
      _bankcardNumberValid() {
        let result = bankcardNumberValid(this.bankcardNumber);
        this.cardErr = result.msg;
        return !result.err;
      },
      _mobileValid() {
        let result = mobileValid(this.bindMobile);
        this.mobErr = result.msg;
        return !result.err;
      }
      // ...mapMutations({
      //   setBankCardList: SET_BANKCARD_LIST
      // }),
      // ...mapActions([
      //   'addBankCard',
      //   'editBankCard'
      // ])
    },
    components: {
      FullLoading,
      Toast
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .bankcard-edit-wrapper {
    padding:0.3rem;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-background;
    font-size: $font-size-large-xxx;

    .arrow {
      position: absolute;
      right: 0.24rem;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      @include bg-image('arrow');
      width: 0.3rem;
      height: 0.3rem;
      top: 50%;
      transform: translate(0, -50%);
    }
  }
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .btn {
    display: block;
    width: 90%;
    line-height: 0.9rem;
    margin: 4rem auto;
    background-color: $primary-color;
    color: #fff;
    text-align: center;
    border-radius: 0.1rem;
  }
  .error-tip {
    position: absolute;
    right: 0.16rem;
    top: 0.38rem;
    white-space: nowrap;
    font-size: $font-size-medium;
    color: #ff0000;
  }
  .item-input-wrapper {
      position: relative;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      height: 1rem;
      padding: 0 0.16rem;
      padding-left: 0.2rem;
      min-width: 2.56rem;

      .item-input {
        padding: 0.12rem 0;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        line-height: 1.2;
        background: transparent;
      }

      .hide-area {
        position: absolute;
        visibility: hidden;
      }

      textarea {
        width: 100%;
        background: transparent;
      }

      .error-tip {
        position: absolute;
        right: 0.16rem;
        top: 0.38rem;
        white-space: nowrap;
        font-size: $font-size-medium;
        color: #ff0000;
      }
    }
    .form-wrapper {
  .form-item {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    font-size: $font-size-medium-x;
    background-color: #fff;

    &.border-bottom-1px {
      @include border-bottom-1px($color-border);
    }

    &:last-child {
      @include border-none();
    }

    &.is-textarea {
      .item-input-wrapper {
        padding: 0.1rem 0.2rem;
      }
    }

    .item-label {
      width: 2rem;
      -webkit-box-flex: 0;
      -ms-flex: 0 0 2rem;
      flex: 0 0 2rem;
      text-align: left;
      padding-left: 0.3rem;
    }

    .inner-label {
      padding: 0 0.16rem;
      height: 1rem;
      line-height: 1rem;
    }

    .item-input-wrapper {
      position: relative;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      height: 1rem;
      padding: 0 0.16rem;
      padding-left: 0.2rem;
      min-width: 2.56rem;

      .item-input {
        padding: 0.12rem 0;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        line-height: 1.2;
        background: transparent;
      }

      .hide-area {
        position: absolute;
        visibility: hidden;
      }

      textarea {
        width: 100%;
        background: transparent;
      }

      .error-tip {
        position: absolute;
        right: 0.16rem;
        top: 0.38rem;
        white-space: nowrap;
        font-size: $font-size-medium;
        color: #ff0000;
      }
    }
    .item-btn {
      padding-left: 0.3rem;
      width: 2.1rem;
      padding-right: 0.3rem;
      @include border-left-1px($color-border);

      &::after {
        height: 1em;
        bottom: 50%;
        transform: translate(0, 50%);
      }

      button {
        width: 100%;
        height: 0.6rem;
        line-height: 0.6rem;
        white-space: nowrap;
        border-radius: 0.1rem;
        font-size: $font-size-medium-s;
        background: transparent;
        color: $primary-color;

        &[disabled] {
          color: $color-disable-background;
        }
      }
    }
  }

  select {
    font-size: $font-size-medium-x;
  }

  .form-btn {
    margin-top: 0.8rem;
    padding: 0 0.3rem;
    width: 100%;

    button {
      display: block;
      width: 100%;
      line-height: 0.9rem;
      border-radius: 0.1rem;
      font-size: $font-size-large-s;
      background: $primary-color;
      color: #fff;

      &[disabled] {
        background: $color-disable-background;
      }
    }
  }
}
</style>
