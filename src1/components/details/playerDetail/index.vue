<template>
  <div style="padding-bottom:0.5rem;" class="box" oncontextmenu='return false' ondragstart='return false' onselectstart ='return false' onselect='document.selection.empty()' oncopy='document.selection.empty()' onbeforecopy='return false' onmouseup='document.selection.empty()'>
      <div class="article-detail">
          <div class="title">{{this.content.videoTitle}}
          <div class="time">{{this.content.createTime}}</div></div>
          <div class="detail-content">
              <div class="video-player" id="video-player" :style="{background: isplayBg }">
                  <div class="playicon" v-show="showPlay">
                  </div>
      		  </div>
              <div class="meeting" v-show="this.content.playerIntroduce != ''">
                  <div class="subtitle">
                      选手介绍
                  </div>
                  <div class="person">
                      <div class="head-img">
                          <img :src="content.playerHeadUrl" alt="">
                      </div>
                      <div class="left">
                        <p class="name">姓名:&nbsp;{{ content.name }}</p>
                        <p class="vote-num" v-if="content.largeType != 'B'">票数:&nbsp;{{ content.voteNum }}</p>
                      </div>
                      <div class="right" v-if="content.largeType != 'B' && this.showVote" :class="{'active':isVote==1 || isVote== 2 || isVote==3 }">
                          <button @click="addVote">{{voteText[isVote]}}</button>
                      </div>

                  </div>
                  <div class="meeting-text">
                      <p v-html="formatSolution(this.content.playerIntroduce)">

                      </p>
                  </div>

                   <div class="subtitle" v-if="this.content.courseIntroduce != null">
                      讲题介绍
                  </div>
                  <div class="meeting-text" v-if="this.content.courseIntroduce != null">
                      <p v-html="formatSolution(this.content.courseIntroduce)">

                      </p>
                  </div>
              </div>
              <div class="bt cf">
                    <div class="eyes" v-if="this.content.readNum != 0">
                    <p>观看数</p>
                    <span>{{this.content.readNum}}</span>
                  </div>
                  <div class="heart" v-if="this.content.praiseNum != 0">
                      <p>点赞数</p>
                      <span>{{this.content.praiseNum}}</span>
                  </div>
              </div>

          </div>
      </div>
      <div class="lists-box" id="subject" ref="subject">
          <!-- <Subject :code = "code" @getFlag='getFlag'></Subject> -->
      </div>

      <div class="comment meeting lists-box" v-if="commentsList.length != 0">
                  <div class="subtitle">
                      精选评论
                  </div>
                  <ul>
                      <li v-for="(item,index) in commentsList" :key="index">
                          <Comments :item='item'></Comments>
                      </li>
                  </ul>
                  <p class="over" v-if="isLastPage">已经到底了~</p>
              </div>
      <!-- <BackTop></BackTop> -->
       <a @click="jump()" class="indexBack"></a>
      <comment :code = "code" :type="type" :isVote="this.content.isPraise" :isCollect="isCollect" @praiseAdd='praiseAdd' :isFlag='isFlag' :topic='topic' :subject='this.$refs.subject'></comment>
      <transition name="fade">
          <div class="answer-result" v-show="resultShow">
              <div class="mask" @click="cancel"></div>
              <div class="content" data-flex="dir:top main:justify">
                  <div class="close"  @click="cancel"></div>
                  <div class="text" v-html="msg">
                  </div>
              </div>
          </div>
      </transition>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { Toast } from 'vant'
