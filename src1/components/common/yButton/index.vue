<template>
  <button :class="classes" :disabled="disabled" @click="handleClick">
    <slot></slot>
  </button>
</template>
<script>
/**
 * x-Button
 * @desc 按钮
 * @param type [相当于class]
 * @param disabled [是否禁用]
 *
 * @example
 * <m-button type="shop_footer_btn" :disabled="goodResult.length === 0" @handleClick="getGoodsSelected"><slot>确认兑换</slot></m-button>
 */
const prefixCls = 'y-button'

export default {
  props: {
    type: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes () {
      return [`${prefixCls}`, `${prefixCls}-${this.type}`]
    }
  },
  methods: {
    handleClick () {
      this.$emit('handleClick')
    }
  }
}
</script>
<style lang="less" scoped>
.y-button {
  padding: 0 2%;
  height: 0.28rem;
  width: 0.51rem;
  line-height: 0.28rem;
  font-size: 0.14rem;
  border: none;
  border-radius: 0.1rem;
  text-align: center;
  display: inline-block;
  // background: -webkit-linear-gradient(left, #63c1fe, #0181d4);
  color: #fff;
  position: relative;
  user-select: none;
  outline: 0;
  &[disabled] {
    color: #fff;
    background: #ccc;
    border: 0;
  }
}
</style>
