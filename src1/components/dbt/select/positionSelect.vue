<template>
  <div class="positionWrap">
    <div @click="showChange">{{selectNow}}</div>
    <div class="list" v-if="showList">
      <div class="title"></div>
      <div class="listBox">
        <div
          class="item"
          @click="itemSelect(item)"
          v-for="(item,index) in list"
          :key="index"
        >{{item.positionName}}</div>
        <div class="bottom"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    positionName: String
  },
  data () {
    return {
      showList: false,
      list: [
        { positionName: '所有职称' },
        { positionName: '主任医师' },
        { positionName: '副主任医师' },
        { positionName: '主治医师' },
        { positionName: '住院医师' }
      ],
      selectNow: '所有职称'
    }
  },
  watch: {
    positionName () {
      console.log(this.positionName)
      this.selectNow = this.positionName
    }
  },
  mounted () {
    if (!this.positionName) {
      this.selectNow = '所有职称'
    } else {
      this.selectNow = this.positionName
    }
  },
  methods: {
    itemSelect (item) {
      this.selectNow = item.positionName
      this.showList = false
      this.$emit('close', item.positionName)
    },
    showChange () {
      this.showList = !this.showList
    }
  }
}
</script>

<style lang="less" scoped>
.positionWrap {
  height: 0.4rem;
  line-height: 0.4rem;
  width: 100%;
  text-align: center;
  .list {
    width: 1.6rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    top: 0.55rem;
    background: #fff;
    position: absolute;
    z-index: 50;
    border-radius: 6px;
    .title {
      height: 0.24rem;
      width: 1.6rem;
      top: -0.14rem;
      background: url("src1/assets/iconD/top.png") no-repeat center;
      background-size: 1.6rem 0.24rem;
      position: absolute;
    }
    .listBox {
      position: absolute;
      top: 0.08rem;
      width: 1.6rem;
      background: url("src1/assets/iconD/middle.png") repeat-y center;
      background-size: 1.6rem 0.24rem;
      .item {
        height: 0.4rem;
        line-height: 0.4rem;
      }
    }
    .bottom {
      height: 0.2rem;
      width: 1.6rem;
      bottom: -0.2rem;
      background: url("src1/assets/iconD/bottom.png") no-repeat center;
      background-size: 1.6rem 0.24rem;
      position: absolute;
    }
  }
}
.positionWrap::after {
  position: absolute;
  right: 22%;
  top: 40%;
  display: block;
  position: absolute;
  content: "";
  width: 0.1rem;
  height: 0.07rem;
  background: url("http://studioimage.yxj.org.cn/1542618784855.png") no-repeat
    center;
  background-size: 0.1rem 0.07rem;
}
</style>
