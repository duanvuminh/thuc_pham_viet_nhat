<template>
  <v-container fluid>
    <v-row justify="center" align="center" class="pa-5">
      <v-col cols="6">
        <v-carousel>
          <v-carousel-item
            v-for="(item,i) in [card.image_url1,card.image_url2,card.image_url3]"
            :key="i"
            :src="item"
            reverse-transition="fade-transition"
            transition="fade-transition"
          ></v-carousel-item>
        </v-carousel>
      </v-col>
      <div v-html="$md.render(card.description)"></div>
      <v-list>
        <v-list-item-group mandatory color="indigo">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Tên</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text v-text="card.name"></v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Địa chỉ</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text v-text="card.address"></v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-row>
  </v-container>
</template>
<script>
import firebase from "firebase";
export default {
  async asyncData({ params }) {
    let item = firebase
      .app()
      .firestore()
      .collection("Goods")
      .doc(params.id);
    const rs = await item.get();
    let card = rs.data();
    console.log(card);
    return { card };
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
      card: {}
    };
  },
  mounted() {
    this.$store.commit("setshowPlus", false);
  }
};
</script>