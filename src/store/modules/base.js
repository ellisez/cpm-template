import serviceAPI from '../../core/serviceAPI'
import storage from 'storejs'

export default {
  state: {
    loading: true,
    netLoading: false,
    isWechat: false, // 是否为微信平台
    isAndroid: false, // 是否为安卓平台
    // checked: false,
    tabIndex: 0,
    platform: '', // 用户平台所在平台 WX：微信 IPH：苹果 ADR：安卓  PC：电脑
    isInit: false, // 是否已经初始化
    authorizeBeforePath: '' // 身份验证前（login，agree，setting）的路径，用于登录后跳转
  },
  getters: {
    // 页面是否加载
    loading: state => state.loading,
    // 请求中
    netLoading: state => state.netLoading,
    // 是否是微信登录的
    isWechat: state => state.isWechat,
    // 是否为安卓平台
    isAndroid: state => state.isAndroid,
    // 用户平台所在平台
    platform: state => state.platform,

    appid: state => process.env.VUE_APP_APPID,
    // checked: state => {
    //   return state.checked
    // }
    authorizeBeforePath: state => state.authorizeBeforePath
  },
  mutations: {
    // 展示加载页面
    showLoad (state) {
      state.loading = true
    },
    // 隐藏加载页面
    hideLoad (state) {
      state.loading = false
    },
    // 展示加载页面
    showNetLoad (state) {
      state.netLoading = true
    },
    // 隐藏加载页面
    hideNetLoad (state) {
      state.netLoading = false
    },
    // 设置Tab组件的索引
    setTabIndex (state, index) {
      state.tabIndex = index
    },
    // 设置已经初始化
    setInited (state) {
      state.isInit = true
    },
    // 设置验证前页面路径
    setAuthorizeBeforePath (state, path) {
      state.authorizeBeforePath = path
    },
    // 设置平台信息
    setPlatform (state) {
      try {
        const userAgent = navigator.userAgent
        const isWechat = /MicroMessenger/i.test(userAgent)
        if (isWechat) {
          state.platform = 'WX'
          state.isWechat = true
        } else {
          const isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1
          const isIOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
          if (isIOS) {
            state.platform = 'IPH'
          } else if (isAndroid) {
            state.platform = 'ADR'
            state.isAndroid = true
          } else {
            state.platform = 'PC'
          }
        }
      } catch (error) {
        state.platform = ''
        state.isWechat = false
        state.isAndroid = false
      }
    }

  },
  actions: {
    // 初始化
    init ({ state, dispatch, commit }) {
      if (state.isInit) {
        return
      }

      // 获取平台信息
      commit('setPlatform')
      // 调用用户初始化
      dispatch('user/init')
      // 设置已经初始化
      commit('setInited')
    }
  }
}
