<template>
  <v-card class="elevation-0">
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
    <v-container fluid>
      <v-row dense>
        <v-col v-for="card in cards" :key="card.title" cols="6" sm="4" md="3" lg="3" xl="3">
          <v-card class="mx-auto" max-width="400">
            <v-img class="orange--text align-end" height="200px" :src="card.image_url1">
              <v-card-title>{{card.name}}</v-card-title>
            </v-img>

            <v-card-subtitle
              class="pb-0"
            >{{`${card.unit} ${card.price}/ ${card.net>0?card.net+'kg':''} ${card.items_number>0?card.items_number+'cái':''}`}}</v-card-subtitle>

            <v-card-text class="text--primary">
              <div class="d-block text-truncate">{{card.description}}</div>
              <div class="d-block text-truncate">{{card.paymethod}}</div>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="orange" text>Mua hàng</v-btn>
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
      tab: -1,
      checkbox: true,
      cards: []
    };
  },
  mounted() {
    let collection = firebase
      .app()
      .firestore()
      .collection("Goods")
      .limit(20);
    collection.get().then(snapshot => {
      this.cards = [];
      snapshot.forEach(doc => {
        // console.log("duan1");
        // console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        console.log(doc);
        this.cards.push(doc.data());
      });
    });
  }
};
</script>