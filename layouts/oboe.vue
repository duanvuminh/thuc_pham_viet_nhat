<template>
  <v-app light>
    <v-app-bar flat app dense>
      <v-container>
        <v-row>
          <v-app-bar-nav-icon class="align-self-center" @click="drawer=!drawer" v-if="loggedIn"></v-app-bar-nav-icon>
          <v-btn text to="/" class="align-self-center">Home</v-btn>
          <v-btn text to="/9gag" class="align-self-center">❤️Japan</v-btn>
          <v-spacer />
          <v-btn v-if="!loggedIn" text to="/login" class="align-self-center">Login</v-btn>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-content>
      <v-container class="fill-height">
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer v-model="drawer" aria-haspopup="">
      <v-list-item>
        <v-list-item-avatar>
          <img src="/logo.png" alt="oboe" />
        </v-list-item-avatar>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template> 

<script>
import firebase from "firebase";
import { mapState } from "vuex";
export default {
  data() {
    return {
      drawer: false
    };
  },
  methods: {},
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    },
    ...mapState(["user"]),
    items() {
      // is triggered whenever the store state changes
      if (this.user.email == "duanvuminh@gmail.com") {
        return [
          {
            title: "Danh sách của tôi",
            icon: "dashboard",
            link: "/auth/mypage"
          },
          //{ title: "About", icon: "question_answer" }
          { title: "Request", icon: "mdi-bell-check-outline ", link: "/auth/request/" },
          { title: "Logout", icon: "mdi-logout", link: "/logout" }
        ];
      } else {
        return [
          {
            title: "Danh sách của tôi",
            icon: "dashboard",
            link: "/auth/mypage"
          },
          //{ title: "About", icon: "question_answer" }
          { title: "Logout", icon: "mdi-logout", link: "/logout" }
        ];
      }
    }
  }
};
</script>
<style>
.display-4.nihongo {
  font-family: Hiragino Mincho Pro, ヒラギノ明朝 Pro W3, ＭＳ 明朝, ＭＳ Ｐ明朝,
    serif !important;
}
img {
  max-width: 100%;
}
</style>
