<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
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
      <v-list class="mb-5 mt-5">
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
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Ngày viết</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text v-text="iso8601Time(card.date_edit)"></v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>By</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text v-text="card.creator_id"></v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-col cols="12" justify="center">
        <div v-html="$md.render(card.description)"></div>
      </v-col>
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