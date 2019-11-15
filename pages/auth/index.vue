<template>
  <v-row align="center" justify="center" v-if="email=='duanvuminh@gmail.com'">
    <v-date-picker v-model="date" full-width :landscape="$vuetify.breakpoint.smAndUp" class="ma-4"></v-date-picker>
    <v-btn color="green" dark @click="getEvent">
      <v-icon>mdi-cached</v-icon>Đồng bộ dữ liệu
    </v-btn>
  </v-row>
</template> 
<script>
import firebase from "firebase";
export default {
  beforeCreate() {
    // ここでローディングのインジケータアニメーションを表示すると良い
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.commit("setLoginState", true);
        this.email = user.email;
      } else {
        this.$store.commit("setLoginState", false);
        this.$router.push("/login");
      }
    });
  },
  data() {
    return {
      email: "",
      date: new Date().toISOString().substr(0, 10)
    };
  },
  methods: {
    getEvent() {
      date = this.date.replace(/-/g,"");
      const ip = this.$axios.$get(`https://eventon.jp/api/events.json?ymd=${date}`);
      console.log(ip);
    }
  },
  mounted() {
    this.$store.commit("setshowPlus", true);
  }
};
</script>