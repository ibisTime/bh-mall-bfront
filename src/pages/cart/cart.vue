<template>
  <div class="all">
    <div class="cart-list">
      <div class="no-cart-wrapper" v-if="!list.length">
        <img class="cart-img" src="../../assets/imgs/cart@2x.png">
        <p class='cart-tip'>购物车空空如也，赶紧去逛逛吧!</p>
        <div class='no-btn' @click="$router.push('/buyCloud')">去逛逛</div>
      </div>
      <div class="cart-item" v-for="item in list" v-if="list.length">
        <div class="chose-item" @click="choseItem(item.code)">
          <div :class="['chose', item.checked ? 'act' : '']"></div>
        </div>
        <div class='img-item'><img class="p-img" :src="formatImg(item.product.advPic)"></div>
        <div class="info-item">
          <div class="title">{{item.product.name}}</div>
          <div class="title">规格：{{item.specsName}}</div>
          <div class="btm-info">
            <p class="price">¥{{formatAmount(item.price)}}</p>
            <p class="diamonds decrease" @click="decrease(item.code)">-</p>
            <input
              class="num"
              type="number"
              v-model="item.quantity"
              :key = item.code
              @change="inputChange(item.quantity, item.code)"
            />
            <p class="diamonds" @click="add(item.code)">+</p>
            <div class="delete-item" @click="deleteItem(item.code)"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="cart-footer">
      <div class="cart-inner-footer" v-if="list.length">
        <div class="left-item clearfix">
          <div class='chose-item' @click="choseAll">
            <div :class="['chose', isCheckAll ? 'act' : '']"></div>
            <p>全选</p>
          </div>
          <div class="price-item">合计：<p class="price">¥{{formatAmount(totalAmount)}}</p></div>
        </div>
        <div class="right-item" @click="buy">购买</div>
      </div>
    </div>
    <full-loading :title="title" v-show="loading"></full-loading>
    <confirm ref="confirm" :text="confirmText" @confirm="_deleteCart"></confirm>
    <toast ref="toast" :text="text"></toast>
  </div>
</template>
<script>
import { getCartList, editCart, deleteCart, placeOrderCart } from 'api/baohuo'
import { setCookie, getCookie } from 'common/js/cookie';
import { formatDate, formatAmount, formatImg } from 'common/js/util';
import { getUser, getUserById } from 'api/user';
import FullLoading from 'base/full-loading/full-loading';
import Confirm from 'base/confirm/confirm';
import Toast from 'base/toast/toast';

