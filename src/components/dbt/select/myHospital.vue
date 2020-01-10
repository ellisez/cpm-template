<template>
  <div class="showWrap">
    <Popup
      v-model="showBox"
      :close-on-click-overlay="false"
      style="max-height:70%;width:90%;border-radius:6px"
    >
      <div class="content">
        <div class="item" v-for="(item,index) in list" :key="index">{{item.marketHospital}}</div>
        <div class="btn">
          <span @click="close">确定</span>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
import { Popup } from 'vant'
export default {
  props: {
    list: Array
  },
  data () {
    return {
      showBox: false
    }
  },
  mounted () {
    this.showBox = true
  },
  methods: {
    close () {
      this.showBox = false
      this.$emit('close')
    }
  },
  components: {
    Popup
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 0.2rem;
}
.item {
  width: 80%;
  margin: 0 auto;
  border: 1px solid rgba(151, 151, 151, 0.3);
  border-radius: 0.06rem;
  line-height: 0.24rem;
  padding: 0.05rem 0.15rem;
  font-size: 0.12rem;
  font-weight: 400;
  color: rgba(74, 74, 74, 1);
  margin-bottom: 0.1rem;
}
.btn {
  width: 80%;
  margin: 0 auto;
  margin-top: 0.2rem;
  span {
    display: block;
    width: 100%;
    height: 0.36rem;
    background: linear-gradient(
      125deg,
      rgba(76, 50, 229, 1) 0%,
      rgba(30, 42, 157, 1) 100%
    );
    box-shadow: 0px 2px 4px 0px rgba(76, 50, 229, 0.5);
    border-radius: 0.18rem;
    text-align: center;
    line-height: 0.36rem;
    color: #fff;
  }
}
</style>
