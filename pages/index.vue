<template>
  <v-toolbar color="orange accent-1">
    <v-toolbar-title class="title mr-6">Tìm kiếm</v-toolbar-title>
    <v-text-field placeholder="Từ khoá bất kì" hide-details solo flat class="mx-4"></v-text-field>
    <template v-slot:extension>
      <v-spacer></v-spacer>
      <v-btn text>Địa điểm</v-btn>
      <v-btn text>Giá cả</v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
  </v-toolbar>
</template>
<script>
import firebase from "firebase";
export default {
  data() {
    return {
      tab: -1,
      checkbox: true
    };
  },
  mounted(){
    let collection = firebase.app().firestore().collection("Goods").limit(20);
    collection.get().then(
      (snapshot) => {
         snapshot.forEach(doc => {
        // console.log("duan1");
        // console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        console.log(doc);
      });
      }
    )

  }
};
</script>