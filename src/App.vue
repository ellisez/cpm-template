<template>
  <div id="app">
    <!-- <router-view style="width: 100%" v-show="!loading"/> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" style="width: 100%" v-show="!loading"></router-view>
    </keep-alive>
    <router-view
      v-if="!$route.meta.keepAlive"
      style="width: 100%"
      :key="$route.fullPath"
      v-show="!loading"
    ></router-view>
    <Loading v-show="loading" />
    <netLoading v-show="netLoading" />
    <backIndex v-if="$route.meta.backIndex" />
    <backTop v-if="$route.meta.backTop" />
  </div>
</template>

<script>
import Loading from './components/common/loading'
import netLoading from './components/common/netLoading'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import app from './utils/bridge'
import { setTimeout } from 'timers'
import backIndex from './components/common/backIndex'
import backTop from './components/common/backTop'
import { getUrlParam } from './utils/func.js'
export default {
  name: 'app',
  components: {
    Loading,
    backIndex,
    backTop,
    netLoading
  },
  data () {
    return {
      showShuid: false
    }
  },

  mounted () {
    // console.log(getUrlParam("inviteUid"), 3333333333333333333333333333);
    if (this.isWechat) {
      // changeTitle('时讯汇编')
    } else if (location.href.indexOf('appencrypt') != -1) {
      app.setTitle('傲美云学院')
      app.hideShareBtn(true)
      app.setTitleColor(0, 115, 188)
    } else {
      document.getElementsByTagName('title')[0].innerText = '傲美云学院'
    }
  },
  computed: {
    ...mapGetters(['loading', 'netLoading', 'isWechat'])
  },
  watch: {
    $route () {}
  }
}
</script>

<style lang='less'>
@import "~flex.css/dist/data-flex.css";
/* @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3){  */
/* html,body {
      margin-bottom: 34px;
      box-sizing: unset;
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
    } */
/* .tab{
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
      box-sizing: unset;
      border-bottom: 20px solid #fff !important;
      background-color: #fff;
   }
  body {
      box-sizing: unset;
      padding-bottom: 20px !important;
      background-color: #fff;
       padding-bottom: 20px !important;

  }
  .tab .footer {
    position: unset !important;
    box-shadow: 0 -2.5px 10px 0 rgba(150,140,140,0.2) !important;
  }
  .footer-comments-box {
      position: fixed !important;;
      width:100% !important;
      z-index:99 !important;
      box-sizing: unset !important;
      border-bottom: 20px solid #fff !important;
  }
    .footer-comments-box .footer {
      position: unset !important;
    }
} */
// 517活动样式
.activity517 {
  background-color: #070101;
}
.no-more {
  text-align: center;
  font-size: 12px;
  color: #9b9b9b;
  .none {
    line-height: 50px;
  }
  .nothing {
    width: 70%;
    margin: 20px auto;
  }
}

#app {
  background: #fff;
  font-family: "Avenir", Helvetica, Arial, "Microsoft Yahei", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  margin: 0 auto;
  height: 100%;
  position: relative;
  left: 0;
  top: 0;
  font-size: 14px;
}
.detail {
  padding-bottom: 0.5rem;
}
.christmas {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99999;
}
* {
  position: relative;
  margin: 0;
  padding: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
body {
  /* background-color: #f4f4f4; */
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #fff;
  moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.aconfirmButtonClass.mint-msgbox-confirm {
  width: 100%;
}
.mint-msgbox {
  z-index: 9999;
}
a {
  text-decoration: none;
}
li {
  list-style: none;
}
img {
  display: block;
  width: 100%;
  height: auto;
}
input {
  outline: none;
}
button {
  outline: none;
}
.cf:before,
.cf:after {
  content: "";
  display: table;
}

.cf:after {
  clear: both;
}
.btns {
  height: 0.4rem;
  line-height: 0.4rem;
  text-align: center;
  width: 100%;
  border: none;
  background-color: #0073bc;
  color: #fff;
  font-size: 0.18rem;
  margin: 0.6rem auto;
  border-radius: 0.06rem;
}

.btns > a {
  display: block;
  width: 100%;
  height: auto;
  color: #fff;
}

.btns.w80 {
  margin: 0.6rem 10%;
  width: 80%;
}

.btns.w40 {
  width: 40%;
  margin: 0 auto;
}

.shuid {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10000;
}

.position {
  width: 40%;
  height: auto;
  display: block;
  margin: 0.8rem auto;
}

input,
textarea {
  -webkit-appearance: none;
}

.video-player {
  position: relative;
  z-index: 0;
}
.box {
  moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.mint-msgbox-btns {
  display: block;
}
.mint-msgbox-btn {
  height: 100%;
  flex: unset;
  float: left;
}
.mint-msgbox {
  transform: translate3d(-50%, -50%, 0);
  -ms-transform: translate3d(-50%, -50%, 0);
  -moz-transform: translate3d(-50%, -50%, 0);
  -webkit-transform: translate3d(-50%, -50%, 0);
  -o-transform: translate3d(-50%, -50%, 0);
}
.know-that {
  width: 100% !important;
}
// 推荐之星 样式
.circleTuijian {
  font-size: 12px;
  width: 50px;
  color: #9b9b9b;
}
.totalTuijian {
  position: absolute;
  top: 0;
  color: #9b9b9b;
  left: 3rem;
}
// 推荐之星样式
.iconTuiStar {
  left: 10px !important;
}
</style>
