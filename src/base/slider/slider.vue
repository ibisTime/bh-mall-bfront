<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots" v-if="showDots">
      <span class="dot" v-for="(item, index) in dots" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {addClass} from 'common/js/dom';

  export default {
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      };
    },
    props: {
      loop: {
        type: Boolean,
        default: false
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      },
      showDots: {
        type: Boolean,
        default: true
      },
      click: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
      this.update();
      window.addEventListener('resize', () => {
        if (!this.slider || !this.slider.enabled) {
          return;
        }
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          if (this.slider.isInTransition) {
            this._onScrollEnd();
          } else {
            if (this.autoPlay) {
              this._play();
            }
          }
          this.refresh();
        }, 60);
      });
    },
    methods: {
      update() {
        if (this.slider) {
          this.slider.destroy();
        }
        this.$nextTick(() => {
          this.init();
        });
      },
      refresh() {
        this._setSliderWidth(true);
        this.slider.refresh();
      },
      next() {
        this.slider.next();
      },
      init() {
        clearTimeout(this.timer);
        this.currentPageIndex = 0;
        this._setSliderWidth();
        if (this.showDots) {
          this._initDots();
        }
        this._initSlider();
        if (this.autoPlay) {
          this._play();
        }
      },
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children;

        let width = 0;
        let sliderWidth = this.$refs.slider.clientWidth;
        for(let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slider-item');

          child.style.width = sliderWidth + 'px';
          width += sliderWidth;
        }

        if(this.loop && !isResize) {
          width += 2 * sliderWidth;
        }
        this.$refs.sliderGroup.style.width = width + 'px';
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          },
          bounce: false,
          click: this.click
        });
        this.slider.on('scrollEnd', this._onScrollEnd);

        this.slider.on('touchend', () => {
          if (this.autoPlay) {
            this._play();
          }
        });

        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer);
          }
        });
      },
      _onScrollEnd() {
        let pageIndex = this.slider.getCurrentPage().pageX;
        this.currentPageIndex = pageIndex;
        if(this.autoPlay) {
          this._play();
        }
      },
      _initDots() {
        this.dots = new Array(this.children.length);
      },
      _play() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.slider.next();
        }, this.interval);
      }
    },
    beforeDestroy() {
      this.slider.disable();
      clearTimeout(this.timer);
    },
    deactivated() {
      this.slider.disable();
      clearTimeout(this.timer);
    },
    activated() {
      if (!this.slider) {
        return;
      }
      this.slider.enable();
      let pageIndex = this.slider.getCurrentPage().pageX;
      this.slider.goToPage(pageIndex, 0, 0);
      this.currentPageIndex = pageIndex;
      if (this.autoPlay) {
        this._play();
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "~common/scss/variable";

  .slider {
    position: relative;
    width: 100%;
    min-height: 1px;

    .slider-group {
      position: relative;
      height: 100%;
      overflow: hidden;
      white-space: nowrap;

      .slider-item {
        float: left;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;

        a {
          display: block;
          width: 100%;
          overflow: hidden;
          text-decoration: none;
        }
        img {
          display: block;
          width: 100%;
        }
      }
    }

    .dots {
      position: absolute;
      right: 0;
      left: 0;
      bottom: 0.2rem;
      text-align: center;
      font-size: 0;

      .dot {
        display: inline-block;
        margin: 0 0.08rem;
        width: 0.16rem;
        height: 0.16rem;
        border-radius: 50%;
        background: rgba(255,255,255,0.6);

        &.active {
          background: rgb(255,255,255);
          /*<!--background: $primary-color;-->*/
        }
      }
    }
  }
</style>
