<template>
  <v-card class="elevation-0 pa-5">
    <v-toolbar color="orange accent-1">
      <v-toolbar-title class="title mr-6">Tìm kiếm</v-toolbar-title>
      <v-text-field clearable placeholder="Từ khoá bất kì" hide-details solo flat class="mx-4"></v-text-field>
      <template v-slot:extension>
        <v-spacer></v-spacer>
        <v-btn text>Địa điểm</v-btn>
        <v-btn text>Giá cả</v-btn>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
    </v-toolbar>
  </v-card>
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
      }
    });
  },
  data() {
    return {
      tab: -1
    };
  },
  mounted() {
    this.$store.commit("setshowPlus", false);
  }
};
</script>