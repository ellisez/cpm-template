<template>
  <div class="imgWrap">
    <img v-if="type==='1'" src="src1/assets/imagesD/type1.jpg" alt>
    <img v-if="type==='2'" src="src1/assets/imagesD/type2.jpg" alt>
    <img v-if="type==='3'" src="src1/assets/imagesD/type3.jpg" alt>
    <img v-if="type==='4'" src="src1/assets/imagesD/type4.jpg" alt>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { changeTitle } from '../../utils/func'
export default {
  data () {
    return {
      type: ''
    }
  },
  mounted () {
    this.type = this.$route.query.type
    this.hideLoad()
  },
  created () {
    changeTitle('帮助文档')
  },
  methods: {
    ...mapMutations(['hideLoad'])
  }
}
</script>

<style lang="less" scoped>
.imgWrap {
  img {
    width: 100%;
    display: block;
  }
}
</style>
