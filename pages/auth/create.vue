<template>
  <v-row align="center" justify="center">
    <v-form v-model="valid" ref="form" class="ma-2">
      <v-row class="md" align="start" justify="start" align-content="space-around">
        <v-col cols="12" sm="4">
          <v-text-field label="Tiêu đề bài viết" v-model="name" :rules="rules.nameRules"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field label="Tag, phân loại bài viết" v-model="type" :rules="rules.typeRules"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
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
          <v-layout row wrap align-center>
            <v-flex xs6 md3 v-for="(item,i) in fileUrls" :key="i" class="align-self-start pa-1">
              <v-img :src="item" aspect-ratio="2" class="grey lighten-2" max-height="200"></v-img>
            </v-flex>
          </v-layout>
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
            <div v-html="$md.render(content)" class="pa-2"></div>
          </v-card>
        </v-col>
        <v-col class="text-center" cols="12">
          <div class="my-2">
            <v-btn :disabled="disabled" large color="primary" @click="save">Tạo mới</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-row>
</template>
<script>
import firebase from "firebase";
const algoliasearch = require("algoliasearch");

const client = algoliasearch("N7UFARQ48L", "8d219c45506c851ab82563e0297891dd");
const indexAlgolia = client.initIndex("dulich");

export default {
  layout: "admin",
  beforeCreate() {
    this.email = this.$store.state.user.email;
    firebase
      .app()
      .firestore()
      .collection("Users")
      .where("email", "==", this.email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          this.role = doc.data().role;
          console.log(this.role);
        });
      });
  },
  data() {
    return {
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
      type: "",
      valid: true,
      disabled:false
    };
  },
  computed: {
    fileUrls() {
      return this.files.map(file => {
        return URL.createObjectURL(file);
      });
    }
  },
  methods: {
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      var files = this.files;
      this.disabled = true;
      if (files.length > 0) {
        Promise.all(
          // Array of "Promises"
          files.map(item => {
            var ref = firebase.storage().ref(this.email + "/" + item.name);
            return ref.put(item).then(r => {
              return ref.getDownloadURL();
            });
          })
        )
          .then(url => {
            // console.log(url);
            // .replace(".jpg", "_400x200.jpg").replace(".jpeg", "_400x200.jpeg").replace(".png", "_400x200.png").replace(".jpeg", "_400x200.jpeg")
            url.push("");
            url.push("");
            url.push("");
            firebase
              .firestore()
              .collection("dulich")
              .add({
                creator_id: this.email,
                date_create: new Date(),
                date_edit: new Date(),
                description: this.content,
                image_url1: url[0],
                image_url2: url[1],
                image_url3: url[2],
                name: this.name,
                type: this.type,
                display: this.role == "admin" ? true : false
              })
              .then(r => {
                const objects = [
                  {
                    objectID: r.id,
                    id: r.id,
                    creator_id: this.email,
                    date_create: new Date(),
                    date_edit: new Date(),
                    description: this.content,
                    image_url1: url[0],
                    image_url2: url[1],
                    image_url3: url[2],
                    name: this.name,
                    type: this.type,
                    display: this.role == "admin" ? true : false
                  }
                ];

                indexAlgolia.addObjects(objects, (err, content) => {
                  // console.log(content);
                  this.disabled = false;
                  this.$router.push("/auth/items");
                });
              });
          })
          .catch(error => {
            this.disabled = false;
            console.log(`Some failed: `, error.message);
          });
      } else {
        firebase
          .firestore()
          .collection("dulich")
          .add({
            creator_id: this.email,
            date_create: new Date(),
            date_edit: new Date(),
            description: this.content,
            image_url1: "",
            image_url2: "",
            image_url3: "",
            name: this.name,
            type: this.type,
            display: this.role == "admin" ? true : false
          })
          .then(r => {
            const objects = [
              {
                objectID: r.id,
                id: r.id,
                creator_id: this.email,
                date_create: new Date(),
                date_edit: new Date(),
                description: this.content,
                image_url1: "",
                image_url2: "",
                image_url3: "",
                name: this.name,
                type: this.type,
                display: this.role == "admin" ? true : false
              }
            ];

            indexAlgolia.addObjects(objects, (err, content) => {
              // console.log(content);
              this.disable= false;
              this.$router.push("/auth/items");
            });
          });
      }
      // storeRef.put(file).then(function(snapshot) {
      //   console.log("Uploaded a blob or file!");
      // });
      return;
    }
  },
  mounted() {}
};
</script>
<style>
.md code {
  background-color: unset;
  color: inherit;
  box-shadow: none;
}
img{
  max-width:100%
}
</style>