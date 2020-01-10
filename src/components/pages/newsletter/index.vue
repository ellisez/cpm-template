<template>
  <div class="newsletter" v-show="list.length > 0">
    <div class="rule" @click="showRule">规则</div>
    <router-link class="ranking" to="/ranking">排行榜</router-link>

    <router-link class="list" to="/frontier?modelCode=AMYXY-WXJD">文献</router-link>
    <div class="newsletter_top">
      <img src="../../../assets/images/newsletter-top_02.png" class="newsletter_top-img">
      <!-- <img src="../../../assets/images/newsletter-top_tit.png" class="newsletter_top-img"> -->
      <img src="../../../assets/images/newsletter-top_08.png" class="newsletter_top-yun">
      <img src="../../../assets/images/newsletter-top_08.png" class="newsletter_top-yun">
    </div>

    <div class="img" v-for="(item,index) in list" :key="index">
      <img src="../../../assets/images/newsletter-bg.png" alt @load="imgLoad(0)">

      <div
        @click="toDetail(e)"
        v-for="(e,i) in item"
        :key="i"
        class="custom-btn"
        :class="{
        'two':i%7 == 1,
        'three':i%7 == 2,
        'four':i%7 == 3,
        'five':i%7 == 4,
        'six':i%7 == 5,
        'seven':i%7 == 6,
        'newPass':index == coord[0]&& i == coord[1]
      }"
      >
        <img
          v-show="e.status == 'B' && !e.isPass"
          src="../../../assets/images/open-cus.png"
          alt
          @load="imgLoad(1)"
        >
        <img
          v-show="e.status == 'A'"
          src="../../../assets/images/close-cus.png"
          alt
          @load="imgLoad(2)"
        >
        <img
          v-show="e.status == 'B' && e.isPass"
          src="../../../assets/images/answered-cus.png"
          alt
          @load="imgLoad(3)"
        >
        <div class="month">{{ e.level }}</div>
        <div class="cus-name">{{ e.title }}</div>
        <img
          class="hand"
          v-show="e.status == 'B' && !e.isPass"
          src="../../../assets/images/hand-gq.png"
          alt
        >
        <img
          class="new"
          v-show="e.status == 'B' && !e.isPass"
          src="../../../assets/images/new.png"
          alt
        >
      </div>
    </div>
    <!-- 规则 -->
    <div class="rule_cover" @click.stop="isRule=false" @touchmove.prevent v-if="isRule"></div>
    <transition
    name="fade"
    enter-class="fade-in-enter"
    enter-active-class="fade-in-active"
    leave-class="fade-out-enter"
    leave-active-class="fade-out-active"
  >
      <div class="rule_model" ref="rule_model" v-if="isRule">
        <div class="rule_model_header"></div>
        <div class="rule_model_con">
          <ul class="ul_l">
            <li>1、每月开启两个关卡，一个血压领域关和一个血脂领域关。</li>
            <li>2、闯关前必须先完成实名认证，认证方法：个人中心--编辑个人信息--实名认证，上传执业医师证照片即可。（不用等待认证审核通过，认证中也能闯关）。</li>
            <li>3、每个关卡都有一篇关联文献，预闯关需要先阅读该文献10s以上。</li>
            <li>4、每个关卡包含4个选择题和1个问答题，全部回答提交即完成闯关，问答题需200字以上。</li>
            <li>5、问答题，用户提交的答案，医学部审核通过后将会在关联文献后评论区展示。</li>
            <li>6、每月会按照答题正确率进行排名，前100名排行榜展示。</li>
          </ul>
          <div class="rule_model_btn" @click.stop="isRule=false">知道了</div>
        </div>
      </div>
  </transition>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { Toast, Dialog } from 'vant'
import { changeTitle } from '../../../utils/func'
import share from '../../../utils/share'
import storage from 'storejs'

