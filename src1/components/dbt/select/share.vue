<template>
  <div class="shareWrap">
    <mt-popup
      v-model="popupVisible"
      style="height:25%;width:100%;background:rgba(0,0,0,0)"
      position="bottom"
    >
      <div class="wrapBox">
        <div class="shareBox">
          <div @click="select('4')" class="area">
            <img src="src1/assets/imagesD/area.png">
            <span>专区</span>
          </div>
          <!-- <div @click="select('2')" class="message">
          <img src="../../../assets/imagesD/message.png">
          <span>短信</span>
        </div>
        <div @click="select('3')" class="email">
          <img src="../../../assets/imagesD/email.png">
          <span>邮件</span>
          </div>-->
        </div>
        <div class="close">
          <img @click="close" src="src1/assets/imagesD/close.png">
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
export default {
  data () {
    return {
      popupVisible: false
    }
  },
  mounted () {
    this.popupVisible = true
  },
  methods: {
    select (type) {
      this.$emit('select', type)
    },
    close () {
      this.popupVisible = false
      this.$emit('close')
    }
  }
} /// //1:专区   2：短信   3：邮件
</script>

<style lang="less" scoped>
.wrapBox {
  height: 95%;
  margin: 0 auto;
  width: 95%;
  background: #fff;
  border-radius: 10px;
}
.shareBox {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 0.18rem;
  div {
    img {
      display: block;
      width: 0.4rem;
      height: 0.4rem;
    }
    span {
      display: block;
      width: 100%;
      text-align: center;
      line-height: 0.4rem;
      font-size: 0.12rem;
      color: #4a4a4a;
    }
  }
}
.close {
  width: 100%;
  margin-top: 0.1rem;
  img {
    display: block;
    margin: 0 auto;
    width: 0.4rem;
    height: 0.4rem;
  }
}
</style>
