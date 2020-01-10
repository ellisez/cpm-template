<template>
  <div class="back-index" @click.stop="toIndex">
    <img src="../../assets/icons/sy-grey.png" alt="">
  </div>
</template>

<script>
import storage from 'storejs'
import { Dialog } from 'vant'
export default {
  methods: {
    toIndex () {
      if (!storage.get(process.env.VUE_APP_STORAGE_NAME) || (storage.get(process.env.VUE_APP_STORAGE_NAME) && !storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt)) {
        Dialog.confirm({
          title: '提示',
          message: '未登录无法进行此操作！',
          confirmButtonText: '去登录',
          cancelButtonText: '再看看',
          showCancelButton: true
        }).then(() => {
          // on confirm
          this.$router.push({
            path: '/'
          })
        }).catch(() => {
          // on cancel
        })
        return
      }
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

<style lang='less' scoped>
.back-index {
  width:0.6rem;
  position: fixed;
  right: 10px;
  bottom: 20%;
}
</style>
