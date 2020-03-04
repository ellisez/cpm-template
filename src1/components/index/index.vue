<template>
    <div class="big-box">
        <div class="box">
            <router-view></router-view>
        </div>
        <div class="tab">
          <Tab></Tab>
        </div>
    </div>

</template>

<script>
import Tab from '../common/tab'
export default {
  components: {
    Tab
  }
}
</script>

<style lang='less' scoped>
.big-box {
  height: 100%;
}
.box {
    height: 100%;
    width: 100%;

    // margin-bottom: 0.73rem;
}
    .icon-index-active {
        width: 0.53rem;
        height: 0.52rem;
        margin-top:-0.25rem;
        // margin-bottom: 0.03rem;
        // background-image: url('@{icon}/sy-blue.png');
        background-size: 0.53rem 0.52rem;
    }
    .router-link-exact-active {
        color: #d93639 !important;

        .icon-index {
            background-image: url('src1/assets/icon/index-active.png') !important;
        }

        .icon-unscramble {
            background-image: url('src1/assets/icon/video-active.png') !important;
        }
        .icon-rostrum {
            background-image: url('src1/assets/icon/book-active.png') !important;
        }
        .icon-cvdreal {
            background-image: url('src1/assets/icon/trophy-active.png') !important;
        }
        .icon-expert {
            background-image: url('src1/assets/icon/microphone-active.png') !important;
        }
    }

</style>
