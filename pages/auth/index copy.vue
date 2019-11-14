<template>
</template>
<script>
import firebase from "firebase";
export default {
  async asyncData({ params }) {
    let collection = firebase
      .app()
      .firestore()
      .collection("Goods")
      .limit(20);
    const rs = await collection.get();
    let cards = [];
    rs.forEach(doc => {
      // console.log(doc);
      cards.push(doc.data());
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
    this.$store.commit("setshowPlus", true);
  }
};
</script>