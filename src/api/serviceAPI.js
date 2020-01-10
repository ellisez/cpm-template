import requstHelper from './requstHelper'
import storage from 'storejs'

class serviceApi {
	static AREA_CODE = process.env.VUE_APP_AREA_CODE; // 区域号
	static COMPANY_CODE = process.env.VUE_APP_COMPANY_CODE; // 公司号

	// 默认构造函数
	constructor () {
	  return this
	}

	// 查询是否是代表
	static checkType = (params) => {
	  const userInfo = storage(`userInfoAMY`) || {}
	  const myParams = params
	  myParams.mobile = params.mobile
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  return requstHelper.fetch(
	    '/acct/amy/check/behalf',
	    myParams,
	    {
	      header: {
	        // token: userInfo.encrypt || myParams.token
	      },
	      method: 'GET'
	    },
	    true
	  )
	};

	// 获取用户信息
	static getUserInfo = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const myParams = params || {}
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  return requstHelper.fetch(
	    '/accounts/mobile/base/info',
	    myParams,
	    {
	      header: {
	        token: userInfo.encrypt
	      },
	      method: 'GET'
	    },
	    true
	  )
	};

	// 获取消息通知
	static getNews = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const doctorInfo = storage(`amyxy`)
	  const myParams = params || {}
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  myParams.userId = doctorInfo.userId // 公司号
	  return requstHelper.fetch(
	    '/message/page/list',
	    myParams,
	    {
	      header: {
	        token: userInfo.encrypt
	      },
	      method: 'GET'
	    },
	    true
	  )
	};

	// 获取我的客户doctorDetail
	static myCustomer = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const doctorInfo = storage(`amyxy`)
	  const myParams = params || {}
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  myParams.userId = doctorInfo.userId // 公司号
	  return requstHelper.fetch(
	    '/acct/amy/doctor/list',
	    myParams,
	    {
	      header: {
	        token: userInfo.encrypt
	      },
	      method: 'GET'
	    },
	    true
	  )
	};

	// 医生详情
	static doctorDetail = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const doctorInfo = storage(`amyxy`)
	  const myParams = params || {}
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  myParams.userId = doctorInfo.userId // 公司号
	  return requstHelper.fetch(
	    '/acct/amy/doctor/info',
	    myParams,
	    {
	      header: {
	        token: userInfo.encrypt
	      },
	      method: 'GET'
	    },
	    true
	  )
	};

	// 省市区级联信息获取
	static getDistrict = (params) => {
	  const myParams = params
	  const userInfo = storage(`userInfoAMY`)
	  return requstHelper.fetch('/sys/district/list', myParams, {
	    header: {
	      token: userInfo.encrypt
	    }
	  })
	};

	// 发送站内信
	static share = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const doctorInfo = storage(`amyxy`)
	  const myParams = params || {}
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  myParams.userId = doctorInfo.userId // 公司号
	  return requstHelper.fetch(
	    '/common/share/save',
	    myParams,
	    {
	      header: {
	        token: userInfo.encrypt
	      }
	    },
	    true
	  )
	};

	// 获取已申请会议
	static getDate = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const myParams = params || {}
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  return requstHelper.fetch(
	    '/apply/meeting/place/get',
	    myParams,
	    {
	      header: {
	        token: userInfo.encrypt
	      }
	    },
	    true
	  )
	};

	// 申请会议
	static applayMeeting = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const doctorInfo = storage(`amyxy`)
	  const myParams = params || {}
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  myParams.userId = doctorInfo.userId
	  return requstHelper.fetch(
	    '/apply/meeting/place/kill',
	    myParams,
	    {
	      header: {
	        token: userInfo.encrypt
	      }
	    },
	    true
	  )
	};

	// 取消会议
	static cancleMeeting = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const doctorInfo = storage(`amyxy`)
	  const myParams = params || {}
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  myParams.userId = doctorInfo.userId
	  return requstHelper.fetch(
	    '/apply/meeting/place/modify',
	    myParams,
	    {
	      header: {
	        token: userInfo.encrypt
	      }
	    },
	    true
	  )
	};

	// 邀请动态
	static getInvite = (params) => {
	  // const userInfo = storage(`userInfoAMY`);
	  const userInfo = storage(`userInfoAMY`)
	  const doctorInfo = storage(`amyxy`)
	  const myParams = params || {}
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  myParams.userId = doctorInfo.userId
	  myParams.mobile = userInfo.mobile
	  return requstHelper.fetch(
	    '/acct/amy/invite/dynamic/get',
	    myParams,
	    {
	      header: {
	        token: userInfo.encrypt
	      },
	      method: 'GET'
	    },
	    true
	  )
	};

	// 医院列表
	static searchHospital = (params) => {
	  // const userInfo = storage(`userInfoAMY`);
	  const userInfo = storage(`userInfoAMY`)
	  const myParams = params || {}
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  myParams.mobile = userInfo.mobile
	  return requstHelper.fetch(
	    '/acct/amy/search',
	    myParams,
	    {
	      header: {
	        token: userInfo.encrypt
	      },
	      method: 'GET'
	    },
	    true
	  )
	};

	// 获取医院医生列表
	static hosDoctor = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const myParams = params
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  myParams.userId = userInfo.userId // 公司号
	  return requstHelper.fetch(
	    '/acct/amy/hosp/info',
	    params,
	    {
	      header: {
	        token: userInfo.encrypt
	      },
	      method: 'GET'
	    },
	    true
	  )
	};

	// 获取医院医生列表
	static hosDoctor = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const doctorInfo = storage(`amyxy`)
	  const myParams = params
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  myParams.userId = doctorInfo.userId // 公司号
	  return requstHelper.fetch(
	    '/acct/amy/hosp/info',
	    params,
	    {
	      header: {
	        token: userInfo.encrypt
	      },
	      method: 'GET'
	    },
	    true
	  )
	};

	// 取消邀请
	static inviteSave = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const doctorInfo = storage(`amyxy`)
	  const myParams = params
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  myParams.inviteUid = doctorInfo.userId // 公司号
	  return requstHelper.fetch(
	    '/acct/amy/user/invite/save',
	    params,
	    {
	      header: {
	        token: userInfo.encrypt
	      }
	    },
	    true
	  )
	};

	// 首页数据获取----目标医生
	static customerData = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const doctorInfo = storage(`amyxy`)
	  const myParams = params
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  myParams.userId = doctorInfo.userId // 公司号
	  return requstHelper.fetch(
	    '/acct/amy/customer/data',
	    params,
	    {
	      header: {
	        token: userInfo.encrypt
	      },
	      method: 'GET'
	    },
	    true
	  )
	};

	// 取消关联
	static inviteCancel = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const doctorInfo = storage(`amyxy`)
	  const myParams = params
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  myParams.inviteUid = doctorInfo.userId // 公司号
	  return requstHelper.fetch(
	    '/acct/amy/user/invite/cancel',
	    params,
	    {
	      header: {
	        token: userInfo.encrypt
	      }
	    },
	    true
	  )
	};

	// 信息已读状态修改
	static messageModify = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const myParams = params
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  myParams.userId = userInfo.userId // 公司号
	  return requstHelper.fetch('/message/modify', myParams, {
	    header: {
	      token: userInfo.encrypt
	    }
	  })
	};

	// 信息已读状态修改
	static messageModify = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const doctorInfo = storage(`amyxy`)
	  const myParams = params
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
	  myParams.userId = doctorInfo.userId // 公司号
	  return requstHelper.fetch('/message/modify', myParams, {
	    header: {
	      token: userInfo.encrypt
	    }
	  })
	};

	// 首页数据获取----目标医生
	static getBehalfInfo = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const myParams = params
	  return requstHelper.fetch(
	    '/wx/user/info',
	    params,
	    {
	      header: {}
	    },
	    true
	  )
	};

	// 根据任务难度查询任务
	static queryTaskInfoByDifficulty = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const myParams = params
	  myParams.userId = userInfo.cid // 公司号
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  return requstHelper.fetch(
	    '/sy/dTask/queryTaskInfoByDifficulty',
	    myParams,
	    {
	      header: {
	        token: userInfo.encrypt
	      }
	    },
	    false,
	    true
	  )
	};
	// 根据id查看详情
	static queryTaskDesc = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const myParams = params
	  return requstHelper.fetch(
	    '/sy/dTask/queryTaskDesc',
	    myParams,
	    {
	      header: {
	        token: userInfo.encrypt
	      }
	    },
	    false,
	    true
	  )
	};
	// 做任务改变分值
	static updateValueByType = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const myParams = params
	  myParams.userId = userInfo.cid // 公司号
	  myParams.text1 = serviceApi.AREA_CODE // 公司号
	  return requstHelper.fetch(
	    '/sy/dTask/updateValueByType',
	    myParams,
	    {
	      header: {
	        token: userInfo.encrypt
	      }
	    },
	    false,
	    true
	  )
	};
	// 代表领取并保存任务
	static saveRepresentationalAndDetail = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const myParams = params
	  myParams.userId = userInfo.cid // 公司号
	  myParams.text1 = serviceApi.AREA_CODE // 公司号
	  return requstHelper.fetch(
	    '/sy/dTask/saveRepresentationalAndDetail',
	    myParams,
	    {
	      header: {
	        token: userInfo.encrypt
	      }
	    },
	    false,
	    true
	  )
	};
	// 我的任务 和 纳凉先锋墙
	static resultRepresentationalInfo = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const myParams = params
	  myParams.userId = userInfo.cid // 公司号
	  myParams.text1 = serviceApi.AREA_CODE // 公司号
	  return requstHelper.fetch(
	    '/sy/dTask/resultRepresentationalInfo',
	    myParams,
	    {
	      header: {
	        token: userInfo.encrypt
	      }
	    },
	    false,
	    true
	  )
	};
	// 修改头像地址
	static updateUserBase = (params) => {
	  const userInfo = storage(`userInfoAMY`)
	  const myParams = params
	  myParams.userId = userInfo.cid // 公司号
	  myParams.areaCode = serviceApi.AREA_CODE // 区域号
	  return requstHelper.fetch(
	    'sy/dTask/updateUserBase',
	    myParams,
	    {
	      header: {
	        token: userInfo.encrypt
	      }
	    },
	    false,
	    true
	  )
	};
}

export default serviceApi
