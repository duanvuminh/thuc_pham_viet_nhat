<template>
  <v-form ref="form" v-model="valid" onsubmit="return false;">
    <v-card>
      <v-card-title>
        <span class="headline">Học tiếng nhật với manga</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="id" label="Id *" :rules="[v => !!v || 'Không được trống']"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="type"
                label="Phân loại *"
                :rules="[v => !!v || 'Không được trống']"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="title"
                label="Tiêu đề *"
                :rules="[v => !!v || 'Không được trống']"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <HtmlParser :content="$md.render(content)"></HtmlParser>
            </v-col>
            <v-col cols="12">
              <v-textarea
                auto-grow
                v-model="content"
                label="Giải thích *"
                :rules="[v => !!v || 'Không được trống']"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="save" :loading="loading" :disabled="loading">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script>
//import HtmlParser from "@/components/HtmlParser";
const HtmlParser = () => import("@/components/HtmlParser");
import firebase from "firebase/app";
import "firebase/firestore";
import { mapState } from "vuex";
const algoliasearch = require("algoliasearch");

const client = algoliasearch("N7UFARQ48L", "8d219c45506c851ab82563e0297891dd");
const indexAlgolia = client.initIndex("oboe");

export default {
  components: {
    HtmlParser
  },
  computed: {
    ...mapState(["user"])
  },
  data() {
    return {
      id: "",
      type: "",
      content: "",
      title: "",
      //   commenten: "",
      //   commentvi: "",
      //   dialog: false,
      //   email: "",
      //   show: false,
      //   searchkey: "",
      valid: true,
      loading: false
    };
  },
  layout: "oboe",
  methods: {
    save() {
      if (!this.$refs.form.validate()) {
        return;
      } else {
        this.loading = true;
        firebase
          .firestore()
          .collection("grammar")
          .doc(this.id)
          .set(
            {
              edited: new Date(),
              editor: this.user.email,
              content: this.content,
              type: this.type,
              title: this.title,
            },
            { merge: true }
          )
          .then(r => {
            const objects = [
              {
                objectID:  this.id,
                id: this.id,
                edited: new Date(),
                editor: this.user.email,
                content: this.content,
                title: this.title,
                type: this.type
              }
            ];

            indexAlgolia.addObjects(objects, (err, content) => {
              this.loading = false;
            });
          });
      }
    }
  },
  watch: {
    id() {
      if (this.id) {
        firebase
          .app()
          .firestore()
          .collection("grammar")
          .doc(this.id)
          .get()
          .then(r => {
            if (r.data()) {
              this.content = r.data().content;
              this.type = r.data().type;
              this.title= r.data().title;
            }
          });
      }
    }
  }
};
</script>