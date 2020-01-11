<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-text-field
        solo
        label="Search"
        prepend-inner-icon="mdi-magnify"
        clearable
        @keypress="search"
        @blur="search1"
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
          <v-textarea
            label="Thêm cách nhớ của bạn(tiếng anh)"
            outlined
            auto-grow
            v-model="commenten"
            rows="1"
            dense
            @focus="show = true"
          ></v-textarea>
          <v-textarea
            outlined
            label="Thêm cách nhớ của bạn"
            auto-grow
            v-model="commentvi"
            rows="1"
            dense
            @focus="show = true"
          />
          <HtmlParser :content="$md.render(commentvi)"></HtmlParser>
        </v-col>
      </v-row>
      <v-row v-show="show">
        <v-spacer />
        <v-btn class="ma-2" color="success" @click="save">Lưu</v-btn>
        <v-btn class="ma-2" color="success" @click="dialog=true">Tạo bộ</v-btn>
        <v-btn class="ma-2" text @click="show=false">Huỷ</v-btn>
      </v-row>
    </v-col>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-form ref="form" v-model="valid">
        <v-card>
          <v-card-title>
            <span class="headline">Tạo bộ</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-file-input
                    v-model="files"
                    placeholder="Upload ảnh bài viết"
                    label="Ảnh bài viết"
                    multiple
                    prepend-icon="mdi-paperclip"
                    accept="image/png, image/jpeg, image/bmp"
                  >
                    <template v-slot:selection="{ text }">
                      <v-chip small label color="primary">{{ text }}</v-chip>
                    </template>
                  </v-file-input>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="basename"
                    label="Tên bộ *"
                    :rules="[v => !!v || 'Không được trống']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <HtmlParser :content="$md.render(basecomment)"></HtmlParser>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="basecomment"
                    label="Giải thích *"
                    :rules="[v => !!v || 'Không được trống']"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialog = false">Đóng</v-btn>
            <v-btn color="blue darken-1" text @click="taobo">Lưu</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
//import HtmlParser from "@/components/HtmlParser";
const HtmlParser = ()=>import("@/components/HtmlParser")
export default {
  async asyncData({ params, store }) {
    let email = store.state.user.email;
    let item = await firebase
      .firestore()
      .collection("kanji")
      .doc(params.id)
      .collection("oboe")
      .doc(email)
      .get();
    let searchkey = params.id;
    if (item.data()) {
      return {
        searchkey,
        email,
        commenten: item.data().en,
        commentvi: item.data().vi
      };
    } else {
      return {
        searchkey,
        email
      };
    }
  },
  beforeCreate() {},
  components: {
    HtmlParser
  },
  computed: {
    // readonly() {
    //   return !this.$store.state.loggedIn;
    // },
    // placeholder() {
    //   return this.$store.state.loggedIn ? "" : "Đăng nhập để chỉnh sửa";
    // },
    // avartar() {
    //   return this.user.email ? this.user.email[0] : "^.^";
    // }
  },
  data() {
    return {
      basename: "",
      basecomment: "",
      commenten: "",
      commentvi: "",
      dialog: false,
      email: "",
      files: [],
      show: false,
      searchkey: "",
      valid: true
    };
  },
  layout: "oboe",
  methods: {
    search1() {
      if (this.searchkey.replace(/(\r\n|\n|\r)/gm, "").trim()) {
        this.$router.push(`/auth/show/${this.searchkey[0]}`);
      }
    },
    search(e) {
      if (
        e.key == "Enter" &&
        this.searchkey.replace(/(\r\n|\n|\r)/gm, "").trim()
      ) {
        this.$router.push(`/auth/show/${this.searchkey[0]}`);
      }
    },
    save() {
      this.loading = true;
      firebase
        .firestore()
        .collection("kanji")
        .doc(this.searchkey)
        .set(
          {
            name: this.searchkey
          },
          { merge: true }
        )
        .then(r => {
          firebase
            .firestore()
            .collection("kanji")
            .doc(this.searchkey)
            .collection("oboe")
            .doc(this.email)
            .set(
              {
                couter: 999999,
                en: this.commenten,
                vi: this.commentvi
              },
              { merge: true }
            )
            .then(r => {
              this.loading = false;
            });
        });
    },
    taobo() {
      if (!this.$refs.form.validate()) {
        return;
      } else {
        if (this.files.length > 0) {
          Promise.all(
            // Array of "Promises"
            this.files.map(item => {
              var ref = firebase.storage().ref("kanjiMain/" + this.basename);
              return ref.put(item).then(r => {
                return ref.getDownloadURL();
              });
            })
          ).then(url => {
            firebase
              .firestore()
              .collection("kanjicore")
              .doc(this.basename)
              .set(
                {
                  en: this.basename,
                  vi: this.basecomment,
                  url: url[0]
                },
                { merge: true }
              );
          });
        } else {
          firebase
            .firestore()
            .collection("kanjicore")
            .doc(this.basename)
            .set(
              {
                en: this.basename,
                vi: this.basecomment
              },
              { merge: true }
            );
        }

        ///
        //
        ///
        this.dialog = false;
      }
    }
  },
  mounted() {},
  watch: {
    commenten() {
      if (this.commentvi) {
        return;
      }
      this.$axios
        .$post(
          "https://translation.googleapis.com/language/translate/v2?key=AIzaSyCgybxabzEcfCXOeZHVrwVenvrtY7OkV3M",
          {
            q: this.commenten,
            source: "en",
            target: "vi",
            format: "text"
          }
        )
        .then(r => {
          this.commentvi = r.data.translations[0].translatedText;
        });
    },
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
              this.basecomment = r.data().vi;
            } else {
              this.$axios
                .$post(
                  "https://translation.googleapis.com/language/translate/v2?key=AIzaSyCgybxabzEcfCXOeZHVrwVenvrtY7OkV3M",
                  {
                    q: this.basename,
                    source: "en",
                    target: "vi",
                    format: "text"
                  }
                )
                .then(r => {
                  this.basecomment = r.data.translations[0].translatedText;
                });
            }
          });
      }
    }
  },
  commentvi() {
    if (!this.commentvi) {
      this.$axios
        .$post(
          "https://translation.googleapis.com/language/translate/v2?key=AIzaSyCgybxabzEcfCXOeZHVrwVenvrtY7OkV3M",
          {
            q: this.commenten,
            source: "en",
            target: "vi",
            format: "text"
          }
        )
        .then(r => {
          this.commentvi = r.data.translations[0].translatedText;
        });
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