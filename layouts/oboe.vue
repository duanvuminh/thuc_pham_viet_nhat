<template>
  <v-app light v-show="connectedFirebase" ontouchstart>
    <v-app-bar flat app dark id="app-bar">
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
const HtmlParser = ()=>import("@/components/HtmlParser");

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
    ...mapState(["user", "connectedFirebase"]),
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
/* @import compass */
@function multiple-box-shadow ($n) 
  $value: '#{random(2000)}px #{random(2000)}px #FFF'
  @for $i from 2 through $n
    $value: '#{$value} , #{random(2000)}px #{random(2000)}px #FFF'

  @return unquote($value)

$shadows-small:  multiple-box-shadow(700)
$shadows-medium: multiple-box-shadow(200)
$shadows-big:    multiple-box-shadow(100)

#app-bar
  background: radial-gradient(ellipse at bottom, #1B2735 0%, black 100%)
  overflow: hidden
  opacity:0.85

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
