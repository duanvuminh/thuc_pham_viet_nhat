<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list class="pt-0">
        <template v-for="(item, i) in items">
          <v-list-item :to="item.to" router exact v-if="item.show" :key="i">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="cyan" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-content color="white">
      <v-container fluid >
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app color="cyan" dark>
      <span>&copy; 2019</span>

      <v-btn absolute dark fab top right color="pink" v-if="showPlus" href="/auth/create">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-footer>
  </v-app>
</template> 

<script>
export default {
  components: {},
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "ViJa"
    };
  },
  computed: {
    showPlus() {
      return this.$store.state.showPlus;
    },
    items() {
      let rs = [
        {
          icon: "mdi-home",
          title: "Trang chủ",
          to: "/",
          show: true
        },
        {
          icon: "mdi-account-box",
          title: "Trang cá nhân",
          to: "/auth/",
          show: this.$store.state.loggedIn
        },
        {
          icon: "mdi-apps",
          title: "Liên hệ",
          to: "/contacts",
          show: true
        }
      ];
      rs.push({
        icon: "mdi-chart-bubble",
        title: this.$store.state.loggedIn ? "Logout" : "Login",
        to: this.$store.state.loggedIn ? "logout" : "login",
        show: true
      });
      return rs;
    }
  }
};
</script>
