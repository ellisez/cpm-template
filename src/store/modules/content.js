import serviceAPI from '../../core/serviceAPI'
import { ContactList } from 'vant'

export default {
  namespaced: true,
  state: {
  },
  getters: {
  },
  mutations: {

  },
  actions: {
    // 给文章点赞
    /**
     */
    async setPraise (context, params) {
      try {
        const article = await serviceAPI.setPraise(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 查询访问记录时长
    /**
     */
    async getAccTime (context, params) {
      try {
        const article = await serviceAPI.getAccTime(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 获取傲美云首页数据
    /**
     */
    async getAmyHomeList (context, params) {
      try {
        const article = await serviceAPI.getAmyHomeList(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 通知栏列表（首页动态栏）
    /**
     */
    async getNotiseList (context, params) {
      try {
        const article = await serviceAPI.getNotiseList(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 获取所有关卡列表
    /**
     */
    async getCustomsList (context, params) {
      try {
        const article = await serviceAPI.getCustomsList(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 根据关卡编号查询题目
    /**
     */
    async getCustomsInfo (context, params) {
      try {
        const article = await serviceAPI.getCustomsInfo(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 个人中心任务是否完成
    /**
     */
    async taskCheck (context, params) {
      try {
        const article = await serviceAPI.taskCheck(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 上报阅读量
    /**
     */
    async reportReadNum (context, params) {
      try {
        const article = await serviceAPI.reportReadNum(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 查询价格最低的商品
    /**
     */
    async lowestGoods (context, params) {
      try {
        const article = await serviceAPI.lowestGoods(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 上报用户访问时长
    /**
     * @param {Object} params-请求参数
     * @param {String} params.type-1、文章 2、会议 3、视频 4、精彩回顾 5、每日一听
     * @param {String} params.code-CODE
     * @param {String} params.logType-1、停留时长 2、播放时长
     * @param {String} params.viewId-访问ID 备注:此参数 文章，会议，视频，精彩回顾，病例大赛，病历展示
     */
    async reportUserTime (context, params) {
      try {
        const article = await serviceAPI.reportUserTime(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 获取文章详情
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     * @param {String} params.source-来源
     * @param {String} params.shareEncryptKey-分享加密串
     */
    async getArticle (context, params) {
      try {
        console.log(params)
        const article = await serviceAPI.getArticle(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 傲美云新增提问
    /**
     * @param {Object} params-请求参数
     */
    async addProblem (context, params) {
      try {
        console.log(params)
        const article = await serviceAPI.addProblem(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 获取标签列表
    /**
     * @param {Object} params-请求参数
     * @param {String} params.collomnCode-栏目code
     */
    async getLabelList (context, params) {
      try {
        console.log(params)
        const article = await serviceAPI.getLabelList(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 获取选手详情
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     */
    async getPlayer (context, params) {
      try {
        console.log(params)
        const article = await serviceAPI.getPlayer(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 获取视频播放时长
    /**
     * @param {Object} params-请求参数
     */
    async getVideoTime (context, params) {
      try {
        const article = await serviceAPI.getVideoTime(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 获取用户提问列表
    /**
     * @param {Object} params-请求参数
     * @param {Object} params.question-问题内容
     * @param {Object} params.timestamp-时间戳
     * @param {Object} params.modelCode-模块CODE
     */
    async addQuestion (context, params) {
      try {
        const article = await serviceAPI.addQuestion(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 层级查询医院
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     */
    async getHospitalList (context, params) {
      try {
        console.log(params)
        const article = await serviceAPI.getHospitalList(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 上报外链
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     */
    async reportSourceUrl (context, params) {
      try {
        console.log(params)
        const article = await serviceAPI.reportSourceUrl(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 获取视频详情
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     * @param {String} params.source-来源
     * @param {String} params.shareEncryptKey-分享加密串
     */
    async getVideoInfo (context, params) {
      try {
        console.log(params)
        const article = await serviceAPI.getVideoInfo(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 上报积分
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     * @param {String} params.type-1:阅读文章：会议、2、看视频 3 、每日一听
     */
    async reportJfUp (context, params) {
      try {
        console.log(params)
        const article = await serviceAPI.reportJfUp(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 获取会议详情
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     * @param {String} params.source-来源
     * @param {String} params.shareEncryptKey-分享加密串
     */
    async getMeetingInfo (context, params) {
      try {
        console.log(params)
        const article = await serviceAPI.getMeetingInfo(params)
        return article
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 获取文章评论
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     * @param {Number} params.pageNum--页码
     * @param {Number} params.pageSize--每页记录数
     */
    async getComments (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.getComments(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 点击投票
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     */
    async addVote (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.addVote(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 文章点赞
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     * @param {Number} params.type--0:评论点赞 1:文章 2:会议 3:视频 4:精彩回顾 5:病例大赛 6:病例展示 8:语音
     * @param {Number} params.status--1:点赞 0: 取消
     */
    async setPraise (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.setPraise(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 收藏文章
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     * @param {Number} params.type--0:评论点赞 1:文章 2:会议 3:视频 4:精彩回顾 5:病例大赛 6:病例展示 8:语音
     */
    async addCollection (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.addCollection(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 取消收藏文章
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     * @param {Number} params.type--0:评论点赞 1:文章 2:会议 3:视频 4:精彩回顾 5:病例大赛 6:病例展示 8:语音
     */
    async cancelCollection (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.cancelCollection(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 发送信息
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     * @param {Number} params.commentContent-发送消息
     */
    async sendMessage (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.sendMessage(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 查询用户提交的问题
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     */
    async serarProblem (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.serarProblem(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 获取已报名会议（直播）列表
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     */
    async getMyMeetingList (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.getMyMeetingList(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 查询用户提交的问题
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     */
    async getAnsweredQues (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.getAnsweredQues(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 查询问题列表
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     */
    async queryYnAskList (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.queryYnAskList(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 获取答题
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     */
    async getTopics (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.getTopics(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 获取文章列表
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     * @param {String} params.code-code
     */
    async getArticleList (context, params) {
      try {
        const comments = await serviceAPI.getArticleList(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 思诺思首页列表
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     * @param {String} params.code-code
     */
    async getCommonList (context, params) {
      try {
        const comments = await serviceAPI.getCommonList(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 直播列表
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     * @param {String} params.code-code
     */
    async getLiveList (context, params) {
      try {
        const comments = await serviceAPI.getLiveList(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 获取答题
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-code
     * @param {String} params.code-code
     */
    async getBannerList (context, params) {
      try {
        const comments = await serviceAPI.getBannerList(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 新增直播报名信息
    /**
     * @param {Object} params-请求参数
     * @param {String} params.columnCode-栏目CODE
     */
    async liveAdd (context, params) {
      try {
        const comments = await serviceAPI.liveAdd(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    // 获取问题详情-好孕风语
    /**
     * @param {Object[]} params-请求参数
     * @param {String} params[].code-文章 视频 会议 调研唯一code
     * @param {String} params[].timestamp-时间戳
     */
    async getQuestionDetail (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.getQuestionDetail(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    //  调研信息查询（题目列表）
    /**
     * @param {Object} params-请求参数
     * @param {String} params.code-调研code
     */
    async getServey (context, params) {
      try {
        console.log(params)
        const serveyList = await serviceAPI.getServey(params)
        return serveyList
      } catch (error) {
        // 抛出异常
        throw error
      }
    },

    //  调研
    async research (context, params) {
      try {
        console.log(params)
        const serveyList = await serviceAPI.research(params)
        return serveyList
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    //  上传图片
    async uploadFile (context, params) {
      try {
        console.log(params)
        const serveyList = await serviceAPI.uploadFile(params)
        return serveyList
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 回答答题
    /**
     * @param {Object[]} params-请求参数
     * @param {String} params[].code-文章 视频 会议 调研唯一code
     * @param {String} params[].answer-答案
     * @param {String} params[].topicCode-题目编号
     */
    async answerTopic (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.answerTopic(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 回答关卡问题
    /**
     * @param {Object[]} params-请求参数
     * @param {String} params[].code-文章 视频 会议 调研唯一code
     * @param {String} params[].answer-答案
     * @param {String} params[].topicCode-题目编号
     */
    async answerCustomsTopic (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.answerCustomsTopic(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 热门标签列表
    /**
     */
    async getHotLabels (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.getHotLabels(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 热门标签列表
    /**
     */
    async getNews (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.getNews(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 获取我的奖品列表
    /**
     */
    async getLuckDrawList (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.getLuckDrawList(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 答题查询
    /**
     */
    async getTopicList (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.getTopicList(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 积分中奖接口
    /**
     */
    async LuckDrawSave (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.LuckDrawSave(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 517活动积分
    /**
     */
    async addActivityScored (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.addActivityScored(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 查询关卡答题月度排行榜
    /**
     * @param {Object[]} params-请求参数
     * @param {String} params[].code-文章 视频 会议 调研唯一code
     * @param {String} params[].answer-答案
     * @param {String} params[].topicCode-题目编号
     */
    async getRanking (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.getRanking(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 获取access_token  微信录音
    /**
     * @param {Object[]} params-请求参数
     * @param {String} params[].appid-微信appid
     */
    async getAccessToken (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.getAccessToken(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 获取微信录音的链接， 拿试听的地址换链接
    /**
     * @param {Object[]} params-请求参数
     * @param {String} params[].weiURL- 微信服务器文件地址
     */
    async converWeiAudioUrl (context, params) {
      try {
        console.log(params)
        const comments = await serviceAPI.converWeiAudioUrl(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    },
    // 推荐之星

    async getRecommendStar (context, params) {
      try {
        const comments = await serviceAPI.getRecommendStar(params)
        return comments
      } catch (error) {
        // 抛出异常
        throw error
      }
    }
  }
}
