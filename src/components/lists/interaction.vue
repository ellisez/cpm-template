<template>
  <div class="release" @click.stop="toDetail">
    <div class="top">
      <strong>【话题】</strong>
      {{ value.question }}
    </div>
    <div class="info">
      <div v-if="value.content">
        <strong>我:</strong>
        {{ value.content }}
      </div>
      <div>
        <div>
          <strong>我:</strong>
        </div>
        <div class="audio" @click.stop="play" :class="{'playing':isplaying}">
          <div class="audio-btn">{{ isplaying?'正在播放':'点击播放' }}</div>
          <div class="time">{{ value.voiceDuration }}秒</div>
        </div>
      </div>
    </div>
    <div class="status-box" v-show="false">
      <div class="status">6人回复我</div>
      <div class="msg">1条新动态</div>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    value: {
      type: Object
    },
    player: {
      type: HTMLAudioElement
    },
    voiceUrl: {
      tyoe: Object
    }
  },
  created () {

  },
  computed: {
    isplaying () {
      console.log(this.voiceUrl.answerUrl == this.value.answerUrl && this.playing)
      return this.voiceUrl.answerUrl == this.value.answerUrl && this.playing
    }
  },
  data () {
    return {
      playing: false
    }
  },
  methods: {
    ...mapActions({
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    // 详情跳转
    toDetail () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '组件-我的同期声',
          EventID: '2',
          ControlName: '详情跳转',
          Description: this.value.code
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/answerDetail',
        query: {
          code: this.value.code,
          source: 12
        }
      })
    },
    // 播放当前录音
    play () {
      if (this.voiceUrl.answerUrl != this.value.answerUrl) {
        this.$emit('setUrl', this.value)
        this.player.src = this.value.answerUrl
        this.player.load()
        this.player.play()
        this.playing = true

        try {
        // 埋点
          this.baoSaveReport({
            PageName: '组件-我的同期声',
            EventID: '2',
            ControlName: '播放',
            Description: this.value.code
          })
        } catch (error) {
          console.log(error)
        }
        if (this.canReport) {
          this.add()
          this.canReport = false
          setTimeout(() => {
            this.canReport = true
          }, 10000)
        }
      } else {
        if (this.playing) {
          this.player.pause()
          this.playing = false
        } else {
          this.player.play()
          this.playing = true
        }
      }
    }
  }

}
</script>
<style lang="less" scoped>
  @import url('../../style/interaction.less');
</style>
<style>

</style>
