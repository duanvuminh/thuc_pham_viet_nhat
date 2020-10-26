<template>
  <v-app>
    <v-app-bar app elevation="0" color="transparent" dense>
      <v-spacer></v-spacer>
      <nuxt-link to="/forum" class="nuxt-link">Forum</nuxt-link>
      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="!loggedIn" to="/login">
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item>
          <template v-if="loggedIn">
            <v-list-item v-for="item in items" :key="item.title" :to="item.link">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
            <v-list-item to="/logout">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row class="fill-height" align="start" justify="center">
          <nuxt />
        </v-row>
      </v-container>
    </v-main>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">{{selectedTextShow}}</v-card-title>
        <v-card-text>
          <HtmlParser :content="$md.render(selectedTextApi.vi)"></HtmlParser>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template> 

<script>
import { mapState } from "vuex";
//const HtmlParser = () => import("@/components/HtmlParser");
import HtmlParser from "@/components/HtmlParser";

export default {
  components: {
    HtmlParser
  },
  data() {
    return {
      selectedText: "",
      selectedTextShow: "",
      selectedTextApi: {
        vi: ""
      },
      dialog: false
    };
  },
  mounted() {
    document.addEventListener("mouseup", this.autodetect);
    document.addEventListener("touchend", this.autodetect);
  },
  methods: {
    autodetect() {
      let text = "";
      if (window.getSelection) {
        text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
      }
      this.selectedText = text;
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    },
    ...mapState(["user"]),
    items() {
      // is triggered whenever the store state changes
      if (this.user.email == "duanvuminh@gmail.com") {
        return [
          // {
          //   title: "Kanji ngẫu nhiên",
          //   link: "/auth/random"
          // },
          //{ title: "About", icon: "question_answer" }
          // {
          //   title: "Request",
          //   link: "/auth/request/"
          // },
          // {
          //   title: "Manga",
          //   link: "/auth/manga/"
          // }
          //{ title: "Logout", icon: "mdi-logout", link: "/logout" }
        ];
      } else {
        return [
          // {
          //   title: "Kanji ngẫu nhiên",
          //   icon: "book",
          //   link: "/auth/random"
          // }
          //{ title: "About", icon: "question_answer" }
        ];
      }
    }
  },
  scrollToTop: true,
  watch: {
    dialog(value) {
      if (!value) {
        this.selectedText = "";
      }
    },
    selectedText(value) {
      if (value && value != this.$route.params.id) {
        this.$axios
          .$get("/api/get_post_by_id", {
            params: {
              id: value
            }
          })
          .then(r => {
            if (r && r.length > 0) {
              this.selectedTextShow = this.selectedText;
              this.selectedTextApi = r[0];
              this.dialog = true;
            }
          });
      }
    }
  }
};
</script>
<style>
.nuxt-link {
  text-decoration: none;
}
.nuxt-link:hover {
  opacity: 0.85;
  text-decoration: underline;
}
</style>