import storage from 'storejs'
// import { baseUrl } from '../../interfaceUrl'
import listItem from '../../lists/list-item'
import Comments from '../../lists/comments'
import comment from '../../common/comment'
// import BackTop from '../common/backTop'
// import store from '../../store'
// import Subject from '../common/subject'
// import app from '../../utils/bridge'
// import { getJsTicket , getQuery } from '../../utils/auth'
export default {
  components: {
    listItem, Comments, comment
  },
  created () {
    this.getVideoDetail()
  },
  data () {
    return {
      id: 0,
      content: [],
      code: '',
      type: '',
      isVote: 2,
      voteText: ['投一票', '已投票', '已截止投票', '未开始投票'],
      isCollect: 0,
      player: null,
      read_timer: null,
      resultShow: false,
      msg: '',
      shareEncryptKey: '',
      permissions_timer: null,
      browseJurisdiction: '',
      play_timer: null,
      report_article_timer: null,
      report_video_timer: null,
      isplayBg: '',
      showPlay: false,
      source: '',
      isRecommend: '',
      commentsPageNum: 1,
      commentsPageSize: 10,
      commentsList: [],
      loading: false,
      isLastPage: false,
      isFlag: 0,
      topic: [],
      showVote: false,
      player_timer: '',
      // 视频播放时长 times
      fullTime: false,
      Times: 0
    }
  },
  computed: {
    ...mapGetters(['user', 'isWechat'])
  },
  methods: {
    ...mapMutations(['hideLoad', 'setUserInfo']),
    ...mapActions({
      getComments: 'content/getComments',
      getPlayer: 'content/getPlayer',
      reportUserTime: 'content/reportUserTime'
    }),
    // 获取subject组件传过来的isFlag（是否已经答题的code）
    getFlag (code, topic) {
      this.isFlag = +code
      this.topic = topic
    },
    // 点赞事件完成后页面点赞数同步增减
    praiseAdd (code) {
      if (code == 0) {
        this.content.praiseNum++
      } else if (code == 1) {
        this.content.praiseNum--
      }
    },
    // 点击投一票
    async addVote () {
      if (this.isVote != 0) {
        return
      }
      // if(this.Times < 60){
      if (this.player.core.containers[0].currentTime < 60) {
        // 当前播放时间小于1分钟，提示用户
        // 2018-07-09  张坦确认 --- 用户可以拖动进度条来达到时间限制
        MessageBox({
          title: '提示',
          message: '观看视频至少1分钟，回答视频下方小问题后，再投票哦',
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: '知道了'
        })
        // MessageBox.alert('观看视频至少1分钟，回答视频下方小问题后，再投票哦', '提示');
        return
      }
      if (this.topic.length != 0 && this.isFlag == 0) {
        Toast('请先答题再投票')
        document.body.scrollTop = this.$refs.subject.offsetTop
        document.documentElement.scrollTop = this.$refs.subject.offsetTop
        window.pageYOffset = this.$refs.subject.offsetTop
        return
      }
      let code = this.$route.query.code
      let data = {
        code,
        type: ''
      }
      try {
        var res = await this.addVote(data)
        this.isVote = 1
        this.content.voteNum++
        Toast('感谢您的参与~')
      } catch (error) {
        Toast(error)
      }
    },
    async loadMore () {
      // 获取评论列表
      if (this.isLastPage || this.loading) {
        return
      }
      let code = this.$route.query.code
      let data = {
        companyCode: 'DYSG-GS',
        code,
        pageNum: this.commentsPageNum,
        pageSize: this.commentsPageSize
      }
      this.loading = true
      try {
        var res = await this.getComments(data)
        this.commentsList = this.commentsList.concat(res.data.list)
        this.commentsPageNum = res.data.nextPage
        this.loading = false
        this.isLastPage = res.data.isLastPage
      } catch (error) {
        console.log(error)
      }
    },
    jump () {
      storage.set('amyfrom', '')
      var amy = new Object()
      if (storage.get(process.env.VUE_APP_STORAGE_NAME)) {
        amy = storage.get(process.env.VUE_APP_STORAGE_NAME)
        var encrypt = amy.encrypt
        if (!encrypt) {
          if (storage.get(process.env.VUE_APP_STORAGE_NAME).agreen != true && /MicroMessenger/i.test(navigator.userAgent)) {
            this.$router.push('/agree')
          } else {
            this.$router.push('/login')
          }
        } else {
          if (amy.userType == 'B') {
            this.$router.push('/')
          } else {
            this.$router.push('/setting')
          }
        }
      } else {
        this.$router.push('/agree')
      }
    },
    async getVideoDetail () {
      let data = this.$route.query
      try {
        var res = await this.getPlayer(data)
        this.isVote = res.data.isVote
        if (res.data.voteStatus == 'B') {
          this.isVote = 2
        }
        if (res.data.voteStatus == '') {
          this.isVote = 3
        }
        this.showVote = true
        this.content = res.data

        this.hideLoad()
        // 判断用户是否登录
        storage.set('amyfrom', location.href)
        var encrypt = storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt
        if (!encrypt && this.content.voteStatus == 'A') {
          // 用户未登录并且当前为投票中
          var agreen = storage.get(process.env.VUE_APP_STORAGE_NAME).agreen
          if (!agreen) {
            location.replace(location.origin + location.pathname + '#/agree')
          } else {
            location.replace(location.origin + location.pathname + '#/login')
          }
          return
        }
        this.code = this.content.code
        this.type = this.content.type
        // 页面加载判断是否投票截止
        this.isCollect = this.content.isCollect
        this.browseJurisdiction = this.content.browseJurisdiction
        this.shareEncryptKey = this.content.shareEncryptKey
        this.isRecommend = this.content.isRecommend

        var _this = this
        clearTimeout(window.play_timer)
        window.play_timer = setTimeout(() => {
          _this.playVideo()
        }, 0)

        clearTimeout(_this.permissions_timer)
        var userType = storage.get(process.env.VUE_APP_storage).userType
        var type = storage.get(process.env.VUE_APP_STORAGE_NAME).type
        if (location.href.indexOf('shareEncryptKey') != -1) {
          if ((_this.browseJurisdiction == 'B' || _this.browseJurisdiction == 'C') && userType != 'B') {
            _this.permissions_timer = setTimeout(() => {
              MessageBox({
                title: '提示',
                message: '请完善信息升级为高级用户，解锁该内容',
                showCancelButton: true,
                cancelButtonText: '再看看',
                confirmButtonText: '去完善',
                closeOnClickModal: false
              }).then(action => {
                var encrypt = storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt
                if (encrypt) {
                  if (action == 'confirm') {
                    storage.set('amyfrom', location.href)
                    _this.$router.push({ path: '/setting' })
                  } else {
                    storage.set('amyfrom', location.href)
                    _this.$router.push({ path: '/setting' })
                  }
                } else {
                  storage.set('amyfrom', location.href)
                  _this.$router.push({ path: '/agree' })
                }
              })
            }, 5000)
          } else {
            if (_this.browseJurisdiction == 'C' && _this.user.realnameAuthStatus != 'C') {
              if (_this.user.realnameAuthStatus != 'B') {
                _this.permissions_timer = setTimeout(() => {
                  MessageBox({
                    title: '提示',
                    message: '请升级为认证用户，解锁该内容',
                    showCancelButton: true,
                    cancelButtonText: '再看看',
                    confirmButtonText: '去认证',
                    closeOnClickModal: false
                  }).then(action => {
                    var encrypt = storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt
                    if (encrypt) {
                      if (action == 'confirm') {
                        storage.set('amyfrom', location.href)
                        _this.$router.push({ path: '/setting' })
                      } else {
                        _this.$router.push({ path: '/' })
                      }
                    } else {
                      storage.set('amyfrom', location.href)
                      _this.$router.push({ path: '/agree' })
                    }
                  })
                }, 5000)
              } else {
                _this.permissions_timer = setTimeout(() => {
                  MessageBox({
                    title: '提示',
                    message: '认证审核中，看看其他的内容吧',
                    showCancelButton: true,
                    closeOnClickModal: false
                  }).then(action => {
                    _this.$router.push({ path: '/' })
                  })
                }, 5000)
              }
            }
          }
        } else {
          if ((_this.browseJurisdiction == 'B' || _this.browseJurisdiction == 'C') && userType != 'B') {
            _this.permissions_timer = setTimeout(() => {
              MessageBox({
                title: '提示',
                message: '请完善信息升级为高级用户，解锁该内容',
                showCancelButton: true,
                cancelButtonText: '再看看',
                confirmButtonText: '去完善',
                closeOnClickModal: false
              }).then(action => {
                var encrypt = storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt
                if (encrypt) {
                  if (action == 'confirm') {
                    storage.set('amyfrom', location.href)
                    _this.$router.push({ path: '/setting' })
                  } else {
                    storage.set('amyfrom', location.href)
                    _this.$router.push({ path: '/setting' })
                  }
                } else {
                  storage.set('amyfrom', location.href)
                  _this.$router.push({ path: '/agree' })
                }
              })
            }, 5000)
          } else {
            if (_this.browseJurisdiction == 'C' && _this.user.realnameAuthStatus != 'C') {
              if (_this.user.realnameAuthStatus != 'B') {
                _this.permissions_timer = setTimeout(() => {
                  MessageBox({
                    title: '提示',
                    message: '请升级为认证用户，解锁该内容',
                    showCancelButton: true,
                    cancelButtonText: '再看看',
                    confirmButtonText: '去认证',
                    closeOnClickModal: false
                  }).then(action => {
                    var encrypt = storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt
                    if (encrypt) {
                      if (action == 'confirm') {
                        storage.set('amyfrom', location.href)
                        _this.$router.push({ path: '/setting' })
                      } else {
                        _this.$router.go(-1)
                      }
                    } else {
                      storage.set('amyfrom', location.href)
                      _this.$router.push({ path: '/agree' })
                    }
                  })
                }, 5000)
              } else {
                _this.permissions_timer = setTimeout(() => {
                  MessageBox({
                    title: '提示',
                    message: '认证审核中，看看其他的内容吧',
                    showCancelButton: true,
                    closeOnClickModal: false
                  }).then(action => {
                    _this.$router.go(-1)
                  })
                }, 5000)
              }
            }
          }
        }
      } catch (error) {
        Toast(error)
      }
    },
    async jifenRules () {
      var code = this.code
      let data = {
        code: code,
        isRecommend: this.isRecommend,
        type: 2
      }
      try {
        var res = await this.reportJfUp(data)
        if (res.data.isFlag == true) {
          let userIntegral = this.user.userIntegral + res.data.score
          this.setUserInfo({ userIntegral })
          var type = storage.get(process.env.VUE_APP_STORAGE_NAME).type
          if (type != 'A') {
            Toast('积分+' + res.data.score)
          }
        }
      } catch (error) {
        Toast(error)
      }
    },
    playVideo () {
      var _this = this
      if (_this.player) {
        _this.player.destroy()
        _this.player = null
      }
      var video = document.getElementById('video-player')

      var options = {
        source: { source: _this.content.videoUrl, mimeType: 'video/mp4' },
        poster: _this.content.thumbnailUrl,
        preload: true,
        hideMediaControl: true,
        width: '100%',
        height: '100%',
        playSinline: true,
        x5PlaySinline: true,
        events: {
          onPlay: () => {
            //     if(this.Times >= 60){
            //         return
            //     }
            // this.player_timer = setInterval(() => {
            //     this.Times++
            //     if(this.Times >= 60){
            //         this.fullTime = true
            //     }
            // },1000)
          },
          onPause: () => {
            // clearInterval(this.player_timer)
          },
          onEnded: () => {
            // clearInterval(this.player_timer)
          },
          onStop: () => {
            // clearInterval(this.player_timer)
          }

        }
      }

      var userType = storage.get(process.env.VUE_APP_storage).userType
      var type = storage.get(process.env.VUE_APP_STORAGE_NAME).type
      if (_this.browseJurisdiction == 'B' && userType == 'A') {
        _this.isplayBg = 'url(' + _this.content.thumbnailUrl + ') no-repeat center center'
        _this.showPlay = true
      } else {
        _this.isplayBg = ''
        _this.showPlay = false
        var player = new Clappr.Player(options)
        player.attachTo(video)
        _this.player = player
        player.on('play', function () {
          var encrypt = storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt
          if (encrypt) {
            clearTimeout(_this.read_timer)
            _this.read_timer = setTimeout(() => {
              _this.jifenRules()
            }, 60000)
          }

          clearInterval(_this.report_video_timer)
          _this.report_video_timer = setInterval(() => {
            let userId = storage.get(process.env.VUE_APP_STORAGE_NAME).userId || ''
            let data = {
              userId: userId,
              type: _this.type,
              code: _this.code,
              logType: '2',
              viewId: _this.content.viewId,
              companyCode: 'DYSG-GS',
              areaCode: 'AMYXY'
            }
            _this.$http.post(baseUrl + '/common/report/time/save', JSON.stringify(data),
              { emulateJSON: true,
                headers: { 'Content-Type': 'application/json;charset=UTF-8' }
              }).then((res) => {
              if (res.code == 0) {
                //   Toast(res.msg);

              }
            })
          }, 5000)
        })

        player.on('pause', function () {
          clearTimeout(_this.read_timer)
          clearInterval(_this.report_video_timer)
        }),
        player.on('ended', function () {
          clearTimeout(_this.read_timer)
          clearInterval(_this.report_video_timer)
        })
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
    },
    cancel () {
      this.resultShow = false
    }
  },
  mounted () {
    // if (this.isWechat) {
    //     changeTitle('选手详情页')
    // }else{
    //     app.setTitle('选手详情页')
    //     app.setTitleColor(0,115,188)
    // }

    // 页面渲染加载一次评论数据
    this.loadMore()
    if (this.isWechat) {
      changeTitle('选手详情页')
    } else if (location.href.indexOf('appencrypt') != -1) {
      app.setTitle('选手详情页')
      app.setTitleColor(0, 115, 188)
    } else {
      document.getElementsByTagName('title')[0].innerText = '详情页'
    }
  },
  watch: {
    '$route' (to, from) {
      this.getVideoDetail().then(res => {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
        window.pageYOffset = 0
      })
    }
    // "$route": "getVideoDetail",
  },
  destroyed () {
    if (this.player !== null) {
      this.player.destroy()
      this.player = null
    }
    let _this = this
    clearTimeout(_this.play_timer)
    clearTimeout(_this.read_timer)
    clearTimeout(_this.permissions_timer)
    clearInterval(_this.report_article_timer)
    clearInterval(_this.report_video_timer)
  }
}
</script>

<style lang="less" scoped>
@import 'src1/styleicle.less';
</style>
<style lang="less" scoped>
.lists-box {
    margin-top:0;
}
    img {
        width: 100%;
        height: auto;
        display: block;
    }
    .playicon {
        width: 100%;
        height: 100%;
        display: block;
        // background: url('../../assets/icons/playicon.png') no-repeat center center;
        background-size: 40px 48px;
        z-index: 3;
    }

    .person {
        width: 100%;
        height: 1.23rem;
        padding:0.1rem 0.1rem 0.1rem 0;
        .head-img{
            width:0.8rem;
            height: 100%;
            overflow: hidden;
            float: left;
            img {
                width:100%;
                height: auto;
            }
        }
        .left {
            width:40%;
            height: 100%;
            float: left;
            padding-left: 0.12rem;
            p {
                height: 50%;
                line-height:0.5rem;
                font-size:0.16rem;
                font-weight:700;
            }
        }
        .right {
            width:1rem;
            height: 100%;
            float: right;
            vertical-align:middle;
            position: relative;
            &.active {
                button {
                    background-color: #999999;
                }
            }
            button {
                width:1rem;
                height: 0.4rem;
                background-color: #d93639;
                border :0;
                font-size:0.16rem;
                color:#fff;
                border-radius: 0.05rem;
                line-height:0.3rem;
                position: absolute;
                top:50%;
                right:0;
                transform:translateY(-50%);
            }
        }
    }
    .subtitle{
            margin-bottom:0 !important;
        }
    .comment {
        background-color: #fff;
        padding:0 3.2%;
        moz-user-select: -moz-none;
        -moz-user-select: none;
        -o-user-select:none;
        -khtml-user-select:none;
        -webkit-user-select:none;
        -ms-user-select:none;
        user-select:none;

        .subtitle{
            padding:0.1rem 0;
            text-align:left;
            margin:0;
        }
    }

    .over {
        height: 0.5rem;
        font-size:0.12rem;
        line-height:0.5rem;
        color:#ccc;
        text-align:center;
    }

    .eye {
        width:0.1rem;
        padding-left:0.3rem;
        // background: url('../../assets/icons/icon1.png') no-repeat center center;
        background-size: 0.15rem auto;
    }
    .hand {
        width:0.1rem;
        padding-left:0.3rem;
        // background: url('../../assets/icons/icon2.png') no-repeat center center;
        background-size: 0.13rem auto;
    }
    .article-detail .time{
        margin:0
    }
    .article-detail .detail-content > div{
        margin:0 0 0.1rem 0;
    }
    .indexBack {
	width: 0.28rem;
	height: 0.95rem;
	position: fixed;
	right: 0;
    bottom:50%;
    transform:translateY(50%);
	background-color: red;
	// background: url('../../assets/images/backindex.png') no-repeat right center;
	background-size: 100% auto;
}

</style>
