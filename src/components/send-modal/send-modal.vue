<template>
  <div name="confirm-fade">
    <div class="confirm-input" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="input">
            <span>{{dText}}</span>
            <select v-model="dType">
              <option v-for="item in deliveryType" :value="item.key">{{item.value}}</option>
            </select>
            <i class="right-icon"></i>
          </div>
          <div class="input">
          	<span>{{compText}}</span>
          	<select v-model="wlCompany">
          		<option v-for="item in companyList" :value="item.dvalue">{{item.dvalue}}</option>
          	</select>
          	<i class="right-icon"></i>
          </div>
          <div class="input"><input ref="input" placeholder="请输入物流编号" type="text" v-model="wlCode" v-focus></div>
          <div class="operate">
            <div @click="cancel" class="operate-btn left">{{cancelBtnText}}</div>
            <div @click="confirm" class="operate-btn right">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getDictList } from 'api/general';

  export default {
    props: {
      text: {
        type: String,
        default: '确认发货'
      },
      confirmBtnText: {
        type: String,
        default: '发货'
      },
      cancelBtnText: {
        type: String,
        default: '取消'
      }
    },
    directives: {
      // focus: {
      //   inserted: function (el) {
      //     el.focus();
      //   }
      // }
    },
    data() {
      return {
      	companyList: [],
        deliveryType: [
          { key: '0', value: '自发'},
          { key: '1', value: '云仓发' }
        ],
        showFlag: false,
        wlCode: '',
        wlCompany: '',
        dType: ''
      };
    },
    computed: {
    	compText() {
    		return this.wlCompany ? this.companyList.find(v => v.dkey === this.wlCompany).dvalue : '请选择物流公司';
    	},
      dText() {
        return this.dType ? this.deliveryType.find(v => v.key === this.dType).value : '请选择发货方式';
      }
    },
    mounted() {
    	getDictList('kd_company').then(data => {
    		this.companyList = data;
    	});
    },
    methods: {
      show() {
        this.wlCompany = '';
        this.wlCode = '';
        this.showFlag = true;
        // setTimeout(() => {
        //   this.$refs.input.focus();
        // }, 320);
      },
      hide() {
        this.showFlag = false;
      },
      cancel() {
        this.hide();
        this.$emit('cancel');
      },
      confirm() {
        this.hide();
        this.$emit('confirm', this.wlCode, this.wlCompany, this.dType);
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .confirm-input {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 998;
    background-color: $color-background-d;

    /*&.confirm-fade-enter-active {*/
      /*animation: confirm-fadein 0.3s;*/
      /*.confirm-content {*/
        /*animation: confirm-zoom 0.3s;*/
      /*}*/
    /*}*/

    .confirm-wrapper {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
      .confirm-content {
        width: 5.4rem;
        border-radius: 0.26rem;
        background: $color-highlight-background;

        .text {
          padding: 0.38rem 0.3rem 0.2rem;
          line-height: 0.44rem;
          text-align: center;
          font-size: $font-size-large-s;
          color: $color-text-l;
        }

        .input {
          position: relative;
          margin: 0.2rem;
          margin-top: 0;
          height: 0.8rem;
          display: flex;
          align-items: center;
          line-height: 1;
          border: 1px solid $color-border;
          border-radius: 0.06rem;

          span {
          	padding: 0 0.2rem;
          	font-size: $font-size-medium;
          }

          input {
            border: 0;
            width: 100%;
            font-size: $font-size-medium;
            padding: 0 0.2rem;
          }

          select {
          	position: absolute;
          	top: 0;
          	left: 0;
          	width: 100%;
          	height: 100%;
          	opacity: 0;
          }

          .right-icon {
          	position: absolute;
          	right: 0;
          	top: 0;
          	width: 0.4rem;
          	height: 100%;
          	background-repeat: no-repeat;
	        background-position: center;
	        background-size: 0.14rem;
	        @include bg-image('more');
          }
        }

        .operate {
          display: flex;
          align-items: center;
          text-align: center;
          font-size: $font-size-large-s;

          .operate-btn {
            flex: 1;
            line-height: 0.44rem;
            padding: 0.2rem 0;
            border-top: 1px solid $color-background-d;
            color: $color-text-d;

            &.left {
              border-right: 1px solid $color-background-d;
            }

            &.right {
              color: $primary-color;
            }
          }
        }
      }
    }
  }
  /*@keyframes confirm-fadein {*/
    /*0% {*/
      /*opacity: 0;*/
    /*}*/
    /*100% {*/
      /*opacity: 1;*/
    /*}*/
  /*}*/

  /*@keyframes confirm-zoom {*/
    /*0% {*/
      /*transform: scale(0);*/
    /*}*/
    /*50% {*/
      /*transform: scale(1.1);*/
    /*}*/
    /*100% {*/
      /*transform: scale(1);*/
    /*}*/
  /*}*/
</style>
