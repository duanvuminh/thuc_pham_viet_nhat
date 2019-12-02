<template>
  <v-row justify="center">
    <v-col cols="12" sm="9">
      <v-text-field
        solo
        label="Search"
        prepend-inner-icon="mdi-magnify"
        clearable
        @keypress="search"
        v-model="searchkey"
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="10"></v-col>
  </v-row>
</template>
<script>
import firebase from "firebase";
export default {
  async asyncData({ params }) {
    let item = {};
    if (data === parseInt(params, 10)) {
      item = firebase
        .app()
        .firestore()
        .collection("kanji")
        .where("position", "==", params);
    } else {
      item = firebase
        .app()
        .firestore()
        .collection("kanji")
        .where("name", "==", params.id[0]);
    }
    const rs = await item.get();
    let card = {};
    rs.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      card = {id: doc.id,...doc.data()};
    });
    return { card };   
  },
  data() {
    return {
      searchkey: ""
    };
  },
  layout: "oboe",
  methods: {
    search(e) {
      if (
        e.key == "Enter" &&
        this.comment.replace(/(\r\n|\n|\r)/gm, "").trim()
      ) {
        this.$router.push(`/search/${this.searchkey}`);
      }
    }
  },
  mounted() {}
};
</script>