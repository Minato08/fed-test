<template>
  <v-app dark>
    <nav-drawer />
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <loading-overlay v-if="loading" />
  </v-app>
</template>

<script>
import LoadingOverlay from '~/components/LoadingOverlay.vue'
import NavDrawer from '~/components/NavDrawer.vue'
export default {
  components: { NavDrawer, LoadingOverlay },
  data () {
    return {
      fixed: false,
      loading: false
    }
  },
  created () {
    this.$nuxt.$on('show-loading', () => {
      this.loading = true
    })
    this.$nuxt.$on('hide-loading', () => {
      this.loading = false
    })
  }
}
</script>
