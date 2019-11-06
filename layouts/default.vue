<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list class="pt-0">
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="cyan" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-content color="white">
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app color="cyan" dark>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  components: {
  },
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
    items() {
      let rs = [
        {
          icon: "mdi-home",
          title: "Trang chủ",
          to: "/"
        },
        {
          icon: "mdi-apps",
          title: "Liên hệ",
          to: "/contacts"
        }
      ];
      
      rs.push({
        icon: "mdi-chart-bubble",
        title: this.$store.state.loggedIn ? "Logout" : "Login",
        to: this.$store.state.loggedIn ? "logout" : "login"
      });
      return rs;
    }
  }
};
</script>
