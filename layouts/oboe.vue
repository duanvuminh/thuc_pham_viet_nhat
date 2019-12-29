<template>
  <v-app light v-show="connectedFirebase" ontouchstart="">
    <v-app-bar flat app dark>
          <v-app-bar-nav-icon @click="drawer=!drawer" v-if="loggedIn"></v-app-bar-nav-icon>
          <v-btn icon to="/" > <v-icon>mdi-home</v-icon></v-btn>
          <v-btn icon to="/manga"><v-icon>mdi-book-open-page-variant</v-icon></v-btn>
          <v-btn icon to="/9gag"> <v-icon>mdi-heart</v-icon></v-btn>
          <v-spacer />
          <v-btn v-if="!loggedIn" text to="/login" class="align-self-center">Login</v-btn>
      <v-img
      slot="img"
      src="/mainichi.jpg"
      max-height="100%"
      max-width="500"
    ></v-img>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer v-model="drawer" app>
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
      drawer: false,
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
    ...mapState(["user","connectedFirebase"]),
    items() {
      // is triggered whenever the store state changes
      if (this.user.email == "duanvuminh@gmail.com") {
        return [
          {
            title: "Kanji ngẫu nhiên",
            icon: "book",
            link: "/auth/random"
          },
          //{ title: "About", icon: "question_answer" }
          {
            title: "Request",
            icon: "mdi-bell-check-outline",
            link: "/auth/request/"
          },
          {
            title: "Manga",
            icon: "mdi-chat",
            link: "/auth/manga/"
          },
          { title: "Logout", icon: "mdi-logout", link: "/logout" }
        ];
      } else {
        return [
          {
            title: "Kanji ngẫu nhiên",
            icon: "book",
            link: "/auth/random"
          },
          //{ title: "About", icon: "question_answer" }
          { title: "Logout", icon: "mdi-logout", link: "/logout" }
        ];
      }
    }
  },
  scrollToTop:true,
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
.display-4.nihongo {
  font-family: Hiragino Mincho Pro, ヒラギノ明朝 Pro W3, ＭＳ 明朝, ＭＳ Ｐ明朝,
    serif !important;
}
img {
  max-width: 100%;
}
</style>
