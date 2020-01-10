<template>
  <div class="h-model" v-show="showModel">
    <slot></slot>
    <div class="h-model_mask" @click.stop="hideDialog"></div>
  </div>
</template>
<script>
export default {
  props: {
    showModel: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hideDialog () {
      this.$emit('hideDialog')
    }
  }
}
</script>
<style lang="less" scoped>
.h-model {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  font-size: 16px;
  z-index: 333;
  height: 100%;
  .h-model_wrapper {
    z-index: 8888;
    position: absolute;
    color: #9f5330;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    left: 50%;
  }
  &_mask {
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.4);
    right: 0;
    bottom: 0;
    z-index: 666;
  }
}

.popup-box_close {
  font-size: 22px;
  color: #333;
  position: fixed;
  left: 50%;
  transform: translate(-50%, 150%);
  width: 27px;
  height: 27px;
  //   background: url("@{img}/moon_close.png") no-repeat;
  background-size: contain;
}
.icon {
  margin: 0;
}

.icon.icon-x {
  width: 0.16rem;
  height: 0.5rem;
  //   background: url("@{img}/icon_xm_close.png") no-repeat center center;
  background-size: contain;
}
</style>
