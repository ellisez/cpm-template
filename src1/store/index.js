import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import base from './modules/base'
import setting from './modules/setting'
import ubt from './modules/UBT'
import content from './modules/content'
import userAmyxy from './modules/amyxy/user'
// import content from './modules/content'

Vue.use(Vuex)

// store创建工厂
class storeFactory {
  static getInstance = () => {
    const store = new Vuex.Store({
      modules: {
        user,
        base,
        setting,
        ubt,
        content
      }
    })
    switch (process.env.VUE_APP_AREA_CODE) {
      case 'AMYXY':
        // 注册嵌套模块 `user/custom`
        store.registerModule(['user', 'custom'], userAmyxy)
        break
      default:
        break
    }
    return store
  }
}

export default storeFactory.getInstance()
