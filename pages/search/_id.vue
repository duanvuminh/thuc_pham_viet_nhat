<template>
  <v-row justify="center">
    <Search :text="searchkey" />
    <v-col cols="12">
      <v-row class="d-flex flex-nowrap">
        <v-col class="flex-grow-0 flex-shrink-1">
          <h1 class="display-4 nihongo">{{$route.params.id}}</h1>
        </v-col>

        <v-col class="flex-grow-1">
          <v-textarea
            :outlined="!readonly"
            :solo="readonly"
            :flat="readonly"
            label="Thêm cách nhớ của bạn"
            auto-grow
            v-model="commentvi"
            rows="1"
            :loading="loading"
            :readonly="readonly"
            :placeholder="placeholder"
            @focus="show = true"
            hide-details
          />
          <v-row v-if="show1">
            <v-spacer />
            <v-btn class="ma-2" color="success" @click="save" small text>Lưu</v-btn>
            <v-btn class="ma-2" color="success" @click="saveandshare" small text>Lưu & chia sẻ</v-btn>
            <v-btn class="ma-2" text @click="show=false" small>Huỷ</v-btn>
          </v-row>
          <HtmlParser
            v-show="show1"
            class="elevation-1 pa-2 mb-3"
            v-if="commentvi!=''"
            :content="$md.render(commentvi)"
          ></HtmlParser>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" v-for="(item,i) in items" :key="i">
      <Ocard :item="item" :searchkey="searchkey" :email="email"></Ocard>
    </v-col>
  </v-row>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
import HtmlParser from "@/components/HtmlParser";


import Ocard from "@/components/Oboecard";
import Search from "@/components/nihongo/Search";

export default {
  async asyncData({ params, store, $axios }) {
    console.log(params);
    let email = store.state.user.email ? store.state.user.email : "undefined";
    let items = await $axios
      .$get("/api/get_post_by_id", {
        params: {
          id: params.id
        }
      })
      .then();
    let searchkey = params.id;
    return {
      searchkey,
      email,
      items
    };
  },
  beforeCreate() {},
  components: {
    Ocard,
    Search,
    HtmlParser
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
      searchkey: "",
      valid: true
    };
  },
  head() {
    return {
      titleTemplate: `%s - cách nhớ ${this.searchkey}`
    };
  },
  layout: "oboe",
  methods: {
    async saveandshare() {
      this.loading = true;
      let items = await this.$axios.$post("/api/post1", null, {
        params: {
          searchkey: this.searchkey,
          vi: this.commentvi
        }
      });
      this.loading = false;
    },
    async save() {
      this.loading = true;
      let items = await this.$axios.$post("/api/post", null, {
        params: {
          searchkey: this.searchkey,
          vi: this.commentvi
        }
      });
      this.loading = false;
    }
  },
  async mounted() {
    let item = await firebase
      .firestore()
      .collection("kanji")
      .doc(this.searchkey)
      .collection("oboe")
      .doc(this.email)
      .get();
    if (item.exists) {
      this.commentvi = item.data().vi;
    }
  },
  watch: {}
};
</script>