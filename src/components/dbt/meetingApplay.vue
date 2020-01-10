<template>
  <div class="meetingWrap">
    <Date></Date>
  </div>
</template>

<script>
import Date from './select/date'
import { changeTitle } from '../../utils/func'
import { mapMutations, mapActions } from 'vuex'
export default {
  data () {
    return {}
  },
  mounted () {
    this.hideLoad()
  },
  created () {
    changeTitle('青年演说家申请')
  },
  methods: {
    ...mapMutations(['hideLoad'])
  },
  components: { Date }
}
</script>

<style lang="less" scoped>
.meetingWrap {
  min-height: 100%;
  background: linear-gradient(180deg, #4a32e2 0%, #232aa6 100%);
}
</style>
