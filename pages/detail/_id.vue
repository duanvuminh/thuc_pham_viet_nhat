<template>
  <v-row align="center" justify="center">
    <v-col class="shrink">
      <v-carousel v-if="card.image_url1" height="300">
        <v-carousel-item
          v-for="(item,i) in arrayImage"
          :key="i"
          :src="item"
          reverse-transition="fade-transition"
          transition="fade-transition"
        ></v-carousel-item>
      </v-carousel>

      <v-list class="mb-5 mt-5">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Tên</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action style="max-width:80%">
            <v-list-item-action-text v-text="card.name"></v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Ngày viết</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action style="max-width:80%">
            <v-list-item-action-text v-text="iso8601Time(card.date_edit)"></v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>By</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action style="max-width:80%">
            <v-list-item-action-text v-text="card.creator_id"></v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <div v-html="$md.render(card.description)"></div>
    </v-col>
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
      }
    });
  },
  computed: {
    arrayImage() {
      let ar = [];
      if (this.card.image_url1) {
        ar = [this.card.image_url1];
      }
      if (this.card.image_url2) {
        ar = [this.card.image_url1, this.card.image_url2];
      }
      if (this.card.image_url3) {
        ar = [this.card.image_url1, this.card.image_url2, this.card.image_url3];
      }
      return ar;
    }
  },
  data() {
    return {
      tab: -1,
      checkbox: true,
      card: {}
    };
  },
  head() {
    return {
      titleTemplate: `%s - ${this.card.name}`,
      title: process.env.site_name || "",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: this.card.seo || ""
        }
      ]
    };
  },
  layout: "admin",
  methods: {
    iso8601Time(timestamp) {
      // console.log(timestamp);
      return new Date(timestamp.seconds * 1e3).toISOString().slice(0, -5);
    }
  },
  mounted() {
    this.$store.commit("setshowPlus", false);
  }
};
</script>