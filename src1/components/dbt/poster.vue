<template>
  <div class="posterWrap" id="poster">
    <div class="list">
      <el-carousel
        :loop="true"
        :autoplay="false"
        ref="swiper"
        @change="swiperChange"
        type="card"
        height="3.8rem"
      >
        <el-carousel-item v-for="(item,index) in banners" :key="index">
          <div tag="div" v-touch:swipe.right="prev" v-touch:swipe.left="next">
            <img style="width:100%;height:100%" :src="item.thumbnailUrl" />
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="formInfo">
      <div class="from">
        <span>from：</span>
        <input v-model="from" type="text" />
      </div>
      <div class="msg">
        <span>邀请语：</span>
        <textarea v-model="msg" cols="10" rows="10"></textarea>
      </div>
    </div>
    <div class="btn">
      <div @click="createPoster" class="InvitationBtn">生成海报</div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import { mapMutations, mapActions } from 'vuex'
import { changeTitle } from '../../utils/func'
export default {
  data () {
    return {
      dataImg: '',
      banners: [
        // {
        //   thumbnailUrl: require("../../assets/iconD/temp1.png")
        // },
        {
          thumbnailUrl: require('../../assets/819/poster_temp.png')
        }

        // {
        //   thumbnailUrl: require("../../assets/iconD/temp2.png")
        // },
        // {
        //   thumbnailUrl: require("../../assets/iconD/temp3.png")
        // }
      ],
      //   list: [
      //     require("../../assets/iconD/poster1.png"),
      //     require("../../assets/iconD/poster2.png"),
      //     require("../../assets/iconD/poster3.png")
      //   ],
      list: [require('../../assets/819/poster.png')],
      from: '',
      msg: '',
      activeIndex: 0,
      isCreate: false,
      url: '',
      qrUrl: ''
    }
  },
  created () {
    changeTitle('生成邀请海报')
    // 517活动 设置默认邀请语
    this.msg =
      '奥美沙坦酯作为全球领军的ARB类药物，是最强效的ARB，如今奥美沙坦酯氨氯地平片作为ARB+CCB类单片固定复方类降压药物在中国也正式获批上市，强效、平稳降压，安全性好，依从性高，有效降低心血管事件风险'
  },
  methods: {
    ...mapMutations(['hideLoad']),
    next () {
      this.$refs.swiper.next()
      this.activeIndex = this.$refs.swiper.activeIndex
    },
    prev () {
      this.$refs.swiper.prev()
      this.activeIndex = this.$refs.swiper.activeIndex
    },
    swiperChange (e) {
      this.activeIndex = e
    },
    createPoster () {
      if (!this.from) {
        Toast('请输入邀请人')
        return
      }
      if (!this.msg) {
        Toast('请输入邀请语')
        return
      }
      // if (this.msg.length > 80) {
      //   Toast("邀请语最多可输入80字");
      //   return;
      // }
      this.$router.push({
        path: '/saveDBT',
        query: {
          bannerIndex: this.activeIndex,
          from: this.from,
          msg: this.msg,
          qrUrl: this.qrUrl,
          dataUrl: this.list[this.activeIndex]
        }
      })
    }
  },
  mounted () {
    this.from = this.$route.query.userName
    if (this.$route.query.msg) {
      this.msg = this.$route.query.msg
    }
    this.hideLoad()
  },
  components: {
    Toast
  },
  watch: {
    // 517活动 监控activeIndex，实现邀请语自动填充
    activeIndex () {
      switch (this.activeIndex) {
        case 0:
          this.msg =
            '奥美沙坦酯作为全球领军的ARB类药物，是最强效的ARB，如今奥美沙坦酯氨氯地平片作为ARB+CCB类单片固定复方类降压药物在中国也正式获批上市，强效、平稳降压，安全性好，依从性高，有效降低心血管事件风险'
          break
        case 1:
          this.msg =
            '奥美沙坦酯，新一代ARB。早期阻断心血管事件链，更多远期获益。\n奥美沙坦酯通过激活ACE2/Ang-（1-7）/Mas轴，发挥卓越血管保护作用。\nOLIVUS延长研究显示，4年随访服用奥美沙坦酯，主要心脑血管不良事件风险降低24%。'
          break
        case 2:
          this.msg =
            '老年人常患有多种疾病及服用多种药物，易发生药物间相互作用发生不良反应。\n普伐他汀是一种水溶性的他汀，不需要经过细胞色素P450酶代谢，所以发生药物间相互作用的几率较小。普伐他汀是目前唯一经大样本临床试验证实的70岁以上老年人应用能获益且安全性良好的降脂药。'
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.posterWrap {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
}
.formInfo {
  padding: 0 0.2rem 0 0;
  padding-top: 0.15rem;
  div {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    height: 34px;
    margin-bottom: 0.15rem;
    font-size: 0.15rem;
    span {
      width: 20%;
      text-align: right;
      color: rgba(74, 74, 74, 1);
    }
    input,
    textarea {
      width: 80%;
      color: #4a4a4a;
      font-size: 14px;
    }
    input {
      height: 0.34rem;
      line-height: 0.34rem;
      border: 1px solid rgba(151, 151, 151, 0.2);
      padding: 0 0.05rem;
    }
    textarea {
      height: 1rem;
      border: 1px solid rgba(151, 151, 151, 0.2);
      padding: 0.05rem;
    }
  }
  .msg {
    height: 1rem;
  }
}
.InvitationBtn {
  height: 0.4rem;
  width: 90%;
  line-height: 0.4rem;
  background: linear-gradient(
    315deg,
    rgba(32, 42, 161, 1) 0%,
    rgba(75, 50, 228, 1) 100%
  );
  box-shadow: 0px 1px 4px 0px rgba(124, 149, 254, 0.15);
  border-radius: 0.05rem;
  margin: auto;
  text-align: center;
  color: #fff;
  font-size: 0.15rem;
  border-radius: 0.2rem;
}
.list {
  // padding: 0.1rem 0;
  background: #fff;
  // div {
  //   height: 100%;
  // }
}
/deep/ .el-carousel__item--card.is-active {
  width: 60%;
  transform: translateX(76.5px) scale(1) !important;
}
/deep/ .el-carousel__item {
  width: 50%;
  height: 3.8rem;
  div {
    height: 100%;
  }
}
/deep/ .el-carousel__button {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
/deep/ .el-carousel__arrow {
  display: none;
}
/deep/ .el-carousel__mask {
  display: none;
}
</style>
