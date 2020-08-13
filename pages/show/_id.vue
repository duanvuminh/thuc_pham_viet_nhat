<template>
  <v-col cols="12" md="8">
    <v-row align="end" justify="center">
      <Search :text="searchkey" />
    </v-row>
    <v-row justify="center">
      <v-col cols="12">
        <v-row>
          <v-col cols="12" v-for="(oboe,i) in items" :key="i">
            <Ocard v-if="i==0" :item="oboe" :searchkey="searchkey" :email="email">
              <Strockes :kanji="$route.params.id[0]" />
            </Ocard>
            <Ocard v-else :item="oboe" :searchkey="searchkey" :email="email"></Ocard>
          </v-col>
        </v-row>
        <v-dialog v-model="dialog" fullscreen>
          <v-card>
            <v-card-title>
              <span class="title font-weight-light">Cảm ơn bạn đã đóng góp ý kiến</span>
            </v-card-title>
            <v-card-text>
              <v-textarea
                :outlined="!readonly"
                :solo="readonly"
                :flat="readonly"
                label="Thêm cách nhớ của bạn"
                :auto-grow="showEdit"
                v-model="commentvi"
                :loading="loading"
                :readonly="readonly"
                @focus="show = true"
                hide-details
              />
              <v-row>
                <v-spacer />
                <v-btn class="ma-2" color="success" @click="save" small text>Lưu</v-btn>
                <v-btn class="ma-2" text @click="showEdit=false" small>Huỷ</v-btn>
              </v-row>
              <HtmlParser
                class="elevation-1 pa-2 mb-3 deep-purple accent-1"
                v-if="commentvi!=''"
                :content="$md.render(commentvi)"
              >
                <h3>Preview</h3>
              </HtmlParser>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-btn
      v-if="$store.state.loggedIn"
      color="pink"
      dark
      fixed
      bottom
      right
      fab
      @click="showEdit=!showEdit"
    >
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
  </v-col>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
import HtmlParser from "@/components/HtmlParser";
import Logo from "@/components/Logo";
//const HtmlParser = () => import("@/components/HtmlParser");
import Strockes from "@/components/Strockes";
// const Strockes = () => import("@/components/Strockes");
import Ocard from "@/components/Oboecard";
// const Ocard = () => import("@/components/Oboecard");
import Search from "@/components/nihongo/Search";
// const Search = () => import("@/components/nihongo/Search");

export default {
  async asyncData({ params, store, $axios }) {
    let email = store.state.user.email ? store.state.user.email : "undefined";
    let items = await $axios
      .$get("/api/get_post_by_id", {
        params: {
          id: params.id[0],
        },
      })
      .then();
    let searchkey = params.id;
    return {
      searchkey,
      email,
      items,
    };
  },
  beforeCreate() {},
  components: {
    Ocard,
    Search,
    HtmlParser,
    Strockes,
    Logo,
  },
  computed: {
    dialog() {
      return this.$store.state.loggedIn && this.showEdit;
    },
    readonly() {
      return !this.$store.state.loggedIn;
    },
    placeholder() {
      return this.$store.state.loggedIn ? "" : "Đăng nhập để chỉnh sửa";
    },
    show1() {
      if (!this.$store.state.loggedIn) {
        return false;
      } else {
        return this.show;
      }
    },
    // avartar() {
    //   return this.user.email ? this.user.email[0] : "^.^";
    // }
  },
  data() {
    return {
      basecomment: "",
      commentvi: "",
      color: "",
      email: "",
      items: [],
      loading: false,
      loading1: false,
      show: false,
      showEdit: false,
      searchkey: "",
    };
  },
  head() {
    return {
      titleTemplate: `%s - cách nhớ kanji ${this.searchkey}`,
    };
  },
  layout: "oboesub",
  methods: {
    async saveandshare() {
      this.loading = true;
      let items = await this.$axios.$post("/api/post1", null, {
        params: {
          searchkey: this.searchkey[0],
          vi: this.commentvi,
        },
      });
      this.loading = false;
    },
    async save() {
      this.loading = true;
      await this.$axios
        .$post("/api/post", null, {
          params: {
            searchkey: this.searchkey[0],
            vi: this.commentvi,
          },
        })
        .then((x) => {
          if (this.items.lenght > 0) {
            for (let i = 0; i < this.items.length; i++) {
              if (this.items[i].id == this.email) {
                this.items[i].vi = this.commentvi;
                break;
              }
            }
          } else {
            this.items[0] = {
              id: this.email,
              vi: this.commentvi,
            };
          }
        });
      this.loading = false;
      this.showEdit = false;
    },
  },
  mounted() {
    // console.log(this.webo);
    // console.log("im here");
    firebase
      .firestore()
      .collection("kanji")
      .doc(this.searchkey[0])
      .collection("oboe")
      .doc(this.email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.commentvi = doc.data().vi;
        }
      });
    // init tab
    // hiển thị nghĩa
    // hiển thị ví dụ
    // hiển thị ngữ pháp
    // this.tabs = [];
    //this.tabs[0] = {
    // webo:"",
    //  text: "",
    //  label: "Oboe"
    //};
    //this.tabs[1] = {
    //  webo:"",
    //  text: "",
    //  label: "Nghĩa"
    //};
    //this.tabs[2] = {
    //  webo:"",
    //  text: "",
    //  label: "Kanji"
    //};
    //this.tabs[3] = {
    //  webo:"",
    //  text: "",
    //  label: "Mẫu"
    //};
    //this.getMean()
    //Promise.all([this.getMean(), this.getKanji(), this.getExample()]).then(
    //  () => {
    //    this.insertMtoF();
    //    this.tab = this.searchkey.length > 1 ? "tab-1" : null;
    //    console.log(this.tabs)
    //  }
    //);
  },
  watch: {},
};
</script>
<style >
table {
  width: auto;
}
</style>