<template>
  <v-row align="center" justify="center">
    <v-form v-model="valid" ref="form" class="ma-2">
      <v-row class="md" align="start" justify="start" align-content="space-around">
        <v-col cols="12" sm="4">
          <v-text-field label="Tiêu đề bài viết" v-model="name" :rules="rules.nameRules"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-combobox
            v-model="type"
            :items="items"
            label="Tag, phân loại bài viết"
            :rules="rules.typeRules"
          ></v-combobox>
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
            v-model="description"
            :rules="rules.contentRules"
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="elevation-1">
            <div v-html="$md.render(description)" class="pa-2"></div>
          </v-card>
        </v-col>
        <v-col class="text-center" cols="12">
          <div class="my-2">
            <v-btn large color="primary" @click="save" :disabled="disabled">Lưu</v-btn>
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
  async asyncData({ params }) {
    let pieces = params.id.split("-");
    let id = pieces[pieces.length - 1];
    let item = firebase
      .app()
      .firestore()
      .collection("dulich")
      .doc(id);
    const rs = await item.get();
    let card = rs.data();
    let {
      name,
      type,
      description,
      image_url1,
      image_url2,
      image_url3
    } = card;
    return {
      id,
      name,
      type,
      description,
      image_url1,
      image_url2,
      image_url3
    };
  },
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
        });
      });
  },
  computed: {
    fileUrls() {
      if(!this.files || this.files.length==0){
        return [this.image_url1,this.image_url2,this.image_url3].filter(x=>x!="");
      }
      return this.files.map(file => {
        return URL.createObjectURL(file);
      });
    }
  },
  data() {
    return {
      rules: {
        nameRules: [
          v =>
            /^.{1,50}$/.test(v) || "Tiêu đề không để trống và nhỏ hơn 50 kí tự"
        ],
        typeRules: [v => !!v || "Phân loại không được trống"],
        contentRules: [v => !!v || "Nội dung không được trống"]
      },
      name: "",
      type: "",
      description: "",
      image_url1: "",
      image_url2: "",
      image_url3: "",
      files: [],
      valid: true,
      disabled: false,
      items:[]
    };
  },
  head() {
    return {
      titleTemplate: `%s - ${this.name}`,
      title: process.env.site_name || "",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: this.description || ""
        }
      ]
    };
  },
  layout: "admin",
  methods: {
    save({ redirect }) {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.disabled = true;
      var files = this.files;
      if (files.length > 0) {
        Promise.all(
          // Array of "Promises"
          files.map(item => {
            var ref = firebase
              .storage()
              .ref(this.$store.state.user.email + "/" + item.name);
            return ref.put(item).then(r => {
              return ref.getDownloadURL();
            });
          })
        )
          .then(url => {
            // console.log(url);
            url.push("");
            url.push("");
            url.push("");
            firebase
              .firestore()
              .collection("dulich")
              .doc(this.id)
              .set(
                {
                  date_edit: new Date(),
                  description: this.description,
                  image_url1: url[0],
                  image_url2: url[1],
                  image_url3: url[2],
                  name: this.name,
                  type: this.type,
                  display: this.role == "admin" ? true : false
                },
                { merge: true }
              )
              .then(r => {
                const objects = {
                  objectID: this.id,
                  date_edit: new Date(),
                  description: this.description,
                  image_url1: url[0],
                  image_url2: url[1],
                  image_url3: url[2],
                  name: this.name,
                  type: this.type,
                  display: this.role == "admin" ? true : false
                };
                indexAlgolia.partialUpdateObject(objects, (err, { taskID, objectID }) => {
                  // console.log(content);
                  // console.log(content);
                  indexAlgolia.waitTask(taskID, () => {
                    this.disabled = false
                    this.$router.push("/auth/items");
                  });
                });
              });
          })
          .catch(error => {
            console.log(`Some failed: `, error.message);
          });
      } else {
        firebase
          .firestore()
          .collection("dulich")
          .doc(this.id)
          .set(
            {
              date_edit: new Date(),
              description: this.description,
              name: this.name,
              type: this.type,
              display: this.role == "admin" ? true : false
            },
            { merge: true }
          )
          .then(r => {
            const objects = {
              objectID: this.id,
              date_edit: new Date(),
              description: this.description,
              name: this.name,
              type: this.type,
              display: this.role == "admin" ? true : false
            };
            console.log(objects);
            indexAlgolia.partialUpdateObject(objects, (err, { taskID, objectID }) => {
              // console.log(content);
              indexAlgolia.waitTask(taskID, () => {
                this.disabled = false;
                this.$router.push("/auth/items");
              });
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
    // console.log(indexAlgolia)
    let items = [];
    firebase
      .app()
      .firestore()
      .collection("dulich")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          items.push(doc.data().type);
        });
        this.items = [...new Set(items)];
      });
  }
};
</script>
<style>
img{
  max-width:100%
}
</style>