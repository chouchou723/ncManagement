<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import tenantDashboard from './tenantHome/indexFinal'
import adminDashboard from './adminHome/indexFinal'
import userDashboard from './userHome/indexFinal'

export default {
  name: 'Dashboard',
  components: { adminDashboard ,userDashboard,tenantDashboard},
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
  },
  created() {
      let role = sessionStorage.getItem('role');
      this.currentRole = role==='admin'?'adminDashboard':role==='tenant'?'tenantDashboard':'userDashboard'
  }
}
</script>