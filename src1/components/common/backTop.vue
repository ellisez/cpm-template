<template>
<transition name='slide-fade'>
    <div class='page-component-up' v-show='isShow' @click='getTop'>
  </div>
</transition>
</template>
<script>
export default {
  name: 'BackTop',
  props: {
    scrollmyself: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShow: false,
      timeOut: null,
      timer: null
    }
  },
  methods: {
    showIcon () {
      let curHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (curHeight > 100) {
        this.isShow = true
        var _this = this
        clearTimeout(_this.timeOut)
        _this.timeOut = setTimeout(() => {
          _this.isShow = false
        }, 3000)
      } else {
        this.isShow = false
      }
    },
    getTop () {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      window.pageYOffset = 0
    }
  },
  mounted () {
    this.$nextTick(function () {
      window.addEventListener('scroll', this.showIcon)
    })
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.showIcon)
  },
  destroyed () {
    let _this = this
    clearTimeout(_this.timeOut)
    clearInterval(_this.timer)
  }
}
</script>

<style lang="less" scoped>
  .slide-fade-enter-active {
     transition: all .1s ease;
  }
  .slide-fade-leave-active {
    transition: all .1s cubic-bezier(1.0, 0.3, 0.8, 1.0);
    opacity: 0;
  }
  .slide-fade-enter, .slide-fade-leave-to
   /* .slide-fade-leave-active 在低于 2.1.8 版本中 */ {
  // transform: translateY(-20px);
    opacity: 0;
  }
  .page-component-up {
    position: fixed;
    right: 6%;
    bottom: 0.8rem;
    width: 0.2rem;
    height: 0.23rem;
    transition: .3s;
    background: url('src1/assets/icons/toTop.png') no-repeat center center;
    background-size: 0.2rem 0.23rem;
    z-index: 999;
  }
</style>
