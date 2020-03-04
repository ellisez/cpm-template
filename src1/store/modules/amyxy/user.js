import storage from 'storejs'

const STORAGE_NAME = process.env.VUE_APP_STORAGE_NAME

export default {
  namespaced: true,
  state: {
    isComstInit: false, // 是否重写父类初始化
    isComstSave: false // 是否重写父类用户信息保存
  },
  getters: {

  },
  mutations: {
    // 载入用户信息
    _loadUserInfo (state, rootState) {
      //  读取storage
      console.log(STORAGE_NAME)
      const storageAmy = storage(STORAGE_NAME)
      console.log('storage信息', storageAmy)
      if (storageAmy) {
        // 存在时，设置用户信息
        // 是否已同意用户守则
        rootState.user.isAgree = storageAmy.agreen || false
        // 如果有encrypt则认为已经登陆了
        if (storageAmy.encrypt) {
          rootState.user.isLogin = true
        }

        // 保持登入信息
        rootState.user.userInfo = {}
        rootState.user.userInfo.encrypt = storageAmy.encrypt || null
        rootState.user.userInfo.userId = storageAmy.userId || null
        rootState.user.userInfo.type = storageAmy.type || null
        rootState.user.userInfo.userType = storageAmy.userType || null
        rootState.user.userInfo.setPassword = storageAmy.password || null
        rootState.user.userInfo.realnameAuthStatus = storageAmy.realnameAuthStatus || null
      }
    },
    // 设置登录信息
    _setUserInfo (state, { rootState, userInfo }) {
      console.log('userInfo', userInfo)
      rootState.user.userInfo = {}
      rootState.user.userInfo.encrypt = userInfo.encrypt
      rootState.user.userInfo.userId = userInfo.data.userId
      rootState.user.userInfo.type = userInfo.data.type
      rootState.user.userInfo.userType = userInfo.data.userType
      rootState.user.userInfo.setPassword = userInfo.data.password
      rootState.user.userInfo.realnameAuthStatus = userInfo.data.realnameAuthStatus
    }
  },
  actions:
  {
    // 用户信息初始化
    init ({ commit, rootState }) {
      console.log('子类初始化')
      // 加载用户信息
      commit('_loadUserInfo', rootState)
    },
    // 保存用户信息
    save ({ commit, rootState }, userInfo) {
      console.log('子类调用')
      //  读取storage
      const storageAmy = storage(STORAGE_NAME)
      storageAmy.encrypt = userInfo.encrypt
      storageAmy.userId = userInfo.data.userId
      storageAmy.type = userInfo.data.type
      storageAmy.userType = userInfo.data.userType
      storageAmy.setPassword = userInfo.data.password
      storageAmy.realnameAuthStatus = userInfo.data.realnameAuthStatus
      storage({ [STORAGE_NAME]: storageAmy })
      commit('_setUserInfo', { rootState, userInfo })
    }
  }
}
