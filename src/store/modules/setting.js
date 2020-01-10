import serviceAPI from '../../core/serviceAPI'

export default {
  namespaced: true,
  state: {
    hospital: {}, // 医院信息
    authImg: {
      badgePhotoUrl: '', // 身份证
      idCardUrl: '', // 工牌
      healthCarePhotoUrl: '', // 卫生执照信息页照片
      healthCarePersonalUrl: '' // 卫生执照个人页照片
    }
  },
  getters: {
    // 获取医院信息
    hospital (state) {
      return state.hospital
    },
    // 获取验证图片
    authImg (state) {
      return state.authImg
    },
    // 获取是否进行了图片验证
    isAuthImg (state) {
      return state.authImg.badgePhotoUrl || state.authImg.idCardUrl ||
       state.authImg.healthCarePhotoUrl || state.authImg.healthCarePersonalUrl
    }
  },
  mutations: {
    // 设置医院信息
    setHospital (state, hospital) {
      state.hospital = hospital
    },
    // 设置认证图片
    setAuthImg (state, { url, type }) {
      switch (type) {
        case 'badgePhotoUrl':
          state.authImg.healthCarePhotoUrl = ''
          state.authImg.healthCarePersonalUrl = ''
          state.authImg.badgePhotoUrl = url
          break
        case 'idCardUrl':
          state.authImg.healthCarePhotoUrl = ''
          state.authImg.healthCarePersonalUrl = ''
          state.authImg.idCardUrl = url
          break
        case 'healthCarePhotoUrl':
          state.authImg.badgePhotoUrl = ''
          state.authImg.idCardUrl = ''
          state.authImg.healthCarePhotoUrl = url
          break
        case 'healthCarePersonalUrl':
          state.authImg.badgePhotoUrl = ''
          state.authImg.idCardUrl = ''
          state.authImg.healthCarePersonalUrl = url
          break
        default:
          break
      }
    }
  },
  actions: {

    // 获取城市列表
    async getCitys () {
      try {
        // 查询用户基础信息
        const citys = await serviceAPI.getCitys()
        return citys
      } catch (error) {
        // 抛出异常
        throw error
      }
    }
  }
}
