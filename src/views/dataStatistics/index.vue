<template>
  <div>
    <div class="data-content">
      <today-data></today-data>
    </div>
    <div class="data-content">
      <organization-data></organization-data>
    </div>
    <div class="data-content">
      <history-data></history-data>
    </div>
  </div>
</template>

<script>
import TodayData from "./components/todayData"
import OrganizationData from "./components/organizationData"
import HistoryData from "./components/historyData"
export default {
  name: '',
  components: { TodayData, HistoryData, OrganizationData },
  data () {
    return {

    }
  },

  mounted () { },

  methods: {}
}
</script>
<style lang='scss' scoped>
.data-content {
  margin-bottom: 40px;
}
</style>