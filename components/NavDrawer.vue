<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="false"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          exact
          @click="navigateTo(item.title)"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'NavDrawer',
  data () {
    return {
      drawer: false,
      clipped: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Home'
        },
        {
          icon: 'mdi-logout',
          title: 'Logout'
        }
      ]
    }
  },
  methods: {
    navigateTo (menu) {
      if (menu === 'Home') {
        this.$router.push({ path: '/' })
      } else if (menu === 'Logout') {
        this.logout()
      }
    },
    async logout () {
      // submit form to server/API here...
      try {
        await this.$auth.logout()
        this.$router.push({ path: '/login' })
      } catch (err) {
        this.$router.push({ path: '/login' })
      }
    }
  }
}
</script>
