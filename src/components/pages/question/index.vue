<template>
    <div style="padding:13px;width:100%;min-height:100%;background-color:#fff">
        <p class="question-now">我的问题</p>
        <textarea v-if="!questionOver" v-model="questionText" class="qus-txt" @input="textChange" name="" id="" cols="30" rows="10" placeholder="请输入您想提问的问题">
        </textarea>
        <p style="font-size:16px; text-align:left;" v-if="questionOver">
            {{questionText}}
        </p>
        <div class="hint">
            <p class="left">提示：</p>
            <p class="right">每位用户每天最多可以提问2个问题，请珍惜您每次提问的机会!</p>
        </div>

        <button class="compete" :class="{'uncompete':questionText.trim() == ''}" @click="compete" v-if="!questionOver">完成</button>
        <button class="compete" @click="again" v-else>再次提问</button>

        <div class="my-question" v-show="list.length != 0">
            <p class="title question-now">我的提问</p>
            <ul>
                <li v-for="(item,index) in list" :key="index" @click="to(item.code)">
                    <p class="ans-num">{{ item.answerNum }}人回答</p>
                    <p class="ttl">{{ item.createTime.slice(5,10).replace('-','/') }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.question }}</p>
                </li>
            </ul>
        </div>

         <!-- 蒙层 -->
         <transition name="fade">
          <div class="message-box" v-show="showMessageBox">
               <div>
                    <p>是否提交你的问题？</p>

                    <div class="btn-box">
                        <button class="go" @click="addQuestion">确定</button>
                        <button class="stay" @click="showMessageBox = false">取消</button>
                    </div>
               </div>
          </div>
      </transition>
    </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import storage from 'storejs'
import { Toast } from 'vant'
import { changeTitle } from '../../../utils/func'
export default {
  data () {
    return {
      showMessageBox: false,
      questionText: '',
      // 提问是否完成的状态 用来判断是否需要展示提问完成后的问题标题
      questionOver: false,
      list: [],
      loading: false
    }
  },
  created () {
    changeTitle('提问')
    this.getUserQuestions()
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '提问',
        EventID: '1',
        ControlName: '',
        Description: ''
      })
    } catch (error) {
      console.log(error)
    }
  },
  mounted () {
    //   if (this.isWechat) {
    //     changeTitle('我要提问')
    // }else if(location.href.indexOf('appencrypt') != -1){
    //     app.setTitle('我要提问')
    //     app.setTitleColor(0,115,188)
    // }else {
    //     document.getElementsByTagName("title")[0].innerText = '我要提问'
    // }

    this.hideLoad()
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      serarProblem: 'content/serarProblem',
      addProblem: 'content/addProblem',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    textChange () {
      if (this.questionText.length > 300) {
        Toast('提问问题不能超过300字！')
      }
    },

    compete () {
      if (this.questionText.length > 300) {
        Toast('提问问题不能超过300字！')
        return
      }
      if (this.questionText.trim() != '') { this.showMessageBox = true }
    },

    to (code) {
      this.$router.push({ path: 'answerDetail', query: { code: code, source: 12 } })
    },
    // 再次提问
    again () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '提问',
          EventID: '2',
          ControlName: '再次提问',
          Description: '再次提问'
        })
      } catch (error) {
        console.log(error)
      }
      location.reload()
    },
    // 获取当前用户提交过的所有问题
    async getUserQuestions () {
      var time = new Date()
      time = time.getTime()
      var data = {
        timestamp: time,
        modelCode: 'AMYXY-XSTQS'
        // code,
        // pageNum:this.pageNum,
        // pageSize:this.limit
      }
      try {
        var res = await this.serarProblem(data)
        this.list = res.data
      } catch (error) {
        console.log(error)
      }
    },
    // 添加问题
    async addQuestion () {
      if (this.loading) {
        return
      }
      if (this.questionText.trim() == '') {
        Toast('提问内容不能为空！')
        return
      }
      if (this.questionText.length > 300) {
        Toast('提问问题不能超过300字！')
        return
      }
      var question = this.questionText
      var time = new Date()
      time = time.getTime()
      var data = {
        question,
        timestamp: time,
        modelCode: 'AMYXY-XSTQS'
      }
      this.loading = true
      try {
        var res = await this.addProblem(data)
        if (res.data.score > 0) {
          Toast('提交成功,积分+' + res.data.score)
        }
        this.questionOver = true
        this.showMessageBox = false
        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
        Toast(error)
      }
    }
  }

}
</script>

<style lang="less" scoped>

.question-now {
    font-size: 16px;
    color: #4a4a4a;
    text-align: left;
    padding-bottom: 10px;
    font-weight: 600;
}
.qus-txt {
    width: 100%;
    height: 200px;
    border: 2px solid rgba(151,151,151,0.2);
    border-radius: 8px;
    padding: 15px 10px;
    font-size: 14px;
    resize: none;
    outline: none;
}

.hint {
    text-align: left;
    color: #ccc;
    font-size: 12px;
    padding-top: 6px;
    .left {
        float: left;
    }
    .right {
        overflow: hidden;
    }
}
.compete {
    display: block;
    width: 2.6rem;
    height:40px;
    background:linear-gradient(315deg,rgba(32,42,161,1) 0%,rgba(75,50,228,1) 100%);
    box-shadow:-2px 2px 10px 0px rgba(74,49,227,0.5);
    border-radius:22px;
    color: #fff;
    border:0;
    border-radius: 20px;
    font-size: 17px;
    margin: 30px auto;
}

.my-question  {
    .title {
        border-bottom: 1px solid #f2f2f2;

    }
    .ttl {
        height: 0.5rem;
         line-height: 0.5rem;
        // overflow: hidden;
        text-align: left;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .ans-num {
         line-height: 0.5rem;
        font-size: 12px;
        float: right;
        color: #ccc;
    }

}

// 蒙层
.message-box {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .1);
    position: fixed;
    left: 0;
    top:0;
    z-index: 1500;
    padding: 2rem 0.4rem;
    font-size: 14px;
    &>div {
        width: 100%;
        background-color: #fff;
        padding: 0.2rem 0.15rem;
        border-radius: 0.07rem;
        p {
            line-height: 0.22rem;
            padding: 20px 0;
            span {
                color: red;
            }
        }

        .btn-box {
            width: 100%;
            padding: 0.25rem 30px;
            button {
                width: 0.8rem;
                height: 0.28rem;
                border-radius: 0.05rem;
                border: 0;
            }
            .stay {
                float: right;
                background-color: #fff;
                color: #ccc;
                border: 1px solid #ccc;
            }
            .go {
                float: left;
                background-color: #169BD5;
                color: #fff;
            }
        }
    }
}

.uncompete {
    background-color: #ccc !important;
}
</style>
