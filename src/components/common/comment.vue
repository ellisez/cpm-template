<template>
  <div>
    <!--详情底部评论，点赞，收场，分享-->
    <div class="comment-box">
      <div class="input" :class="{'short':showShare}" @click="toComment">
        参与讨论...
        <img src="http://studioimage.yxj.org.cn/1545284503773.png">
      </div>
      <div class="btns-comment">
        <!-- 点赞按钮 -->
        <img
          class="praise"
          v-show="isVote == 0"
          @click="praise"
          src="../../assets/icons/add-praise.png"
        >
        <img
          class="praise"
          v-show="isVote == 1"
          @click="praise"
          src="../../assets/icons/addpra_active.png"
        >
        <!--  收藏按钮 -->
        <img
          class="collect ewq"
          v-show="isCollect == 0"
          @click="collect"
          src="../../assets/icons/add-collection.png"
        >
        <img
          class="collect"
          v-show="isCollect == 1"
          @click="collect"
          src="../../assets/icons/cang_active.png"
        >
        <!-- 分享 -->
        <img
          class="collect ewq"
          v-show="showShare"
          @click="share"
          src="../../assets/icons/share.png"
        >
      </div>
    </div>

    <Popup
      v-model="popupVisible"
      style="height:25%;width:100%;background:rgba(0,0,0,0)"
      position="bottom"
    >
      <div class="wrapBox">
        <div class="shareBox">
          <div @click="select('4')" class="area">
            <img src="../../assets/imagesD/area.png">
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
          <img @click="close" src="../../assets/imagesD/close.png">
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Toast, Popup, Dialog } from 'vant'
import storage from 'storejs'
export default {
  components: {
    Popup
  },
  props: {
    items: { type: Object },
    code: { type: String }, // 文章code
    myevent: { type: Function },
    type: {
      type: String
    }
  },
  data () {
    return {
      isCanVote: true, // 防止快速点击点赞按钮多次请求
      isCanCollect: true, // 防止快速点击收藏按钮多次请求
      isVote: this.items.isVote,
      isCollect: this.items.isCanCollect,
      popupVisible: false
    }
  },
  computed: {
    showShare () {
      return !!storage.get('userInfoAMY')
    }
  },

  methods: {
    ...mapActions({
      setPraise: 'content/setPraise',
      addCollection: 'content/addCollection',
      cancelCollection: 'content/cancelCollection',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    close () {
      this.popupVisible = false
    },
    select (channel) {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '组件-详情页底部',
          EventID: '2',
          ControlName: '推送',
          Description: channel
        })
      } catch (error) {
        console.log(error)
      }
      // this.item.code = this.$route.query.code;
      // this.item.fieldName = this.$route.query.fieldName;
      // this.item.shareEncryptKey = this.$route.query.shareEncryptKey;
      // this.item.title = this.$route.query.title;
      // this.item.type = this.$route.query.type;
      // this.item.channel = this.$route.query.channel;
      this.$router.push({
        path: '/sendDBT',
        query: {
          code: this.items.code,
          shareEncryptKey: this.items.shareEncryptKey,
          title:
            this.items.title ||
            this.items.articleTitle ||
            this.items.videoTitle ||
            this.items.meetingTitle,
          type: this.items.type,
          channel,
          columnName: this.items.columnName || '',
          labelName: this.items.labelName
        }
      })
    },
    share () {
      console.log('分享点击')
      this.popupVisible = true
    },
    // 评论
    toComment () {
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
            path: '/discuss'
          })
        }).catch(() => {
          // on cancel
        })
        return
      }
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '组件-详情页底部',
          EventID: '2',
          ControlName: '评论',
          Description: this.items.code
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/discuss',
        query: {
          code: this.code
        }
      })
    },
    // 点赞
    async praise () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '组件-详情页底部',
          EventID: '2',
          ControlName: '点赞',
          Description: this.items.code
        })
      } catch (error) {
        console.log(error)
      }
      if (
        !storage.get(process.env.VUE_APP_STORAGE_NAME) ||
        (storage.get(process.env.VUE_APP_STORAGE_NAME) &&
          !storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt)
      ) {
        Dialog.confirm({
          title: '提示',
          message: '未登录无法进行此操作！',
          confirmButtonText: '去登录',
          cancelButtonText: '再看看',
          showCancelButton: true
        })
          .then(() => {
            // on confirm
            this.$router.push({
              path: '/login'
            })
          })
          .catch(() => {
            // on cancel
          })
        return
      }
      try {
        if (!this.isCanVote) return
        this.isCanVote = false
        var status = this.isVote == '0' ? '1' : '0' // 根据当前点赞状态判断出调用接口传入的状态是取消点赞还是进行点赞行为\
        var res = await this.setPraise({
          code: this.code,
          type: this.items.type,
          status: status
        })
        if (res.code == '1') {
          console.log(status)
          if (status == '1') {
            Toast('点赞成功')
          } else {
            Toast('取消点赞')
          }
          this.isVote = status
          this.$emit('myevent', {
            praiseNum: status == '0' ? -1 : 1,
            isVote: this.isVote
          }) // 根据状态返回点赞数是+1还是-1
        }
      } catch (err) {
        console.log(err)
      }
      this.isCanVote = true
    },
    // 收藏
    async collect () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '组件-详情页底部',
          EventID: '2',
          ControlName: '收藏',
          Description: this.items.code
        })
      } catch (error) {
        console.log(error)
      }
      if (
        !storage.get(process.env.VUE_APP_STORAGE_NAME) ||
        (storage.get(process.env.VUE_APP_STORAGE_NAME) &&
          !storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt)
      ) {
        Dialog.confirm({
          title: '提示',
          message: '未登录无法进行此操作！',
          confirmButtonText: '去登录',
          cancelButtonText: '再看看',
          showCancelButton: true
        })
          .then(() => {
            // on confirm
            this.$router.push({
              path: '/login'
            })
          })
          .catch(() => {
            // on cancel
          })
        return
      }
      try {
        this.isCanCollect = false

        // 根据当前收藏状态来判断该次行为是收藏还是取消收藏
        var status = this.isCollect == '0' ? '1' : '0'
        if (status == '1') {
          var res = await this.addCollection({
            code: this.code,
            type: this.items.type
          })

          Toast('收藏成功')
        } else if (status == '0') {
          var res = await this.cancelCollection({
            code: this.code,
            type: this.items.type
          })

          Toast('取消收藏')
        }
        this.isCollect = status
      } catch (err) {
        console.log(err)
      }
      this.isCanCollect = true
    }
  },
  watch: {
    items () {
      this.isVote = this.items.isVote
      this.isCollect = this.items.isCollect
      // console.log(this.items.isCollect)
      // console.log(this.isCollec)
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../style/comment.less";
.wrapBox {
  height: 95%;
  margin: 0 auto;
  width: 95%;
  background: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
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
  padding-bottom: 0.1rem;
  img {
    display: block;
    margin: 0 auto;
    width: 0.4rem;
    height: 0.4rem;
  }
}
</style>
