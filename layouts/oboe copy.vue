<template>
  <v-app light ontouchstart>
    <!-- <v-app-bar flat app dark id="app-bar">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <v-app-bar-nav-icon @click="drawer=!drawer" v-if="loggedIn"></v-app-bar-nav-icon>
      <v-btn icon to="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn icon to="/manga">
        <v-icon>mdi-book-open-page-variant</v-icon>
      </v-btn>
      <v-btn icon to="/9gag">
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn v-if="!loggedIn" text to="/login" class="align-self-center">Login</v-btn>
    </v-app-bar>-->
    <v-app-bar
      absolute
      color="#6A76AB"
      dark
      src="https://picsum.photos/1920/1080?random"
      prominent
      shrink-on-scroll
      fade-img-on-scroll
      scroll-target="#scrolling-techniques-3"
      id="app-bar"
    >
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <v-btn icon class="cj-k headline">覚</v-btn>
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
          <v-list-item to="/manga">
              <v-list-item-title>Blog</v-list-item-title>
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

      <template v-slot:extension>
        <v-tabs align-with-title background-color="transparent">
          <v-tab to="/">Home</v-tab>
          <v-tab to="/9gag">Otaku</v-tab>
          <v-tab to="/forum">Forum</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-content id="scrolling-techniques-3" class="overflow-y-auto" style="max-height:100vh">
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
          {
            title: "Request",
            link: "/auth/request/"
          },
          {
            title: "Manga",
            link: "/auth/manga/"
          }
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
@function multiple-box-shadow ($n)
  $value: '#{random(2000)}px #{random(2000)}px #FFF'
  @for $i from 2 through $n
    $value: '#{$value} , #{random(2000)}px #{random(2000)}px #FFF'

  @return unquote($value)

$shadows-small:  multiple-box-shadow(700)
$shadows-medium: multiple-box-shadow(200)
$shadows-big:    multiple-box-shadow(100)

html
  overflow-y: auto

#app-bar
  background: radial-gradient(ellipse at bottom, #1B2735 0%, black 100%)
  overflow: hidden

#scrolling-techniques-3
  padding-top: 240px!important
.cj-k span
  font-family: Hiragino Mincho Pro,ヒラギノ明朝 Pro W3,ＭＳ 明朝,ＭＳ Ｐ明朝,serif

.display-4.nihongo
  font-family: Hiragino Mincho Pro, ヒラギノ明朝 Pro W3, ＭＳ 明朝, ＭＳ Ｐ明朝,
    serif :important

img
  max-width: 100%

#stars
  width: 1px
  height: 1px
  background: transparent
  box-shadow: $shadows-small
  animation         : animStar 50s linear infinite

  &:after
    content: " "
    position: absolute
    top: 2000px
    width: 1px
    height: 1px
    background: transparent
    box-shadow: $shadows-small

#stars2
  width: 2px
  height: 2px
  background: transparent
  box-shadow: $shadows-medium
  animation         : animStar 100s linear infinite

  &:after
    content: " "
    position: absolute
    top: 2000px
    width: 2px
    height: 2px
    background: transparent
    box-shadow: $shadows-medium

#stars3
  width: 3px
  height: 3px
  background: transparent
  box-shadow: $shadows-big
  animation         : animStar 150s linear infinite

  &:after
    content: " "
    position: absolute
    top: 2000px
    width: 3px
    height: 3px
    background: transparent
    box-shadow: $shadows-big

#title
  position: absolute
  top: 50%
  left: 0
  right: 0

  color: #FFF
  text-align: center
  font-family: 'lato',sans-serif
  font-weight: 300
  font-size: 50px
  letter-spacing: 10px

  margin-top: -60px
  padding-left: 10px

  span
    background: -webkit-linear-gradient(white, #38495a)
    -webkit-background-clip: text
    -webkit-text-fill-color: transparent

@keyframes animStar
  from
    transform: translateY(0px)
  to
    transform: translateY(-2000px)
</style>
