<template>
  <v-row align="center" justify="center">
    <v-form v-model="valid" ref="form" class="ma-2">
      <v-row class="md" align="start" justify="start" align-content="space-around">
        <v-col cols="12">
          <v-text-field label="Tiêu đề bài viết" v-model="name" :rules="rules.nameRules"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-select
            :items="items"
            label="Tag, phân loại bài viết"
            v-model="type"
            :rules="rules.typeRules"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-file-input
            v-model="file"
            placeholder="Upload ảnh bài viết"
            label="Ảnh bài viết"
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
            label="Tóm tắt"
            placeholder="Thông tin cơ bản"
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
            <v-btn large color="primary">Lưu</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-row>
</template>
<script>
import firebase from "firebase";
export default {
  async asyncData({ params }) {
    let pieces = params.id.split("-");
    let id = pieces[pieces.length - 1];
    let item = firebase
      .app()
      .firestore()
      .collection("muaban_phuquoc")
      .doc(id);
    const rs = await item.get();
    let card = rs.data();
    let {
      name,
      type,
      seo,
      description,
      image_url1,
      image_url2,
      image_url3
    } = card;
    return { id, name, type, seo, description, image_url1, image_url2, image_url3 };
  },
  beforeCreate() {},
  computed: {},
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
      seo: "",
      description: "",
      image_url1: "",
      image_url2: "",
      image_url3: "",
      file,
      valid: true,
      items: ["Hàng bán", "Hàng mua", "Tổng hợp"]
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
          content: this.seo || ""
        }
      ]
    };
  },
  layout: "admin",
  methods: {
    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      var files = this.file;
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
            url.push("");
            url.push("");
            url.push("");
            firebase
              .firestore()
              .collection("muaban_phuquoc")
              .doc(this.id)
              .set({
                creator_id: this.email,
                date_create: new Date(),
                date_edit: new Date(),
                description: this.content,
                image_url1: url[0],
                image_url2: url[1],
                image_url3: url[2],
                name: this.name,
                type: this.type,
                seo: this.seo,
                display: this.role == "admin" ? true : false
              })
              .then(r => {
                const objects = [
                  {
                    id: r.id,
                    creator_id: this.email,
                    date_edit: new Date(),
                    description: this.description,
                    image_url1: url[0],
                    image_url2: url[1],
                    image_url3: url[2],
                    name: this.name,
                    type: this.type,
                    seo: this.seo,
                    display: this.role == "admin" ? true : false
                  }
                ];

                indexAlgolia.addObjects(objects, (err, content) => {
                  // console.log(content);
                  this.$router.push("/auth/");
                });
              });
          })
          .catch(error => {
            console.log(`Some failed: `, error.message);
          });
      } else {
        firebase
          .firestore()
          .collection("muaban_phuquoc")
          .add({
            creator_id: this.email,
            date_create: new Date(),
            date_edit: new Date(),
            description: this.content,
            name: this.name,
            type: this.type,
            seo: this.seo,
            display: this.role == "admin" ? true : false
          })
          .then(r => {
            const objects = [
              {
                id: r.id,
                creator_id: this.email,
                date_edit: new Date(),
                description: this.content,
                name: this.name,
                type: this.type,
                seo: this.seo,
                display: this.role == "admin" ? true : false
              }
            ];

            indexAlgolia.addObjects(objects, (err, content) => {
              // console.log(content);
              this.$router.push("/auth/");
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
.v-image__image {
  background-size: contain;
}
</style>