export default {
  created () {
    this.getList()
    this.getInfo()
    changeTitle('心时讯汇编')
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '心时讯汇编',
        EventID: '1',
        ControlName: '',
        Description: ''
      })
    } catch (error) {
      console.log(error)
    }
  },
  mounted () {
    this.hideLoad()
    share({
      title: '心时讯汇编',
      desc: '闯关答题解文献跃然榜首是达人',
      link: `${location.origin}${location.pathname}#/newsletter`,
      imgUrl: 'https://imageysz.yxj.org.cn/1554191431121.jpg'
    })
  },
  data () {
    return {
      isRule: false, // 规则是否显示
      list: [],
      arr: [], // 判断图片有没有加载玩
      coord: [0, 0], // 坐标
      info: {}
    }
  },
  watch: {
    // isRule(o) {
    //   let that = this;
    //   if (o) {
    //     document.body.style.overflow = "hidden";
    //   } else {
    //     document.body.style.overflow = "";
    //   }
    // }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      getCustomsList: 'content/getCustomsList',
      baoSaveReport: 'ubt/baoSaveReport',
      getUserInfo: 'user/getUserInfo'
    }),

    /**
     * 到指定位置
     */
    toLocal (num) {
      document.body.scrollTop = num || 0
      document.documentElement.scrollTop = num || 0
      window.pageYOffset = num || 0
    },
    /**
     * 到指定关卡
     */
    imgLoad (type) {
      if (this.arr.indexOf(type) >= 0) {
        return
      }
      this.arr.push(type)
      console.log(this.arr, ' this.arr')
      if (this.arr.length !== 4) {
        return
      }
      let newPass = document.querySelector('.newPass')
      let newPassHei = newPass.offsetHeight / 2
      let clientHei =
        document.body.clientHeight ||
        window.screen.height ||
        window.screen.availHeight
      let tagartNum =
        this.getElementToPageTop(newPass) + newPassHei - clientHei / 2
      this.toLocal(tagartNum)
    },
    getElementToPageTop (el) {
      if (el.parentElement) {
        return this.getElementToPageTop(el.parentElement) + el.offsetTop
      }
      return el.offsetTop
    },
    /**
     * 游戏规则
     */
    showRule () {
      this.isRule = true
      this.$nextTick(() => {
        setTimeout(() => {
          let rule_modelDom = this.$refs.rule_model
          console.log(this.$refs, 'rule_modelDom')
          rule_modelDom.style.width = '3.1rem'
          rule_modelDom.style.height = rule_modelDom.scrollHeight + 'px'
        }, 300)
      })
    },
    // 获取用户信息
    async getInfo () {
      try {
        var res = await this.getUserInfo()
        this.info = res.data
      } catch (err) {
        console.log(err)
      }
    },
    toDetail (item) {
      // 代表不用认证
      if (!storage.get('userInfoAMY')) {
        let msg =
          this.info.realnameAuthStatus === 'D'
            ? '您的认证信息，未通过审核，请您再次提交认证信息！'
            : '<p>请完善信息升级为认证用户,即可回答问题</p><p>并获得<span style="color:#d93639;">30积分</span>奖励,可用来兑换</p><p>精美礼品哦</p>'
        //   是否实名认证【A:未审核,B:审核中,C:已通过,D:未通过】
        if (this.info.realnameAuthStatus === 'D') {
          Dialog.confirm({
            title: '',
            message: msg,
            confirmButtonText: '去认证',
            cancelButtonText: '再看看'
          })
            .then(() => {
              // on confirm
              this.$router.push({
                path: '/setting'
              })
            })
            .catch(() => {
              // on cancel
            })
          return
        }
        if (this.info.realnameAuthStatus === 'A') {
          // 未认证提示
          Dialog.confirm({
            title: '',
            message: msg,
            confirmButtonText: '去认证',
            cancelButtonText: '再看看'
          })
            .then(() => {
              // on confirm
              this.$router.push({
                path: '/setting',
                query: { random: new Date().getTime() }
              })
            })
            .catch(() => {
              // on cancel
            })
          return
        }
      }

      if (item.isPass) {
        Toast('当前关卡已完成')
        return
      }
      if (item.status == 'A') {
        Toast('当前关卡未开启，敬请期待')
        return
      }
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '心时讯汇编',
          EventID: '2',
          ControlName: '关卡入口',
          Description: item
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/challenge',
        query: {
          code: item.code,
          url: item.url
        }
      })
    },
    async getList () {
      try {
        var res = await this.getCustomsList()
        console.log(res)
        var list = []
        res.data.forEach((e, i) => {
          list.push(e)
          if (i == res.data.length - 1) {
            // 最后一组直接加入列表
            this.list.push(list)
          }
          if (i > 0 && (i + 1) % 7 == 0) {
            // 每7条数据塞入列表
            this.list.push(list)
            list = []
          }
        })
        console.log(this.list)

        this.list.forEach((item, index) => {
          item.forEach((e, i) => {
            if (e.status === 'B') {
              this.coord = [index, i]
            }
          })
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url("../../../style/newsletter.less");
&.fade-in-active, &.fade-out-active{
  animation: model .3s  ease-in-out
}
&.fade-in-enter, &.fade-out-active{
  // left: -99px;
  // opacity: 0;
  // width: 0;
  // top: -999px;
  // height: 0;
  animation: model_reverse .5s ease-in-out
}

@keyframes model {
  0% {
    left: .3rem;
    top: .5rem;
       width:0.5rem;
    height: 0.5rem;
  }
  50% {
    left: .3rem;
    top: .5rem;
     width:1rem;
    height: 1rem;
  }
    100% {
    left: .3rem;
    top: .5rem;
       width:3rem;
    height: auto;
  }
}
@keyframes model_reverse {
  0% {
    left: .3rem;
    top: .5rem;
    width: 3.1rem;
    height: 'auto';
  }
  50% {
    left: .3rem;
    top: .5rem;
    width: 0;
    height: 0;
  }
    100% {
    left: .3rem;
    top: .5rem;
      width: 0;
    height: 0;
  }
}
</style>
<style>
</style>
