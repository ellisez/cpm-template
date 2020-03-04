<template>
    <div style="background-color:#fff;height:100%;">
        <textarea class="discuss" autofocus name="name" rows="" cols="" v-model="text" placeholder="深度讨论会被优先展示，不友善言论被举报后会被禁言甚至封号"></textarea>
        <button class="btns w80"><a @click="submit">提交</a></button>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import storage from 'storejs'
import { Toast } from 'vant'
export default {
  data () {
    return {
      text: ''
    }
  },
  methods: {
    ...mapActions({
      sendMessage: 'content/sendMessage',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    async submit () {
      let code = this.$route.query.code
      let encrypt = storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt
      let userId = storage.get(process.env.VUE_APP_STORAGE_NAME).userId
      let commentContent = this.text
      if (this.text.trim() == '') {
        Toast('请输入内容！')
        return
      }
      let data = {
        code: code,
        commentContent: commentContent,
        userId: userId
      }
      try {
        var res = await this.sendMessage(data)
        try {
          // 埋点
          this.baoSaveReport({
            PageName: '评论',
            EventID: '2',
            ControlName: '提交评论',
            Description: '提交评论'
          })
        } catch (error) {
          console.log(error)
        }
        Toast('提交成功，审核后即展示')
        this.$router.back()
      } catch (error) {
        Toast(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.discuss {
    width: 100%;
    height: 40%;
    padding: 0.1rem 4%;
    line-height: 1.5;
    font-size: 0.15rem;
    border:none;
    resize:none;
    outline: none;
}
.btns {
  background:linear-gradient(315deg,rgba(32,42,161,1) 0%,rgba(75,50,228,1) 100%);
  box-shadow:-2px 2px 10px 0px rgba(74,49,227,0.5);
}

</style>