export default {
  name: 'subAgent',
  data() {
      return{
        loading: true,
        title: '正在载入...',
        confirmText: '确定删除吗',
        text: '',
        totalAmount: 0,
        isCheckAll: false,
        list: [],
        start: 1,
        limit: 20,
        hasMore: true,
        scrollHeight: 100
      }
  },
  methods: {
    // 金额转换
    formatAmount(amount) {
      return formatAmount(amount);
    },
    // 图片格式转换
    formatImg(img) {
      return formatImg(img);
    },
    // 获取购物车列表
    getPageCart() {
      getCartList().then((data) => {
        this.loading = false;
        this.list = data.list;
      });
    },
    // 数量修改
    inputChange(quantity, code) {
      console.log(quantity);
      quantity = Math.max(quantity, 1);
      let index = this.list.findIndex(d => d.code === code);
      let item = this.list[index];
      this.editQuantity(code, quantity, item, index);
    },
    // 数量增加
    add(code) {
      let index = this.list.findIndex(d => d.code === code);
      let item = this.list[index];
      let quantity = item.quantity + 1;
      this.editQuantity(code, quantity, item, index);
    },
    // 数量减少
    decrease(code) {
      let index = this.list.findIndex(d => d.code === code);
      let item = this.list[index];
      let quantity = item.quantity - 1;
      if (quantity >= 1) {
        this.editQuantity(code, quantity, item, index);
      }
    },
    // 设置最新的总价
    editQuantity(code, quantity, item, index) {
      this.loading = true;
      editCart({
        code: code,
        quantity: quantity
      }).then((res) => {
        this.loading = false;
        let list = this.list;
        item.quantity = quantity;
        list.splice(index, 1, item);
        this.list = list;
        let amount = 0;
        let flag = true;
        this.list.forEach(d => {
          console.log(d);
          if (!d.checked) {
            flag = false;
            return;
          }
          amount += d.price * d.quantity;
        });
        this.totalAmount = amount;
      }).catch(() => { this.loading = false; })
    },
    // 选择商品
    choseItem(code) {
      let index = this.list.findIndex(d => d.code === code);
      let item = this.list[index];
      item.checked = !item.checked;
      let list = this.list;
      list.splice(index, 1, item);
      this.list = list;
      this.checkAll();
    },
    // 判断是否需要勾选全选按钮
    checkAll() {
      let flag = true;
      let amount = 0;
      this.list.forEach(d => {
        if (!d.checked) {
          flag = false;
          return;
        }
        amount += d.price * d.quantity;
      });
      this.isCheckAll = flag;
      this.totalAmount = amount;
    },
    // 全选
    choseAll() {
      let flag = true;
      if (this.isCheckAll) {
        flag = false;
      }
      let list = this.list;
      let amount = 0;
      list.forEach(v => {
        v.checked = flag;
        amount += v.price * v.quantity;
      });
      this.list = list;
      this.isCheckAll = flag;
      this.totalAmount = amount;
    },
    // 删除商品
    deleteItem(code) {
      this.$refs.confirm.show();
      this.delCurCode = code;
    },
    _deleteCart() {
      let code = this.delCurCode;
      let index = this.list.findIndex(d => d.code === code);
      let item = this.list[index];
      this.loading = true;
      let codeList = [];
      codeList.push(code);
      deleteCart({
        codeList: codeList
      }).then(() => {
        this.loading = false;
        let amount = this.totalAmount;
        amount -= item.price * item.quantity;
        let list = this.list;
        list.splice(index, 1);
        this.list = list;
        this.totalAmount = amount;
        this.editQuantity();
      })
    },
    // 购买商品
    buy() {
      let price;
      let list = [];
      this.list.forEach(p => {
        if (p.checked) {
          list.push(p.code);
        }
      });
      if (list.length) {
        placeOrderCart({
          codeList: list
        }).then(res => {
          this.text = "提交成功";
          this.$refs.toast.show();
          this.orderCode = res;
          this.$router.push(
            "/cart/balance?orderCode=" +
            this.orderCode
            // "&number=" +
            // ref.number +
            // "&highUserId=" +
            // ref.options.highUserId +
            // "&orderCode=" +
            // this.orderCode +
            // "&specsCode=" +
            // this.options.specsCode
          );
        });
      } else {
        showWarn('您未选择要购买的商品');
      }
    }
  },
  mounted(){
    // this.getHeight();
    this.getPageCart();
  },
  computed:{
      proList:function(){

          //格式化时间
          this.list.map(function(item) {
              item.approveDatetime = formatDate(item.approveDatetime)
          })

          //数字等级转化文字等级
          this.list.map(function(item) {
              item.level = getLevel(item.level).then(res => {
                  item.level = res[0].name
              })
          })
      },
  },
  components: {
    FullLoading,
    Confirm,
    Toast
  }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';
@import '../../common/scss/base.scss';
.no-cart-wrapper {
  text-align: center;
  padding-top: 180px;
}
.no-cart-wrapper .cart-img {
  width: 1.64rem;
}
.no-cart-wrapper .cart-tip {
  display: block;
  margin-top: 50px;
  font-size: 0.3rem;
  color: rgb(51, 51, 51);
}
.no-cart-wrapper .no-btn {
  width: 2.4rem;
  height: 0.8rem;
  line-height: 0.8rem;
  margin: 60px auto 0;
  border-radius: 6px;
  border: 2px solid #72a52c;
  color: #72a52c;
  font-size: 0.3rem;
}
.cart-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.98rem;
  background-color: #fff;
}
.cart-inner-footer {
  display: flex;
}
.cart-footer .left-item {
  flex: 1;
}
.cart-footer .right-item {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 240px;
  flex: 0 0 2.4rem;
  line-height: 0.98rem;
  text-align: center;
  font-size: 0.34rem;
  background-color: #ffa800;
  color: #fff;
}
.cart-footer .chose-item {
  float: left;
  line-height: 0.98rem;
  padding-left: 0.3rem;
  font-size: 0.3rem;
  white-space: nowrap;
}
.cart-footer .price-item {
  float: right;
  line-height: 0.98rem;
  padding-right: 0.5rem;
  font-size: 0.3rem;
}
.price-item .price {
  color: rgb(252, 68, 24);
  display: inline;
}
.chose {
  float: left;
  width: 0.4rem;
  height: 0.4rem;
  background-size: 0.4rem;
  background-position: right center;
  background-repeat: no-repeat;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAWlBMVEUAAADMzMzNzc3MzMzOzs7MzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzNzc3MzMzMzMzMzMzMzMz////j4+PU1NT29vb19fXu7u7b29vd3d1GkSOPAAAAFnRSTlMAl+wH+vnTs6wcEzfjh1d5eO1Z5Ig4NEVNHAAAAOZJREFUOMuNlNkOgjAQRaeF1paCgMtMW/D/f1OixoCy3PN8kslsl5aEzlltjLauC7SJb+ooQ+KJNEisG7+qVaqUxDOSlKr6985a+A/R5x+tUDHzCjmqYuGdRt5gPBVz78GbPGamGnmHUX37iLxLvHzmovO+mPvqXVj4AHkV9yUfUvpJbORYlGYS63QsppooRAaIgVpBROnIDYg4OLIJEZMlzRCaDCYaWIRLg81kC48HH/gdXCF6FPCZwYeLvgL4XLpC3xUNADhS0JBCYw8L0gsczWv423Ue9tebp01C62xvTG9dG2jBEwlOalXlcMIKAAAAAElFTkSuQmCC');
}
.chose.act {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAmVBMVEUAAAD/xAH/wwD/xgv/wwD/wwD/wwD/wwD/wwD/wwD/wwD/wwD/wwD/wwD/wwD/wwD/wwD/wwD/wwD/wwD/wwD/wwD/wwD/wwD//////PL/99v/3nD/22X/zi3//vr/++z/88z/66j/9NH/yBT//ff/33b/3W3/0Db/9dT/zCX/yBb/++3/1U3/1En/66n/11f/yyT/66r/2Fh7NBtLAAAAF3RSTlMA7Zf6BvmzrDcThxxZ49PSeXhX5OKIHl5dRcUAAAFxSURBVDjLlZXZdoIwGIQDSEHAfUkkBFlkdW3f/+E6autBljT97uAMDJn8Gcg79sKaaaapzayFTQZxnbXgcXIMw2Ny4WLtuL2ysW7whDVIuKGPu7qllu9Zi32uLVuykV5FDOzioKgprYsg3jEQVfroTfdxvt/3A4O+MAL//uT5Y9TUXUPGDhltkR0YC68NpX6Czhe0g/ChPOmvddzgG9W0hzqC+837yUXDlZ/SXlIf79DGT+Mc3yfoAALfmT/Mtwbyy+ggGfI0thA6HMZUAsy5A+GkZCyQCQPGygnmRWBdhkxoIBNhkzmcYyolhveCWPHTWe4dW2SK0SrkwgIjNyUawknlwhQBacREoPQPsOEmMUM1obK18mIU47lYyoErbCF9bKH6UKiPmasyuK76UVA/XMCr5Me18v5bAKiUL3mldEuqKWuVVLf2UixhqPaA11+kXn81l01Z2V/NwN2sBL88y/6Ti9XGJYPY89/fx9wmb3wDitp3PYDsFcwAAAAASUVORK5CYII=');
}
.cart-footer .chose {
  margin-right: 0.2rem;
  margin-top: 0.29rem;
}
.cart-item {
  display: flex;
  flex-direction: row;
  padding: 0.3rem;
  background-color: #fff;
  border-bottom: 2px solid #eee;
}
.cart-list .cart-item:last-child {
  border-bottom: none;
}
.cart-item .chose-item {
  width: 0.66rem;
  height: 1.3rem;
  display: flex;
  align-items: center;
}
.cart-item .img-item {
  width: 1.6rem;
  height: 1.3rem;
}
.cart-item .img-item .p-img {
  width: 100%;
  height: 100%;
}
.info-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.16rem 0.22rem;
  padding-right: 0.04rem;
}
.info-item .title {
  line-height: 1.2;
  font-size: 0.26rem;
  color: #484848;
}
.info-item .delete-item {
  flex: 1;
  margin-left: 0.3rem;
  height: 0.4rem;
  background-size: 0.4rem;
  background-repeat: no-repeat;
  background-position: right;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAY1BMVEUAAACZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmQGJZ5AAAAIHRSTlMAKvpRMDYdCeHWYXjJPhFUF/CoVSLZ1LKLZOy7mI9rSJnPOPwAAACtSURBVDjL7dPJCsMgFIXhGzOY1Jh57Hje/ykrsYWboiCFLgr5NyeQb6VIvKYrWZeUfPXYdfXC6q54A32XTAJqDJwRUGlgFwplGlBDP2tdyZNWkt8d8DrdSO+XCjwYzAQi+3GG3raFlXJE7YIRUPMlWSB2QoH4vQc84P9AoGfrh9XUJtsWZn3QyoytB7oLhvknVG6nxe5dyxxiOTlS5kdCrAXeZuLJ25Q7G7vBiic6AyXHEvbI9AAAAABJRU5ErkJggg==');
}
.info-item .btm-info {
  display: flex;
  align-items: center;
  width: 100%;
}
.info-item .btm-info .price {
  font-size: 0.3rem;
  color: rgb(252, 68, 24);
}
.diamonds {
  width: 0.5rem;
  height: 0.5rem;
  background-color: #f5f5f5;
  font-size: 0.34rem;
  color: #888;
  text-align: center;
}
.diamonds.decrease {
  margin-left: 0.32rem;
}
.num {
  float: right;
  width: 0.9rem;
  text-align: center;
  font-size: 0.3rem;
  color: #333;
}
</style>
