<template>
<div>
    <div class="comments-box">
        <div class="cf">
            <div class="left">
                <div class="user_logo">
                    <img src="src1/assets/images/pic_mrtx.png" v-if="!item.portraitUrl">
					<img :src="item.portraitUrl" v-else>
                </div>
            </div>
            <div class="right">
                <div class="cf">
                    <div class="name" v-if="item.userName">{{item.userName}}</div>
                    <div class="name" v-else>{{item.nickName || item.userName || "同仁"}}</div>
                    <div class="heart cf">
                        <p :class="{'active': showZan == 1}" @click="zan()"></p>
                        <span>{{this.praiseNum}}</span>
                    </div>
                </div>
                <div class="comments-details" ref="unfold">
                    <p class="notCP" v-html="formatSolution(item.commentContent)" ref="comments"></p>
                    <p class="unfold-box" v-show="!ishide">

                        <span @click="showMore">显示更多</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import storage from 'storejs'
import { Toast } from 'vant'
// import { Toast,MessageBox } from 'mint-ui'
export default {
  props: {
    item: [Object]
  },
  data () {
    return {
      zanNum: '',
      showZan: this.item.isCommentVote,
      commentCode: this.item.commentCode,
      praiseNum: this.item.praiseNum,
      status: 1,
      ishide: true

    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.$refs.comments.clientHeight > parseInt(window.getComputedStyle(document.documentElement).fontSize) * 1.1) {
        this.ishide = false
      } else {
        this.$refs.unfold.style.height = 'auto'
      }
      this.$refs.comments.oncopy = () => {
        return false
      }
    })
    // console.log(this.ishide)
    // 下面这段代码必须执行，否则展示更多无法显示
    let that = this.hide
  },
  methods: {
    ...mapActions({
      setPraise: 'content/setPraise',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    showMore () {
      this.$refs.unfold.classList.add('unfold')
      this.ishide = true
    },
    async zan () {
      if (this.showZan !== 1) {
        let commentCode = this.commentCode
        var encrypt = storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt
        if (!encrypt) {
          storage.set('amyfrom', location.href)
          // MessageBox.confirm('您还没登录是否去登陆?').then(action => {
          //   var agreen=storage.get("amy").agreen;
          //   if(!agreen) {
          //       location.hash="#/agree"
          //   }else {
          //       location.hash="#/login"
          //   }
          // });
          return
        }
        let data = {
          type: 0,
          code: commentCode,
          status: this.status
        }
        try {
          var res = await this.setPraise(data)

          try {
            // 埋点
            this.baoSaveReport({
              PageName: '组件-评论',
              EventID: '2',
              ControlName: '点赞',
              Description: commentCode
            })
          } catch (error) {
            console.log(error)
          }
          if (res.data.flag) {
            if (this.status == 1) {
              this.showZan = 1
              this.praiseNum = Number(this.praiseNum) + 1
            }
          }
        } catch (error) {
          Toast(error)
        }
      }
    },
    formatSolution (s) {
      if (s) {
        s = s.replace(/ /gi, '&nbsp;')
        s = s.replace(/[\r\n]/g, '<br />')
        s = s.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
        return s
      } else {
        	   return ''
        	}
    }
  }
}
</script>

<style lang="less" scoped>
@import url('src1/stylearticle.less');

.unfold-box {
    display: block;
    height: 0.4rem;
    width: 100%;
    font-size: 0.12rem;
    text-align: center;
    color: #7994C1;
    line-height: 0.20rem;
    padding-top: 0.18rem;
    background-image: linear-gradient(rgba(255,255,255,.5),rgba(255,255,255,1),rgba(255,255,255,1));
    position: absolute;
    bottom: 0;
    left: 0;
    font-weight: 400;
    span{
        display: inline-block;
        padding: 0 0.1rem;
        border: 0.01rem solid #ccc;
        border-radius: 0.1rem;
        cursor:pointer;
    }
}

.notCP{
-webkit-user-select: none;
    -moz-user-select: none;
    -webkit-user-select:none;
    -o-user-select:none;
    user-select:none;
}
</style>
