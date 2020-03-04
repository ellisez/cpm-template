import storage from 'storejs'
import serviceAPI from '../../core/serviceAPI'
import dbtService from '../../api/serviceAPI'

const STORAGE_NAME = process.env.VUE_APP_STORAGE_NAME // 全局STORAGE名称

export default {
  namespaced: true,
  state: {
    userInfo: {}, // 用户信息
    userBaseInfo: {}, // 用户基本
    isAgree: false, // 是否已经同意
    isLogin: false, // 是否已经登入
    openId: (new Date()).valueOf(), // 默认openId
    inviteUid: '', // 邀请码
    isSetPassword: false, // 用户是否修改了密码
    uidStatus: true // 调用发消息接口状态
  },
  getters: {
    // 用户是否修改了密码
    isSetPassword (state) {
      return state.isSetPassword
    },
    // 是否已经同意
    isAgree (state) {
      return state.isAgree
    },
    // 是否已经登入
    isLogin (state) {
      return state.isLogin
    },
    // openId
    openId (state) {
      return state.openId
    },
    // 邀请码
    inviteUid (state) {
      return state.inviteUid
    },
    // 用户信息
    userInfo (state) {
      return state.userInfo
    }
  },
  mutations: {
    // 设置登录状态
    setLogin (state, isLogin) {
      state.isLogin = isLogin
    },
    // 设置邀请码
    setinviteUid (state, inviteUid) {
      //  读取storage
      let storageAmy = storage(STORAGE_NAME)
      if (!storageAmy) { // 该用户没登录==》去登陆完善信息==》上报关联信息
        storageAmy = {}
      }
      storageAmy.inviteUid = inviteUid
      storage({
        [STORAGE_NAME]: storageAmy
      })
      state.inviteUid = inviteUid
    },
    // 设置是否同意
    setAgree (state, bool) {
      //  读取storage
      let storageAmy = storage(STORAGE_NAME)
      if (!storageAmy) {
        storageAmy = {}
      }
      storageAmy.agreen = true
      storage({
        [STORAGE_NAME]: storageAmy
      })
      state.isAgree = bool
    },
    // 载入用户信息
    _loadUserInfo (state) {
      //  读取storage
      const storageMy = storage(STORAGE_NAME)
      console.log('storage信息', storageMy)
      if (storageMy) {
        // 存在时，设置用户信息

        // 是否已同意用户守则
        state.isAgree = storageMy.agreen || false

        // 是否保存过密码
        state.isSetPassword = storageMy.isSetPassword || false

        // 如果有encrypt则认为已经登陆了
        if (storageMy.encrypt) {
          state.isLogin = true
        }

        // 保持登入信息
        state.userInfo = {}
        state.userInfo.encrypt = storageMy.encrypt || null
        state.userInfo.userId = storageMy.userId || null
        state.userInfo.type = storageMy.type || null
        state.userInfo.userType = storageMy.userType || null
        state.userInfo.setPassword = storageMy.password || null
        state.userInfo.realnameAuthStatus = storageMy.realnameAuthStatus || null

        // 邀请码信息
        state.inviteUid = storageMy.inviteUid || null
      }
    },
    // 设置登录信息
    _setUserInfo (state, userInfo) {
      console.log('userInfo', userInfo)
      state.userInfo = {}
      state.userInfo.encrypt = userInfo.encrypt
      state.userInfo.userId = userInfo.data.userId
      state.userInfo.type = userInfo.data.type
      state.userInfo.userType = userInfo.data.userType
      state.userInfo.setPassword = userInfo.data.password
      state.userInfo.realnameAuthStatus = userInfo.data.realnameAuthStatus
    },

    // 设置用户类型
    _setUserType (state, data) {
      state.userInfo.type = data.type
      state.userInfo.realnameAuthStatus = data.realnameAuthStatus
      state.userInfo.userType = data.userType
    },
    // 设置用户基本信息
    _setUserBaseInfo (state, userBaseInfo) {
      state.userBaseInfo = userBaseInfo
    },
    // 设置是否已保存过密码
    _setIsSetPassword (state, bool) {
      //  读取storage
      let storageAmy = storage(STORAGE_NAME)
      if (!storageAmy) {
        storageAmy = {}
      }
      storageAmy.isSetPassword = bool
      storage({
        [STORAGE_NAME]: storageAmy
      })
      state.isSetPassword = bool
    }
  },
  actions: {
    // 用户信息初始化
    init ({
      commit,
      rootState,
      dispatch
    }) {
      // 如果子类重写了方法
      if (rootState.user.custom && rootState.user.custom.isComstInit) {
        dispatch('user/custom/init')
        return
      }
      // console.log('父类初始化');
      // 加载用户信息
      commit('_loadUserInfo')
    },
    // 保存用户信息
    save ({
      commit
    }, userInfo) {
      console.log('父类调用')
      //  读取storage
      let storageAmy = storage(STORAGE_NAME)
      if (!storageAmy) {
        storageAmy = {}
      }
      console.log(userInfo)
      if (userInfo.encrypt != '') {
        storageAmy.encrypt = userInfo.encrypt
      }
      storageAmy.userId = userInfo.data.userId
      storageAmy.type = userInfo.data.type
      storageAmy.userType = userInfo.data.userType
      storageAmy.setPassword = userInfo.data.password
      storageAmy.realnameAuthStatus = userInfo.data.realnameAuthStatus
      storage({
        [STORAGE_NAME]: storageAmy
      })
      commit('_setUserInfo', userInfo)
    },

    // //录入邀请人记录
    // async inviteSave({ state }, param) {
    //   const data = {
    //     inviteUid: state.inviteUid,
    //     beInviteUid: param.data.userId,
    //   }
    //   console.log(data)
    //   try {
    //     const res = await dbtService.inviteSave(data);
    //     console.log(res);
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },

    // 用户授权
    async authorize ({
      state,
      commit,
      dispatch,
      rootState
    }, params) {
      try {
        let userInfo
        if (Object.keys(params).length === 0) {
          // 如果没有输入任何值按照免密码登录
        } else if (params.password) {
          // 如果输入密码则密码登录
        } else {
          // 登录
          userInfo = await serviceAPI.login(params)
        }

        // 设置登录状态
        commit('setLogin', true)
        console.log(userInfo)
        // 如果子类重写了方法
        if (rootState.user.custom && rootState.user.custom.isComstSave) {
          // 保存登录信息
          dispatch('user/custom/save', userInfo)
        } else {
          // 保存登录信息
          dispatch('save', userInfo)
        }

        dispatch('save', userInfo)
        if (userInfo.data.mobile) {
          const data = {
            mobile: userInfo.data.mobile,
            token: userInfo.encrypt
          }
          try {
            const res = await dbtService.checkType(data)
            if (res.data) {
              const myUser = {
                userName: res.data.userName,
                mobile: res.data.mobile
              }
              const serviceData = {
                mobile: res.data.mobile,
                merchantCode: 'DBT',
                regSource: '6'
              }
              try {
                const newInfo = await dbtService.getBehalfInfo(serviceData)
                myUser.encrypt = newInfo.data.authResponse.token
                myUser.cid = newInfo.data.cid
              } catch (error) {
                console.log(error)
              }
              storage.set('userInfoAMY', myUser)
              storage.set('msgNum', 0)
              storage.set('msgCircle', true)
            } else {
              storage.set('userInfoAMY', '')
            }
          } catch (error) {
            console.log(error)
          }
        }

        // dispatch('save', userInfo);
        return userInfo
      } catch (error) {
        console.log('登录失败', error)
        commit('setLogin', false)
        // 不抛出异常，如果抛出会导致后续的js代码不执行
        throw error
      }
    },

    // 载入用户状态
    async loadUserType ({
      state,
      commit
    }) {
      try {
        console.log('载入用户状态')
        // 查询用户状态信息
        const userTypeInfo = await serviceAPI.getUserInfo({})
        // 设置用户状态
        commit('_setUserType', userTypeInfo.data)

        // 现在再次扫码要调用接口，不然绑定老用户的没法更新 去掉判断 (userTypeInfo.data.inviteUid !== state.inviteUid)
        // console.log('保存inviteUid', state.inviteUid && (userTypeInfo.data.inviteUid !== state.inviteUid) && state.userInfo.type !== 'A' && state.userInfo.userType !== 'A')
        if (state.inviteUid && state.userInfo.type !== 'A' && state.userInfo.userType !== 'A' && state.uidStatus) {
          console.log('inviteUidCheck', '请求发消息接口')
          await serviceAPI.inviteUidCheck({})
          state.uidStatus = false // 设置只有第一次扫码进来才会请求发消息
        }
      } catch (error) {
        console.log('获取用户状态失败', error)

        commit('setLogin', false)
        throw error
      }
    },
    // 获取验证码
    async getVcode (context, params) {
      try {
        // 查询用户状态信息
        await serviceAPI.getVcode(params)
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 保存用户基础信息信息
    async saveUserBaseInfo ({
      state
    }, params) {
      try {
        const res = await serviceAPI.saveUserBaseInfo(params)
        console.log(res)
        // 保存成功修改用户验证状态
        if (state.userInfo && state.userInfo.realnameAuthStatus === 'E') {
          state.userInfo.realnameAuthStatus = 'B'
        }
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 获取用户信息
    async getUserInfo () {
      try {
        // 查询用户状态信息
        const userInfo = await serviceAPI.getUserInfo({})
        return userInfo
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 消息列表
    async getNewsList () {
      try {
        // 查询用户状态信息
        const userInfo = await serviceAPI.getNewsList({})
        return userInfo
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 获取用户收藏列表
    /**
         * @param {Object} params-请求参数
         * @param {Number} params.pageNum-查询页数
         * @param {Number} params.PageSize-每页记录数
         */
    async getCollections (context, params) {
      try {
        // 查询用户状态信息
        const userInfo = await serviceAPI.getCollections(params)
        return userInfo
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 校验是否能够签到
    async isCanSign () {
      try {
        // 查询用户状态信息
        const data = await serviceAPI.checkSign()
        return data
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 签到
    async sign () {
      try {
        // 查询用户状态信息
        const data = await serviceAPI.sign()
        return data
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 查询最近一次签到记录
    async signLast () {
      try {
        // 查询用户状态信息
        const data = await serviceAPI.signLast()
        return data
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 获取药通云token
    async getCloudToken (context, params) {
      try {
        const userInfo = await dbtService.getBehalfInfo(params)
        return userInfo
      } catch (error) {
        // 抛出异常
        throw error
      }
    }
  }
}
