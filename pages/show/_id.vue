<template>
  <v-row justify="center">
    <Search :text="searchkey" />
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <v-tabs
            v-model="tab"
            background-color="deep-purple accent-4"
            class="elevation-0"
            dark
            show-arrows
            ref="tabs"
          >
            <v-tabs-slider></v-tabs-slider>
            <v-tab v-for="(item,index) in tabs" :key="index" :href="`#tab-${index}`">{{item.label}}</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab" touchless>
            <v-tab-item v-for="(item,index) in tabs" :key="index" :value="'tab-' + index">
              <v-card flat tile>
                <v-card-text class="pa-2">
                  <template v-if="index==0">
                    <Strockes :kanji="$route.params.id[0]" />
                    <v-btn v-if="$store.state.loggedIn" icon @click="showEdit=!showEdit" style="position:absolute;right:0;top:0">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <div v-if="$store.state.loggedIn" v-show="showEdit">
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
                      <v-row v-if="show1">
                        <v-spacer />
                        <v-btn class="ma-2" color="success" @click="save" small text>Lưu</v-btn>
                        <v-btn
                          class="ma-2"
                          color="success"
                          @click="saveandshare"
                          small
                          text
                        >Lưu&chia sẻ</v-btn>
                        <v-btn class="ma-2" text @click="showEdit=false" small>Huỷ</v-btn>
                      </v-row>
                      <HtmlParser
                        v-show="show1"
                        class="elevation-1 pa-2 mb-3 deep-purple accent-1"
                        v-if="commentvi!=''"
                        :content="$md.render(commentvi)"
                      >
                        <h3>Preview</h3>
                      </HtmlParser>
                    </div>
                    <v-row>
                      <v-col cols="12" v-for="(oboe,i) in items" :key="i">
                        <Ocard :item="oboe" :searchkey="searchkey" :email="email"></Ocard>
                      </v-col>
                    </v-row>
                  </template>
                  <div v-else v-html="$md.render(item.text)"></div>
                  <HtmlParser v-show="item.webo" :content="item.webo"></HtmlParser>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
import HtmlParser from "@/components/HtmlParser";
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
          id: params.id[0]
        }
      })
      .then();
    let searchkey = params.id;
    let webo = "";
    return {
      searchkey,
      email,
      items,
      webo
    };
  },
  beforeCreate() {},
  components: {
    Ocard,
    Search,
    HtmlParser,
    Strockes
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
      tab: "",
      tabs: [
        {
          webo: "",
          text: "",
          label: "Oboe"
        },
        {
          webo: "",
          text: "",
          label: "Nghĩa"
        }
      ]
    };
  },
  head() {
    return {
      titleTemplate: `%s - cách nhớ ${this.searchkey}`
    };
  },
  layout: "forum",
  methods: {
    async saveandshare() {
      this.loading = true;
      let items = await this.$axios.$post("/api/post1", null, {
        params: {
          searchkey: this.searchkey[0],
          vi: this.commentvi
        }
      });
      this.loading = false;
    },
    async save() {
      this.loading = true;
      let items = await this.$axios.$post("/api/post", null, {
        params: {
          searchkey: this.searchkey[0],
          vi: this.commentvi
        }
      });
      this.loading = false;
    }
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
      .then(doc => {
        if (doc.exists) {
          this.commentvi = doc.data().vi;
        }
      });
    this.$axios
      .get(`/api/dic?id=${encodeURIComponent(this.searchkey)}`)
      .then(r => {
        this.webo = r.data.html;
        this.tabs[1].webo = this.webo;
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
  watch: {}
};
</script>
<style >
table {
  width: auto;
}
</style>