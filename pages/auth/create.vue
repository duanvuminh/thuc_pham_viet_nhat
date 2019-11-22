<template>
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
          <v-btn large color="primary" @click="save">Tạo mới</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
import firebase from "firebase";
const algoliasearch = require("algoliasearch");

const client = algoliasearch("N7UFARQ48L", "8d219c45506c851ab82563e0297891dd");
const indexAlgolia = client.initIndex("GaoNhat_algolia");

export default {
  layout:"admin",
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
      email: "",
      content: `Bàn ghế học sinh
===

## Giá bán
200K VND

## Mô tả sản phẩm
Sản phẩm dùng được 3 tháng nhưng do mình chuyển công tác vào Hồ Chí Minh lên bán lại.  
Dài 2m rộng 1m, làm bằng gỗ lim rất chắc chắn.
      `,
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
      valid: true,
      items:[
        "Hàng bán",
        "Hàng mua",
        "Tổng hợp",
      ]
    };
  },
  methods: {
    save() {
      if(this.email!="duanvuminh@gmail.com"){
        return;
      }
      if (!this.$refs.form.validate()) {
        return;
      }
      var files = this.files;
      if (files.length > 0) {
        Promise.all(
          // Array of "Promises"
          files.map(item => {
            var ref = firebase.storage().ref(this.email + "/" + item.name);
            return ref.put(item).then(r=>{
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
              .collection("Goods")
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
                seo:this.seo
              })
              .then(r => {
                const objects = [
                  {
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
                    seo:this.seo
                  }
                ];

                indexAlgolia.addObjects(objects, (err, content) => {
                  // console.log(content);
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
            creator_id: this.email,
            date_create: new Date(),
            date_edit: new Date(),
            description: this.content,
            image_url1: "",
            image_url2: "",
            image_url3: "",
            name: this.name,
            type: this.type,
            seo:this.seo
          })
          .then(r => {
            const objects = [
              {
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
                seo:this.seo
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