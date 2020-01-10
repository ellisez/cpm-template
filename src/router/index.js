import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import storage from 'storejs'

Vue.use(Router)

// 记录登录或配置信息前的访问页面
function setAuthorizeBeforePath (to) {
  if (to.name !== 'agree' && to.name !== 'login' && to.name !== 'setting') {
    console.log('记录访问页面', to.fullPath)
    store.commit('setAuthorizeBeforePath', to.fullPath)
  }
}

// 基础路由
function baseRouter () {
  const Login = resolve => {
    require.ensure(['@/components/login/login'], () => {
      resolve(require('@/components/login/login'))
    })
  }
  const Index = resolve => {
    require.ensure(['@/components/index/index'], () => {
      resolve(require('@/components/index/index'))
    })
  }
  const Home = resolve => {
    require.ensure(['@/components/home/Home'], () => {
      resolve(require('@/components/home/Home'))
    })
  }
  const Information = resolve => { // 百家讲坛集
    require.ensure(['@/components/pages/information'], () => {
      resolve(require('@/components/pages/information'))
    })
  }
  const Newsletter = resolve => { // 新时讯汇编
    require.ensure(['@/components/pages/newsletter'], () => {
      resolve(require('@/components/pages/newsletter'))
    })
  }
  const Youngspeakers = resolve => { // 青年演说家
    require.ensure(['@/components/pages/youngspeakers'], () => {
      resolve(require('@/components/pages/youngspeakers'))
    })
  }
  const Academicsync = resolve => { // 学术同期声
    require.ensure(['@/components/pages/academicsync'], () => {
      resolve(require('@/components/pages/academicsync'))
    })
  }
  const Setting = resolve => { // 完善信息
    require.ensure(['@/components/pages/setting'], () => {
      resolve(require('@/components/pages/setting'))
    })
  }
  const Frontier = resolve => { // 前沿资讯
    require.ensure(['@/components/pages/frontier'], () => {
      resolve(require('@/components/pages/frontier'))
    })
  }
  const Informationlists = resolve => { // 百家讲坛集列表
    require.ensure(['@/components/pages/informationLists'], () => {
      resolve(require('@/components/pages/informationLists'))
    })
  }
  // const Interview = resolve => { // 超级访谈
  //   require.ensure(['@/components/pages/interview'], () => {
  //     resolve(require('@/components/pages/interview'))
  //   })
  // }
  const Discuss = resolve => { // 添加评论
    require.ensure(['@/components/pages/discuss'], () => {
      resolve(require('@/components/pages/discuss'))
    })
  }
  const Self = resolve => { // 添加评论
    require.ensure(['@/components/pages/self'], () => {
      resolve(require('@/components/pages/self'))
    })
  }
  const Msg = resolve => { // 消息通知
    require.ensure(['@/components/pages/msg'], () => {
      resolve(require('@/components/pages/msg'))
    })
  }
  const Collection = resolve => { // 我的收藏
    require.ensure(['@/components/pages/collection'], () => {
      resolve(require('@/components/pages/collection'))
    })
  }
  const DailyMusion = resolve => { // 日常任务
    require.ensure(['@/components/pages/dailyMusion'], () => {
      resolve(require('@/components/pages/dailyMusion'))
    })
  }
  const Ranking = resolve => { // 排行榜
    require.ensure(['@/components/pages/ranking'], () => {
      resolve(require('@/components/pages/ranking'))
    })
  }
  const Mydiscussion = resolve => { // 互动讨论
    require.ensure(['@/components/pages/mydiscussion'], () => {
      resolve(require('@/components/pages/mydiscussion'))
    })
  }
  const Question = resolve => { // 提问
    require.ensure(['@/components/pages/question'], () => {
      resolve(require('@/components/pages/question'))
    })
  }
  const Challenge = resolve => { // 大人挑战
    require.ensure(['@/components/pages/challenge'], () => {
      resolve(require('@/components/pages/challenge'))
    })
  }
  const UpAuthImg = resolve => { // 认证信息
    require.ensure(['@/components/pages/upAuthImg'], () => {
      resolve(require('@/components/pages/upAuthImg'))
    })
  }
  const AnswerList = resolve => { // 问题列表页   通过学术同期声“更多”进入
    require.ensure(['@/components/pages/answerList'], () => {
      resolve(require('@/components/pages/answerList'))
    })
  }
  const MyMeeting = resolve => { // 我的会议
    require.ensure(['@/components/pages/myMeeting'], () => {
      resolve(require('@/components/pages/myMeeting'))
    })
  }
  const Survey = resolve => { // 调研
    require.ensure(['@/components/pages/survey'], () => {
      resolve(require('@/components/pages/survey'))
    })
  }
  const SearchArticel = resolve => { // 搜索1
    require.ensure(['@/components/search/article'], () => {
      resolve(require('@/components/search/article'))
    })
  }
  const SearchVideo = resolve => { // 搜索2
    require.ensure(['@/components/search/video'], () => {
      resolve(require('@/components/search/video'))
    })
  }
  const SearchQuestion = resolve => { // 搜索3
    require.ensure(['@/components/search/question'], () => {
      resolve(require('@/components/search/question'))
    })
  }
  const ArticleDetail = resolve => { // 文章详情
    require.ensure(['@/components/details/articleDetail'], () => {
      resolve(require('@/components/details/articleDetail'))
    })
  }
  const VideoDetail = resolve => { // 视频详情
    require.ensure(['@/components/details/videoDetail'], () => {
      resolve(require('@/components/details/videoDetail'))
    })
  }
  const MeetingDetail = resolve => { // 会议详情
    require.ensure(['@/components/details/meetingDetail'], () => {
      resolve(require('@/components/details/meetingDetail'))
    })
  }
  const AnswerDetail = resolve => { // 会议详情
    require.ensure(['@/components/details/answerDetail'], () => {
      resolve(require('@/components/details/answerDetail'))
    })
  }
  const PlayerDetail = resolve => { // 会议详情
    require.ensure(['@/components/details/playerDetail'], () => {
      resolve(require('@/components/details/playerDetail'))
    })
  }
  const answer = resolve => { // 回答问题
    require.ensure(['@/components/pages/answer/answer'], () => {
      resolve(require('@/components/pages/answer/answer'))
    })
  }
  const Activity517 = resolve => { // 517活动
    require.ensure(['@/components/pages/activity517'], () => {
      resolve(require('@/components/pages/activity517'))
    })
  }
  const Activity819 = resolve => { // 819活动 代表端
    require.ensure(['@/components/pages/activity819/dbd'], () => {
      resolve(require('@/components/pages/activity819/dbd'))
    })
  }
  const myTask = resolve => { // 819活动 代表端-我的任务
    require.ensure(['@/components/pages/activity819/dbd/myTask'], () => {
      resolve(require('@/components/pages/activity819/dbd/myTask'))
    })
  }
  const nlxfq = resolve => { // 819活动 代表端-纳凉先锋墙
    require.ensure(['@/components/pages/activity819/dbd/nlxfq'], () => {
      resolve(require('@/components/pages/activity819/dbd/nlxfq'))
    })
  }
  const hdgz = resolve => { // 819活动 代表端-活动规则
    require.ensure(['@/components/pages/activity819/dbd/hdgz'], () => {
      resolve(require('@/components/pages/activity819/dbd/hdgz'))
    })
  }
  const activity819ysd = resolve => { // 819活动 医生端-首页
    require.ensure(['@/components/pages/activity819/ysd'], () => {
      resolve(require('@/components/pages/activity819/ysd'))
    })
  }
  const jfrw = resolve => { // 819活动 医生端-积分任务页面
    require.ensure(['@/components/pages/activity819/ysd/jfrw'], () => {
      resolve(require('@/components/pages/activity819/ysd/jfrw'))
    })
  }
  const style819 = resolve => { // 819活动 医生端-风采卡
    require.ensure(['@/components/pages/activity819/ysd/fck'], () => {
      resolve(require('@/components/pages/activity819/ysd/fck'))
    })
  }
  // 代表端
  const myDBT = () => import('../components/dbt/my')
  const searchDBT = () => import('../components/dbt/search')
  const meetingApplayDBT = () => import('../components/dbt/meetingApplay')
  const myCustomerDBT = () => import('../components/dbt/myCustomer')
  const newMsgDBT = () => import('../components/dbt/newMsg')
  const doctorDetailDBT = () => import('../components/dbt/doctorDetail')
  const sendDBT = () => import('../components/dbt/send')
  const qrCodeDBT = () => import('../components/dbt/qrCode')
  const posterDBT = () => import('../components/dbt/poster')
  const saveDBT = () => import('../components/dbt/save')
  const helpListDBT = () => import('../components/dbt/helpList')
  const helpDetailDBT = () => import('../components/dbt/helpDetail')
  const sharePosterDBT = () => import('../components/dbt/sharePoster')
  const recommendRule = resolve => { // 评选规则
    require.ensure(['@/components/pages/recommendRule'], () => {
      resolve(require('@/components/pages/recommendRule'))
    })
  }

  const router = [
    {
      path: '/activity517',
      name: 'activity517',
      component: Activity517,
      meta: {
        backIndex: true
      }
    },
    {
      path: '/activity819',
      name: 'activity819',
      component: Activity819
    },
    {
      path: '/activity819ysd',
      name: 'activity819ysd',
      component: activity819ysd,
      meta: {
        backIndex: true
      }
    },
    {
      path: '/mytask',
      name: 'myTask',
      component: myTask
    },
    {
      path: '/nlxfq',
      name: 'nlxfq',
      component: nlxfq
    },
    {
      path: '/hdgz',
      name: 'hdgz',
      component: hdgz,
      meta: {
        backIndex: true
      }
    },
    {
      path: '/jfrw',
      name: 'jfrw',
      component: jfrw,
      meta: {
        backIndex: true
      }
    },
    {
      path: '/style819',
      name: 'style819',
      component: style819,
      meta: {
        backIndex: true
      }
    },
    {
      path: '/recommendRule',
      name: 'recommendRule',
      component: recommendRule,
      meta: {
        backIndex: true
      }
    },
    {
      path: '/searchArticle',
      name: 'searchArticle',
      component: SearchArticel,
      meta: {
        backIndex: true
      }
    },
    {
      path: '/searchVideo',
      name: 'searchVideo',
      component: SearchVideo,
      meta: {
        backIndex: true
      }
    },
    {
      path: '/searchQuestion',
      name: 'searchQuestion',
      component: SearchQuestion,
      meta: {
        backIndex: true
      }
    },
    {
      path: '/mymeeting',
      name: 'mymeeting',
      component: MyMeeting,
      meta: {
        backIndex: true
      }
    },

    // 代表路由配置
    {
      path: '/survey',
      name: 'survey',
      component: Survey,
      meta: {
      }
    },
    {
      path: '/sharePosterDBT',
      name: 'sharePosterDBT',
      component: sharePosterDBT,
      meta: {
        title: '邀请海报保存'
        // backIndex: true,
      }
    },
    {
      path: '/saveDBT',
      name: 'saveDBT',
      component: saveDBT,
      meta: {
        title: '邀请海报保存'
        // backIndex: true,
      }
    },
    {
      path: '/posterDBT',
      name: 'posterDBT',
      component: posterDBT,
      meta: {
        title: '邀请海报'
        // backIndex: true,
      }
    },
    {
      path: '/qrCodeDBT',
      name: 'qrCodeDBT',
      component: qrCodeDBT,
      meta: {
        title: '代表二维码'
        // backIndex: true,
      }
    },
    {
      path: '/sendDBT',
      name: 'sendDBT',
      component: sendDBT,
      meta: {
        title: '代表推送',
        backIndex: true
      }
    },
    {
      path: '/doctorDetailDBT',
      name: 'doctorDetailDBT',
      component: doctorDetailDBT,
      meta: {
        title: '代表医生详情',
        backIndex: true,
        backTop: true
      }
    },
    {
      path: '/newMsgDBT',
      name: 'newMsgDBT',
      component: newMsgDBT,
      meta: {
        title: '消息通知',
        backIndex: true,
        backTop: true
      }
    },
    {
      path: '/myCustomerDBT',
      name: 'myCustomerDBT',
      component: myCustomerDBT,
      meta: {
        title: '代表客户列表',
        backIndex: true
        // backTop: true
      }
    },
    {
      path: '/meetingApplayDBT',
      name: 'meetingApplayDBT',
      component: meetingApplayDBT,
      meta: {
        title: '代表会议申请',
        backIndex: true
      }
    },
    {
      path: '/searchDBT',
      name: 'searchDBT',
      component: searchDBT,
      meta: {
        title: '代表搜索'
        // backIndex: true,
        // backTop: true
      }
    },
    {
      path: '/myDBT',
      name: 'myDBT',
      component: myDBT,
      meta: {
        title: '代表个人中心',
        backIndex: true
      }
    },
    {
      path: '/helpListDBT',
      name: 'helpListDBT',
      component: helpListDBT,
      meta: {
        title: '帮助文档',
        backIndex: true
      }
    },
    {
      path: '/helpDetailDBT',
      name: 'helpDetailDBT',
      component: helpDetailDBT,
      meta: {
        title: '帮助详情',
        backIndex: true
        // backTop: true
      }
    },
    // 代表路由配置
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        NotAuth: true // 当前页面不需要验证
      }
    },
    {
      path: '/answerList',
      name: 'answerList',
      component: AnswerList,
      meta: {
        backIndex: true
      }
    },
    {
      path: '/upauthimg',
      name: 'upauthimg',
      component: UpAuthImg,
      meta: {

      }
    },
    {
      path: '/challenge',
      name: 'challenge',
      component: Challenge,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/question',
      name: 'question',
      component: Question,
      meta: {

      }
    },
    {
      path: '/mydiscussion',
      name: 'mydiscussion',
      component: Mydiscussion,
      meta: {
        keepAlive: true,
        backIndex: true
      }
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: Ranking,
      meta: {
        backIndex: true
      }
    },
    {
      path: '/dailymusion',
      name: 'dailymusion',
      component: DailyMusion,
      meta: {

        backIndex: true
      }
    },
    {
      path: '/collection',
      name: 'collection',
      component: Collection,
      meta: {

        backIndex: true
      }
    },
    {
      path: '/msg',
      name: 'msg',
      component: Msg,
      meta: {

        backIndex: true
      }
    },
    {
      path: '/self',
      name: 'self',
      component: Self,
      meta: {

      }
    },
    // {
    //   path: '/interview',
    //   name: 'interview',
    //   component: Interview,
    //   meta: {

    //   },
    // },
    {
      path: '/discuss',
      name: 'discuss',
      component: Discuss,
      meta: {

      }
    },
    {
      path: '/frontier',
      name: 'frontier',
      component: Frontier,
      meta: {
        backIndex: true
      }
    },
    {
      path: '/informationlists',
      name: 'informationlists',
      component: Informationlists,
      meta: {
        backIndex: true
      }
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/answerDetail',
      name: 'answerDetail',
      component: AnswerDetail,
      meta: {
        backIndex: true,
        backTop: true
      }
    },
    {
      path: '/meetingDetail',
      name: 'meetingDetail',
      component: MeetingDetail,
      meta: {
        backIndex: true,
        backTop: true
      }
    },
    {
      path: '/playerDetail',
      name: 'playerDetail',
      component: PlayerDetail,
      meta: {
        backIndex: true,
        backTop: true
      }
    },
    {
      path: '/articleDetail',
      name: 'articleDetail',
      component: ArticleDetail,
      meta: {
        backIndex: true,
        backTop: true
      }
    },
    {
      path: '/videoDetail',
      name: 'videoDetail',
      component: VideoDetail,
      meta: {
        backIndex: true,
        backTop: true
      }
    },

    {
      path: '/answer',
      name: 'answer',
      component: answer,
      meta: {
        title: '我要回答'
      }
    },
    {
      path: '/newsletter',
      name: 'newsletter',
      component: Newsletter,
      meta: {
        backIndex: true
      }
    },
    {
      path: '/',
      component: Index,
      children: [
        {
          path: '/',
          name: 'home',
          component: Home
        },
        {
          path: '/academicsync',
          name: 'academicsync',
          component: Academicsync
        },
        {
          path: '/youngspeakers',
          name: 'youngspeakers',
          component: Youngspeakers
        },
        {
          path: '/information',
          name: 'information',
          component: Information
        }
      ]
    }
  ]
  return router
}

