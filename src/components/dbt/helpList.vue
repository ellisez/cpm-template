<template>
  <div class="doctor">
    <div class="docItem" @click="helpDetail('1')" data-flex="main:justify cross:center">
      <div class="left">傲美代表端使用介绍</div>
      <div class="right">
        <img src="../../assets/iconD/my_more.png">
      </div>
    </div>
    <div class="docItem" @click="helpDetail('2')" data-flex="main:justify cross:center">
      <div class="left">“达人挑战”执行流程</div>
      <div class="right">
        <img src="../../assets/iconD/my_more.png">
      </div>
    </div>
    <div class="docItem" @click="helpDetail('3')" data-flex="main:justify cross:center">
      <div class="left">“青年演说家”执行流程</div>
      <div class="right">
        <img src="../../assets/iconD/my_more.png">
      </div>
    </div>
    <div class="docItem" @click="helpDetail('4')" data-flex="main:justify cross:center">
      <div class="left">“学术同期声”执行流程</div>
      <div class="right">
        <img src="../../assets/iconD/my_more.png">
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { changeTitle } from '../../utils/func'
export default {
  data () {
    return {}
  },
  mounted () {
    this.hideLoad()
  },
  methods: {
    ...mapMutations(['hideLoad']),
    helpDetail (type) {
      this.$router.push({
        path: '/helpDetailDBT',
        query: {
          type: type
        }
      })
    }
  },
  created () {
    changeTitle('帮助文档')
  }
}
</script>

<style lang="less" scoped>
.doctor {
  text-align: left;
  background: #fff;
  .docItem {
    align-items: center;
    font-size: 0.14rem;
    color: #4a4a4a;
    padding: 0.2rem;
    border-bottom: 1px solid rgba(153, 153, 153, 0.1);

    .left {
      width: 60%;
      .name {
        padding: 0.04rem 0;
        img {
          width: 0.2rem;
          height: 0.2rem;
          margin-right: 0.1rem;
        }
        p {
          color: #4a4a4a;
        }
      }
      .hospital {
        color: #9b9b9b;
      }
    }
    .center {
      width: 20%;
      .bind {
        border-radius: 15px;
        width: 86px;
        height: 30px;
        background: rgba(119, 127, 255, 1);
        border-radius: 15px;
        border: 0;
        color: #fff;
      }
    }
    .right {
      width: 5%;
      img {
        width: 0.08rem;
        height: 0.08rem;
      }
    }
  }
}
</style>
