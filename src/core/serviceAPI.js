import storage from 'storejs'
import requstHelper from './requstHelper'
import store from '../store'

class serviceApi {
    static AREA_CODE = process.env.VUE_APP_AREA_CODE; // 区域号
    static COMPANY_CODE = process.env.VUE_APP_COMPANY_CODE; // 公司号

    // 默认构造函数
    constructor () {
      return this
    }
    // 用户登录
    static login = (params) => {
      const myParams = params
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      myParams.platform = store.getters.platform // 用户所在平台
      if (!params.appencrypt) {
        myParams.openId = store.getters['user/openId'] // openId
      }
      // myParams.inviteUid = store.getters['user/inviteUid']; // 邀请码
      return requstHelper.fetch('/accounts/login', myParams, {}, true)
    };

    // 获取用户信息
    static getUserInfo = (params) => {
      const myParams = params || {}
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      myParams.userId = userInfo.userId
      return requstHelper.fetch('/accounts/mobile/base/info', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      })
    };

    // 获取验证码
    static getVcode = (params) => {
      let myParams = params
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      myParams = serviceApi.stringify(myParams)
      return requstHelper.fetch('/common/getVerificationCode', myParams, {
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      }, true)
    };

    // 层级查询医院
    /*
     * 两个参数：
     * id:0-省 1-市 2-区、县 4-医院
     * name - 关键字模糊查询
     */
    static getHospitalList = (params) => {
      const myParams = params
      return requstHelper.fetch('/query/hospital/list', myParams, {}, true)
    };

    // 消息列表
    static getNewsList = (params) => {
      const myParams = params
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      return requstHelper.fetch('/query/news/list', myParams, {
        header: {
          encrypt: userInfo.encrypt
        },
        method: 'GET'
      }, true)
    };

    // 查询价格最低的商品
    static lowestGoods = params => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/trade/commodity/lowest/data', myParams, {
        method: 'post',
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    }

    // 个人中心任务是否完成
    static taskCheck = params => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/common/task/check', myParams, {
        method: 'GET',
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    }

    // 获取所有关卡列表
    static getCustomsList = () => {
      const myParams = {}
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 区域号
      return requstHelper.fetch('/query/topic/pass/level', myParams, {
        header: {
          encrypt: userInfo.encrypt
        },
        method: 'GET'
      }, true)
    };
    // 根据关卡编号查询题目
    static getCustomsInfo = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 区域号
      return requstHelper.fetch('/query/pass/topic/list', myParams, {
        header: {
          encrypt: userInfo.encrypt
        },
        method: 'GET'
      }, true)
    };
    // 获取傲美云首页数据
    static getAmyHomeList = () => {
      const myParams = {}
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 区域号
      return requstHelper.fetch('/query/amyxy/index/home/list', myParams, {
        header: {
          encrypt: userInfo.encrypt
        },
        method: 'GET'
      }, true)
    };
    // 通知栏列表（首页动态栏）
    static getNotiseList = () => {
      const myParams = {}
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 区域号
      return requstHelper.fetch('/query/index/notice/list', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 上报阅读量
    static reportReadNum = (params) => {
      if (!(storage.get(process.env.VUE_APP_STORAGE_NAME) && storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt)) {
        // 判断用户是否完善信息
        return
      }
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/common/content/read/up/add', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      })
    };

    // 上报积分信息
    static reportJfUp = (params) => {
      if (!(storage.get(process.env.VUE_APP_STORAGE_NAME) && storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt)) {
        // 判断用户是否完善信息
        return
      }
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/common/up/reported', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      })
    };

    // 新消息通知
    static getNews = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/news/list/check', myParams, {
        header: {
          encrypt: userInfo.encrypt
        },
        method: 'GET'
      }, true)
    };

    // 查询用户回答的问题
    static getAnsweredQues = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/answer/list/by', myParams, {
        header: {
          encrypt: userInfo.encrypt
        },
        method: 'GET'
      }, true)
    };

    // 查询访问记录时长
    static getAccTime = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/logdetail/accesstime', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 获取access_token 微信录音
    static getAccessToken = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/getAccessToken', myParams, {
        header: {
          encrypt: userInfo.encrypt
        },
        method: 'GET'
      }, true)
    };

    // 上传录音
    static addRecord = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/question/answer/add', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 获取微信录音的链接， 拿试听的地址换链接
    static converWeiAudioUrl = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/common/file/uploadSoundFile', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 上传二进制流到七牛
    static uploadMultipartFile = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/common/er/file/upload', myParams, {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded', //  表单格式传
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 上报分享页面信息
    static ReportPage = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch(
        '/user/list/share',
        myParams,
        {
          header: {
            encrypt: userInfo.encrypt,
            areaCode: serviceApi.AREA_CODE, // 区域号
            companyCode: serviceApi.COMPANY_CODE // 公司号
          }
        }
      )
    };

    // 活动分享加积分
    static activityAdd = (params) => {
      if (!storage.get(process.env.VUE_APP_STORAGE_NAME) || !storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt) {
        // 判断用户是否完善信息
        return
      }
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch(
        '/user/activity/share',
        myParams,
        {
          header: {
            encrypt: userInfo.encrypt,
            areaCode: serviceApi.AREA_CODE, // 区域号
            companyCode: serviceApi.COMPANY_CODE // 公司号
          }
        }
      )
    };

    // 上传文件
    static uploadFile = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/common/file/upload', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 获取轮播列表
    static getBannerList = (params) => {
      const myParams = params
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/index/banner/list', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };
    // 获取奖品列表
    static getLuckDrawList = (params) => {
      const myParams = params
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      if (!userInfo.userId) {
        return
      }
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/luckDraw/prize/queryList', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };
    // 积分中奖接口
    static LuckDrawSave = (params) => {
      const myParams = params
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      if (!userInfo.userId) {
        return
      }
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/luckDraw/prize/save', myParams, {
        header: {
          encrypt: userInfo.encrypt,
          'Content-Type': 'application/json'
        }
      }, true)
    };
    // 517活动积分
    static addActivityScored = (params) => {
      const myParams = params
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      if (!userInfo.userId) {
        return
      }
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/luckDraw/prize/addActivityScored', myParams, {
        header: {
          encrypt: userInfo.encrypt,
          'Content-Type': 'application/json'
        }
      }, true)
    };

    // 答题查询
    static getTopicList = (params) => {
      const myParams = params
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      // myParams.areaCode = "TaTME"; // 区域号
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/challenge/topic/list', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };
    // 获取文章列表
    static getArticleList = (params) => {
      const myParams = params
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      // myParams.areaCode = "TaTME"; // 区域号
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/article/list', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };
    // 获取文章列表
    static getCommonList = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/common/list', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };
    // 获取文章列表
    static getLiveList = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/video/live/list/page', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };
    // 获取已报名会议（直播）列表
    static getMyMeetingList = (params) => {
      const myParams = params
      // myParams.areaCode = "TaTME"; // 区域号
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.userId = userInfo.userId // 区域号
      return requstHelper.fetch('/common/live/reg/acct/list', myParams, {
        header: {
          encrypt: userInfo.encrypt
        },
        method: 'GET'
      }, true)
    };
    // 获取文章列表
    static getLabelList = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/list/label', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };
    // 热门标签列表
    static getHotLabels = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/list/pv/label', myParams, {
        header: {
          encrypt: userInfo.encrypt
        },
        method: 'GET'
      }, true)
    };

    // 保存用户基础信息
    static saveUserBaseInfo = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      myParams.userId = userInfo.userId
      return requstHelper.fetch('/accounts/mobile/realname', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };
    // 新增直播报名信息
    static liveAdd = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      myParams.userId = userInfo.userId
      return requstHelper.fetch('/common/live/reg/add', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 校验邀请码
    static inviteUidCheck = (params) => {
      const myParams = params || {}
      const userInfo = store.getters['user/userInfo']
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.beInviteUid = userInfo.userId
      myParams.inviteUid = store.getters['user/inviteUid'] // 邀请码
      console.log('inviteUidCheck', myParams)
      return requstHelper.fetch('/accounts/user/invite/save', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      })
    };

    // 获取收藏列表
    static getCollections = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/accounts/collection/query', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 上报外链
    static reportSourceUrl = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/common/report/pv/add', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      })
    };

    // 查询文章
    static getArticle = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/article/query/details', myParams, {
        // header: {
        //   encrypt: userInfo.encrypt,
        // },
      }, true)
    };

    // 查询选手详情
    static getPlayer = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/case/code/details', myParams, {
        // header: {
        //   encrypt: userInfo.encrypt,
        // },
      }, true)
    };

    // 查询视频列表
    static getVideoList = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/video/code/info', myParams, {
        // header: {
        //   encrypt: userInfo.encrypt,
        // },
      }, true)
    };

    // 查询视频信息
    static getVideoInfo = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/video/code/info', myParams, {
        // header: {
        //   encrypt: userInfo.encrypt,
        // },
      }, true)
    };

    // 查询会议信息
    static getMeetingInfo = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/meetings/code/info', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 添加提问
    static addQuestion = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/question/raise', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 上报用户访问时长
    static reportUserTime = (params) => {
      if (
        !(
          storage.get(process.env.VUE_APP_STORAGE_NAME) &&
                storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt
        )
      ) {
        // 判断用户是否完善信息
        console.log(11111)
        return
      }
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/common/report/time/save', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      })
    };

    // 获取文章评论
    static getComments = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      console.log('userInfo', userInfo)
      if (!userInfo.userId) {
        return
      }
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/message/list', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 给文章点赞
    static setPraise = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/common/up/great', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 获取视频观看时长列表
    static getVideoTime = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号

      return requstHelper.fetch('/query/list/video/time', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };
    // 添加收藏
    static addCollection = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/accounts/collection/add', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 点击投票
    static addVote = (params) => {
      console.log(24124124124)
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/case/player/vote', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 取消收藏
    static cancelCollection = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/accounts/collection/cancel', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 发送消息
    static sendMessage = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/accounts/message/add', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 查询用户提交的问题
    static serarProblem = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/question/user/list', myParams, {
        header: {
          encrypt: userInfo.encrypt
        },
        method: 'GET'
      }, true)
    };

    // 新增问题
    static addProblem = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/question/add', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 未解答问题列表和已解答列表
    static queryYnAskList = (params) => {
      var time = new Date()
      time = time.getTime()
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      myParams.timestamp = time
      return requstHelper.fetch('/query/list/to/question/none', myParams, {
        header: {
          encrypt: userInfo.encrypt
        },
        method: 'GET'
      }, true)
    };

    // 获取答题列表
    static getTopics = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/topic/list', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 回答问题
    static answerTopic = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/topic/answer', myParams, {
        header: {
          encrypt: userInfo.encrypt,
          areaCode: serviceApi.AREA_CODE, // 区域号
          companyCode: serviceApi.COMPANY_CODE // 公司号
        }
      }, true)
    };

    // 回答关卡问题
    static answerCustomsTopic = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/pass/topic/save', myParams, {
        header: {
          encrypt: userInfo.encrypt,
          areaCode: serviceApi.AREA_CODE, // 区域号
          companyCode: serviceApi.COMPANY_CODE // 公司号
        }
      }, true)
    };
    // 查询关卡答题月度排行榜
    static getRanking = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      myParams.userId = userInfo.userId
      return requstHelper.fetch('/query/rank/month', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 问题详情查询
    static getQuestionDetail = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/question/info', myParams, {
        header: {
          encrypt: userInfo.encrypt
        },
        method: 'GET'
      }, true)
    };

    // 调研信息查询（题目列表）
    static getServey = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/survey/list', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 上报分享信息
    static ReportInfor = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/share/report', myParams, {
      })
    };

    // 调研
    static research = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/topic/survey/check', myParams, {
        // header: {
        //   encrypt: userInfo.encrypt,
        //   areaCode: serviceApi.AREA_CODE, // 区域号
        //   companyCode: serviceApi.COMPANY_CODE, // 公司号
        // },
      })
    };

    // 校验签到
    static checkSign = params => {
      const myParams = params || {}
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      // console.log(userInfo)
      // console.log(serviceApi)
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/accounts/sign/check', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      })
    };

    // 查询最近一次签到记录
    static signLast = params => {
      const myParams = params || {}
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      console.log(serviceApi.AREA_CODE)
      console.log(serviceApi.COMPANY_CODE)
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      console.log(myParams)
      return requstHelper.fetch('/accounts/sign/last/info', myParams, {
        header: {
          encrypt: userInfo.encrypt
        },
        method: 'GET'
      })
    }

    // 获取城市基本信息
    static getCitys = () => {
      const myParams = {}
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/query/common/city/list', myParams, {}, true)
    };

    // 签到
    static sign = () => {
      const myParams = {}
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      return requstHelper.fetch('/accounts/sign/add', myParams, {
        header: {
          encrypt: userInfo.encrypt
        }
      }, true)
    };

    // 查询是否是代表
    static checkType = (params) => {
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      const myParams = params
      myParams.areaCode = serviceApi.AREA_CODE // 区域号
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      return requstHelper.fetch('/acct/amy/check/behalf', params, {
        header: {
          token: userInfo.encrypt
        },
        method: 'GET'
      })
    }

    // 查询是否是代表
    static getSysTime = () => {
      return requstHelper.fetch('/common/getSysTime', {}, {
        method: 'GET'
      })
    }
    // 推荐之星
    static getRecommendStar = (params) => {
      const myParams = params
      const userInfo = storage(`userInfoAMY`)
      myParams.userId = userInfo.cid // 公司号
      return requstHelper.fetch('/accounts/login/sorceCount', myParams,
        {
          header: {
            token: userInfo.encrypt
          }
        }, true)
    }
         // 跳转医生节积分页面
         static queryDoctorSorce = (myParams) => {
           const userInfo = storage(`amyxy`) || store.getters['user/userInfo']
           return requstHelper.fetch('/common/report/queryDoctorSorce', myParams, {
             method: 'post',
             header: {
               encrypt: userInfo.encrypt
             }
           }, true)
         }
       // 医师节文章阅读数
       static reportArticleCount = (params) => {
         const myParams = params
         const userInfo = storage(`amyxy`) || store.getters['user/userInfo']
         return requstHelper.fetch('/common/report/reportArticleCount', myParams,
           {
             method: 'post',
             header: {
               encrypt: userInfo.encrypt
             }
           }, true)
       }
         // 医生节领取积分接口
         static receiveSorce = (params) => {
           const myParams = params
           const userInfo = storage(`amyxy`) || store.getters['user/userInfo']
           myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
           return requstHelper.fetch('/common/report/receiveSorce', myParams,
             {
               header: {
                 encrypt: userInfo.encrypt
               }
             }, true)
         }
                 // 医生节穿上白大褂按钮
                 static TrueUpload = (params) => {
                   const myParams = params
                   const userInfo = storage(`amyxy`) || store.getters['user/userInfo']
                   myParams.userId = userInfo.userId //
                   return requstHelper.fetch('/common/login/TrueUpload', myParams,
                     {
                       header: {
                         encrypt: userInfo.encrypt
                       }
                     }, true)
                 }
        // 医生节签到次数
        static reportSignCount = (params) => {
          const myParams = params
          myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
          const userInfo = storage(`amyxy`) || store.getters['user/userInfo']
          //   myParams.userId = userInfo.userId; // 公司号
          return requstHelper.fetch('/accounts/report/reportSignCount', myParams,
            {
              header: {
                encrypt: userInfo.encrypt
              }
            }, true)
        }
      // 医生节视频直播数
      static reportVideoCount = (params) => {
        const myParams = params
        const userInfo = storage(`amyxy`) || store.getters['user/userInfo']
        myParams.userId = userInfo.userId // 公司号
        return requstHelper.fetch('/common/report/reportVideoCount', myParams,
          {
            header: {
              encrypt: userInfo.encrypt
            }
          }, true)
      }
      // 判断活动详情页面还是风采页面
          static is819uploadCount = (params) => {
            const myParams = params
            const userInfo = storage(`amyxy`) || store.getters['user/userInfo']
            myParams.userId = userInfo.userId // 公司号
            return requstHelper.fetch('/common/login/detail', myParams,
              {
                header: {
                  encrypt: userInfo.encrypt
                }
              }, true)
          }
          // 上报按钮点击
          //
          // PageName
          // EventID
          // ControlName 控件名称
          // Description
          // ActionType

    /**
    *  埋点上报接口服务   from Min in 2018/8/9
    *  UserID用户id            用户userId
    *  Access访问来源          其值为进入专区首页链接地址拿到的 Access 参数
    *  DeviceTime             获取当前时间戳
    *  CompanyCode/AreaCode   公司code/专区code
    *  PageID/PageName        页面id/name    1、首页  2、资讯精选  3、名家讲坛  4、喂养实践  5、会议速递   501、会议快讯  502、会议预告  6、搜索页面
                                              7、个人中心   8、设置个人信息   9、文章详情    10、视频详情  11、会议详情   12、外链
    *  EventID 事件id         事件id         1、页面加载事件 onload   2、点击事件 onclick
    *  Description            描述           首页访问来源埋点/ 全点击事件埋点
    *  ActionType             动作类型       1、首页访问来源埋点      2、全点击事件埋点
    *  ActionName             动作名         pv
    *  ActionObj              动作对象       主要阵对点击事件，页面加载事件给''
    *  AppVersion/ MobileModel/MobileSystemModel  获取设备信息
    */
    static baoSaveReport = (params) => {
      const myParams = params
      const userInfo = store.getters['user/userInfo'] // 获取用户信息
      myParams.userId = userInfo.userId || ''
      myParams.areaCode = serviceApi.AREA_CODE
      myParams.companyCode = serviceApi.COMPANY_CODE // 公司号
      myParams.inviteUid = store.getters['user/inviteUid'] // 邀请码
      myParams.DeviceTime = new Date()
      myParams.Browser = ''
      myParams.Access = ''
      myParams.DeviceID = ''
      myParams.PageID = ''
      myParams.ActionType = '1'
      myParams.ClientIP = ''
      myParams.Browser = location.href
      myParams.ActionObj = ''
      myParams.AppVersion = navigator.appVersion
      myParams.MobileModel = navigator.appVersion
      myParams.MobileSystemModel = navigator.appVersion

      return requstHelper.fetch(
        '/common/report/page/save',
        myParams,
        {
          header: {
            encrypt: userInfo.encrypt
            // areaCode: serviceApi.AREA_CODE, // 区域号
            // companyCode: serviceApi.COMPANY_CODE, // 公司号
          }
        }
      )
    };
    // 转换key值，部分接口不支持json
    static stringify = (param) => {
      const query = []
      Object.keys(param).forEach((key) => {
        query.push(`${key}=${param[key]}`)
      })
      return query.join('&')
    };
}

export default serviceApi
