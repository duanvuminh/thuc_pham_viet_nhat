<template>
  <v-app light ontouchstart>
    <v-app-bar
      absolute
      color="teal lighten-3"
      dense
      dark
      hide-on-scroll
      elevate-on-scroll
      scroll-target="#scrolling-techniques-4"
    >
      <v-btn icon to="/" class="cj-k headline">
        覚
      </v-btn>
      <v-toolbar-title>Oboe</v-toolbar-title>

      <v-spacer></v-spacer>
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
          <template v-else>
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
    <v-content id="scrolling-techniques-4">
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
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
      dialog: false,
      drawer: false
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
<style lang="sass">
#scrolling-techniques-4
  padding-top: 50px!important

img
  max-width: 100%
</style>