// router对象工厂
function routerFactory () {
  let routers = baseRouter()
  const routerObj = new Router({ routes: routers })

  // 全局router守卫
  routerObj.beforeEach(async (to, from, next) => {
    // 记录当前页面信息到缓存
    if (to.name != 'login' &&
      to.name != 'setting' &&
      to.name != 'upauthimg' &&
      to.name != 'survey'
    ) {
      storage.set(`${process.env.VUE_APP_STORAGE_NAME}from`, {
        path: to.path,
        query: to.query
      })
    }
    // 获取路由配置
    await store.dispatch('init')

    // 如果query中存在inviteUid的场合，则记录inviteUid
    if (to.query && to.query.inviteUid) {
      store.commit('user/setinviteUid', to.query.inviteUid)
    }

    // 是否已经登陆
    const isLogin1 = store.getters['user/isLogin']
    // 如果query中存在appencrypt的场合，重新登录验证
    if (location.href.indexOf('appencrypt') > 0 && !isLogin1) {
      let url = location.href
      url = url.split('#/')[0]
      url = url.split('?')[1]
      url = url.split('&')[0]
      const appencrypt = url.split('=')[1]
      try {
        await store.dispatch('user/authorize', { appencrypt })
      } catch (error) {
        console.log('app登录错误')
        // Toast('app登录错误')
      }
    }
    // 是否已经登陆
    const isLogin = store.getters['user/isLogin']

    // 不需要登录的页面
    if (
      to.name == 'articleDetail' ||
      to.name == 'videoDetail' ||
      to.name == 'meetingDetail' ||
      to.name == 'sharePosterDBT' ||
      to.name == 'activity517' ||
      to.name == 'activity819ysd' ||
      to.name == 'answerDetail'
    ) {
      next()
      return
    }
    // 读取配置是否用户校验
    const isAuthorize=process.env.VUE_APP_ROUTE_IS_AUTHORIZE==='true'?true:false;
    if (isAuthorize) {
      // 如果站点不需要验证时next（到原始访问）
      if (to.meta.NotAuth) {
        next()
        return
      }

      if (!isLogin && to.name != 'login') {
        console.log(to.name, '没有登录')
        // 如果用户没登录  跳转到登录页
        if (!isLogin && to.name !== 'login') {
          next({
            path: '/login',
            replace: true
          })
          return
        }
      }
    } else if (!isLogin) {
      console.log('免密登录》》》》》》》》》》》》》》》》》')
      // 不需要用户验证的场合，如果没有登录则自动登录
      await store.dispatch('user/authorize', {})
    }
    // 读取配置
    // 是否在路由的时候验证用户是否是高级用户，如果不是高级用户时，跳转至setting页面
    const isToSetting=process.env.VUE_APP_ROUTE_IS_TO_SETTING==='true'?true:false;
    if (isLogin && isToSetting) {
      console.log(isLogin, isToSetting, '我是登录状态')
      // 重新加载用户状态
      try {
        await store.dispatch('user/loadUserType')
      } catch (error) {
        // 加载用户状态失败
        next({
          path: '/login',
          replace: true
        })
      }
      const userInfo = store.getters['user/userInfo']
      console.log('用户信息', userInfo)
      // 本地缓存更新用户信息
      storage.set(process.env.VUE_APP_STORAGE_NAME, userInfo)
      if (to.name == 'upauthimg') { // 认证页直接跳转
        next()
        return
      }
      const userInfoAMY = storage('userInfoAMY')
      if (userInfo.userType === 'A' && to.name != 'setting' && !userInfoAMY) { // 低级用户跳转到完善信息页
        setAuthorizeBeforePath(to)
        next({
          path: '/setting',
          replace: true
        })
        return
      }
    }
    const userInfo = storage('userInfoAMY')
    if (userInfo && !userInfo.encrypt) {
      const data = {
        mobile: userInfo.mobile,
        merchantCode: 'DBT',
        regSource: '6'
      }
      try {
        const res = await store.dispatch('user/getCloudToken', data)
        userInfo.encrypt = res.data.authResponse.token
        userInfo.cid = res.data.cid
        storage.set('userInfoAMY', userInfo)
      } catch (error) {
        console.log(error)
      }
    }

    next()
  })

  return routerObj
}

export default routerFactory()
