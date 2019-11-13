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
            <nuxt-link to="/">Cách viết tại đây</nuxt-link>
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

export default {
  beforeCreate() {
    // ここでローディングのインジケータアニメーションを表示すると良い
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
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
      firebase
        .database()
        .ref("Goods")
        .set({
          username: "name",
          email: "email",
          profile_picture: "imageUrl"
        });
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