<template>
  <v-card class="elevation-0 pa-5">
    <v-toolbar color="orange accent-1">
      <v-toolbar-title class="title mr-6">Tìm kiếm</v-toolbar-title>
      <v-text-field clearable placeholder="Từ khoá bất kì" hide-details solo flat class="mx-4"></v-text-field>
      <!-- <template v-slot:extension>
        <v-spacer></v-spacer>
        <v-btn text>Địa điểm</v-btn>
        <v-btn text>Giá cả</v-btn>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template> -->
    </v-toolbar>
    <v-container fluid>
      <v-row dense>
        <v-col v-for="card in cards" :key="card.title" cols="12" sm="4" md="3" lg="3" xl="3">
          <v-card class="mx-auto" max-width="400">
            <v-img class="orange--text align-end" height="200px" :src="card.image_url1"></v-img>
            <v-card-title>{{card.name}}</v-card-title>
            <v-card-subtitle class="pb-0">{{`Địa chỉ:${card.address?card.address:'?'}`}}</v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="orange" text :href="`/items/${card.id}`">Chi tiết</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
import firebase from "firebase";
export default {
  async asyncData({ params }) {
    let collection = firebase
      .app()
      .firestore()
      .collection("Goods")
      .limit(100);
    const rs = await collection.get();
    let cards = [];
    rs.forEach(doc => {
      console.log(doc);
      let x = doc.data();
      x.id = doc.id;
      cards.push(x);
    });
    return { cards };
  },
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
      tab: -1,
      checkbox: true,
      cards: []
    };
  },
  mounted() {
    this.$store.commit("setshowPlus", false);
  }
};
</script>