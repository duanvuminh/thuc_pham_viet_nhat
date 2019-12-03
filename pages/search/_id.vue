<template>
  <v-row justify="center">
    <v-col cols="12" sm="9">
      <v-text-field
        solo
        label="Search"
        prepend-inner-icon="mdi-magnify"
        clearable
        @keypress="search"
        v-model="searchkey"
        hide-details
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-row class="d-flex flex-nowrap">
        <v-col class="flex-grow-0 flex-shrink-1">
          <h1 class="display-4 nihongo">{{$route.params.id}}</h1>
        </v-col>

        <v-col class="flex-grow-1">
          <div class="elevation-1 pa-2 mb-3" v-if="commentvi!=''" v-html="$md.render(commentvi)"></div>
          <v-textarea
            outlined
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
        </v-col>
      </v-row>
      <v-row v-show="show1">
        <v-spacer />
        <v-btn class="ma-2" color="success" @click="save">Lưu</v-btn>
        <v-btn class="ma-2" text @click="show=false">Huỷ</v-btn>
      </v-row>
    </v-col>
    <v-col cols="12" v-for="(item,i) in items" :key="i">
      <v-card class="mx-auto">
        <v-card-text v-html="$md.render(item.vi)"></v-card-text>

        <v-card-actions>
          <v-btn v-if="item.id=='duanvuminh@gmail.com'" text color="deep-purple accent-4">
            <v-icon left>mdi-star-outline</v-icon>Offical
          </v-btn>
          <v-btn v-else color="orange" text dark>{{item.id}}</v-btn>
          <v-spacer></v-spacer>
          <v-btn :color="color" text icon @click="like(item)">
            <v-icon>mdi-thumb-up</v-icon>
          </v-btn>
          <!-- color="blue lighten-2" -->
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import firebase from "firebase";
export default {
  async asyncData({ params, store }) {
    let email = store.state.user.email ? store.state.user.email : "undefined";
    let item = await firebase
      .app()
      .firestore()
      .collection("kanji")
      .doc(params.id)
      .collection("oboe")
      .doc(email)
      .get();
    let docs = await firebase
      .app()
      .firestore()
      .collection("kanji")
      .doc(params.id)
      .collection("oboe")
      .get();
    let items = [];
    docs.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      items.push({ id: doc.id, ...doc.data() });
    });
    let searchkey = params.id;
    if (item.data()) {
      return {
        searchkey,
        email,
        items,
        commentvi: item.data().vi
      };
    } else {
      return {
        searchkey,
        email,
        items
      };
    }
  },
  beforeCreate() {},
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
      basename: "",
      basecomment: "",
      commentvi: "",
      color:"",
      email: "",
      items: [],
      loading: false,
      show: false,
      searchkey: "",
      valid: true
    };
  },
  layout: "oboe",
  methods: {
    search(e) {
      if (
        e.key == "Enter" &&
        this.searchkey.replace(/(\r\n|\n|\r)/gm, "").trim()
      ) {
        this.$router.push(`/search/${this.searchkey[0]}`);
      }
    },
    save() {
      this.loading = true;
      firebase
        .app()
        .firestore()
        .collection("kanji")
        .doc(this.searchkey)
        .collection("oboe")
        .doc(this.email)
        .set(
          {
            vi: this.commentvi
          },
          { merge: true }
        )
        .then(r => {
          this.loading = false;
        });
    }
  },
  mounted() {},
  watch: {
    basename() {
      if (this.basename) {
        firebase
          .app()
          .firestore()
          .collection("kanjicore")
          .doc(this.basename)
          .get()
          .then(r => {
            if (r.data()) {
              this.basecomment = r.data().content;
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
</style>