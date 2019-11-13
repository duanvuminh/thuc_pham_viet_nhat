<template>
  <v-form v-model="valid" ref="form">
    <v-row class="md" align="start" justify="start" align-content="space-around">
      <v-col cols="12" md="6">
        <v-text-field label="Tiêu đề bài viết" v-model="name" :rules="rules.nameRules"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field label="Địa điểm" v-model="address"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Tag, phân loại bài viết"
          hint="Phân loại cách nhau dấu ,"
          v-model="type"
          :rules="rules.typeRules"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
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
        <v-textarea
          outlined
          auto-grow
          no-resize
          label="SEO"
          placeholder="Từ khoá cho SEO"
          hint="Bạn nghĩ rằng mọi người sẽ tìm kiếm bài viết của bạn bằng từ khoá nào(Ngăn cách bằng dấu phảy)"
          v-model="seo"
        ></v-textarea>
      </v-col>
      <v-col cols="12" md="6">
        <v-textarea
          outlined
          no-resize
          auto-grow
          name="input-7-4"
          placeholder="Nội dung bài viết"
          label="Nội dung"
          v-model="content"
          :rules="rules.contentRules"
        ></v-textarea>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="elevation-1">
          <v-card-title>Preview</v-card-title>
          <v-card-subtitle>
            <a href="https://miaolz123.github.io/vue-markdown/">Cách viết tại đây</a>
          </v-card-subtitle>
          <div v-html="$md.render(content)" class="pa-2"></div>
        </v-card>
      </v-col>
      <v-col class="text-center" cols="12">
        <div class="my-2">
          <v-btn large color="primary" @click="save">Tạo mới</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
import firebase from "firebase";
const algoliasearch = require("algoliasearch");

const client = algoliasearch("N7UFARQ48L", "0f4b8cf4d4b946f94b9bac03c2b8782d");
const indexAlgolia = client.initIndex("GaoNhat_algolia");

export default {
  beforeCreate() {
    // ここでローディングのインジケータアニメーションを表示すると良い
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // console.log(user);
        this.email = user.email;
        this.$store.commit("setLoginState", true);
      } else {
        this.$store.commit("setLoginState", false);
        this.$router.push("/login");
      }
    });
  },
  data() {
    return {
      address: "",
      email: "",
      content: "",
      files: [],
      name: "",
      rules: {
        nameRules: [
          v =>
            /^.{1,50}$/.test(v) || "Tiêu đề không để trống và nhỏ hơn 50 kí tự"
        ],
        typeRules: [v => !!v || "Phân loại không được trống"],
        contentRules: [v => !!v || "Nội dung không được trống"]
      },
      seo: "",
      type: "",
      valid: true
    };
  },
  methods: {
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      var files = this.files;
      if (files.length > 0) {
        Promise.all(
          // Array of "Promises"
          files.map(item => {
            var ref = firebase.storage().ref(this.email + "/" + item.name);
            ref.put(item);
            return ref.getDownloadURL();
          })
        )
          .then(url => {
            // console.log(url);
            firebase
              .firestore()
              .collection("Goods")
              .add({
                address: this.address,
                creator_id: this.email,
                date_create: new Date(),
                date_edit: new Date(),
                description: this.content,
                image_url1: url[0],
                image_url2: url[1],
                image_url3: url[2],
                name: this.name,
                type: this.type
              })
              .then(r => {
                const objects = [
                  {
                    id: r.id,
                    address: this.address,
                    creator_id: this.email,
                    date_create: new Date(),
                    date_edit: new Date(),
                    description: this.content,
                    image_url1: "",
                    image_url2: "",
                    image_url3: "",
                    name: this.name,
                    type: this.type
                  }
                ];

                indexAlgolia.addObjects(objects, (err, content) => {
                  console.log(content);
                  this.$router.push("/");
                });
              });
          })
          .catch(error => {
            console.log(`Some failed: `, error.message);
          });
      } else {
        firebase
          .firestore()
          .collection("Goods")
          .add({
            address: this.address,
            creator_id: this.email,
            date_create: new Date(),
            date_edit: new Date(),
            description: this.content,
            image_url1: "",
            image_url2: "",
            image_url3: "",
            name: this.name,
            type: this.type
          })
          .then(r => {
            const objects = [
              {
                id: r.id,
                address: this.address,
                creator_id: this.email,
                date_create: new Date(),
                date_edit: new Date(),
                description: this.content,
                image_url1: "",
                image_url2: "",
                image_url3: "",
                name: this.name,
                type: this.type
              }
            ];

            indexAlgolia.addObjects(objects, (err, content) => {
              console.log(content);
              this.$router.push("/");
            });
          });
      }
      // storeRef.put(file).then(function(snapshot) {
      //   console.log("Uploaded a blob or file!");
      // });
      return;
    }
  },
  mounted() {
    //$md.render(model)
  }
};
</script>
<style>
.md code {
  background-color: unset;
  color: inherit;
  box-shadow: none;
}
</style>