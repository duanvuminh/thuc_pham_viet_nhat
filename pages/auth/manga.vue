<template>
  <v-form ref="form" v-model="valid" onSubmit="return false;">
    <v-card>
      <v-card-title>
        <span class="headline">Học tiếng nhật với manga</span>
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
                label="Id *"
                :rules="[v => !!v || 'Không được trống']"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <HtmlParser :content="$md.render(basecomment)"></HtmlParser>
            </v-col>
            <v-col cols="12">
              <v-textarea
                auto-grow
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
        <v-btn color="blue darken-1" text @click="taomanga" :loading="loading"
      :disabled="loading">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script>
//import HtmlParser from "@/components/HtmlParser";
const HtmlParser=()=>import("@/components/HtmlParser")
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
export default {
  components: {
    HtmlParser
  },
  data() {
    return {
      basename: "",
      basecomment: "",
      //   commenten: "",
      //   commentvi: "",
      //   dialog: false,
      //   email: "",
      files: [],
      //   show: false,
      //   searchkey: "",
      valid: true,
      loading:false
    };
  },
  layout: "oboe",
  methods: {
    taomanga() {
      if (!this.$refs.form.validate()) {
        return;
      } else {
        if (this.files.length > 0) {
          this.loading = true
          Promise.all(
            // Array of "Promises"
            this.files.map(item => {
              var ref = firebase
                .storage()
                .ref(
                  "manga/" + this.$store.state.user.email + "/" + this.basename
                );
              return ref.put(item).then(r => {
                return ref.getDownloadURL();
              });
            })
          ).then(url => {
            firebase
              .firestore()
              .collection("manga")
              .doc(this.basename)
              .set(
                {
                  edited: new Date(),
                  content: this.basecomment,
                  url: url[0]
                },
                { merge: true }
              ).then(r=>this.loading=false);
          });
        } else {
          this.loading = true
          firebase
            .firestore()
            .collection("manga")
            .doc(this.basename)
            .set(
              {
                edited: new Date(),
                content: this.basecomment
              },
              { merge: true }
            ).then(r=>this.loading=false);
        }
      }
    }
  },
  watch:{
      basename() {
      if (this.basename) {
        firebase
          .app()
          .firestore()
          .collection("manga")
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