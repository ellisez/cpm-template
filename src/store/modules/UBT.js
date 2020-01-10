import serviceAPI from '../../core/serviceAPI'

export default {
  namespaced: true,
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    // 埋点
    /**
     */
    async baoSaveReport (context, params) {
      try {
        const article = await serviceAPI.baoSaveReport(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 获取系统时间
    /**
     */
    async getSysTime (context, params) {
      try {
        const article = await serviceAPI.getSysTime(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    }
  }
}
