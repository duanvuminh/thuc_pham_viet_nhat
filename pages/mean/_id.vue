<template>
  <v-col cols="11">
    <v-row align="end" justify="center">
      <Search :text="searchkey" />
    </v-row>
    <v-row justify="center">
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <v-card flat tile>
              <v-card-text class="pa-2">
                <HtmlParser v-if="webo.length>20" :content="webo"></HtmlParser>
                <template v-else>Đợi chút nhé...</template>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
import HtmlParser from "@/components/HtmlParser";
import Logo from "@/components/Logo";
//const HtmlParser = () => import("@/components/HtmlParser");
// const Ocard = () => import("@/components/Oboecard");
import Search from "@/components/nihongo/Search";
// const Search = () => import("@/components/nihongo/Search");

export default {
  async asyncData({ params, store, $axios }) {
    let email = store.state.user.email ? store.state.user.email : "undefined";
    let searchkey = params.id;
    let webo = "";
    return {
      searchkey,
      email,
      webo
    };
  },
  beforeCreate() {},
  components: {
    Search,
    HtmlParser,
    Logo
  },
  computed: {
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
    }
    // avartar() {
    //   return this.user.email ? this.user.email[0] : "^.^";
    // }
  },
  data() {
    return {
      email: "",
      searchkey: ""
    };
  },
  head() {
    return {
      titleTemplate: `%s - nghĩa ${this.searchkey}`
    };
  },
  layout: "oboesub",
  methods: {},
  mounted() {
     this.$axios
      .get(`/api/dic?id=${encodeURIComponent(this.searchkey)}`)
      .then(r => {
        this.webo = r.data.html?r.data.html:"Không có dữ liệu";
      });
  },
  watch: {}
};
</script>
<style >
table {
  width: auto;
}
</style>