<template>
  <v-app light>
    <v-app-bar flat app dense>
      <v-container>
        <v-row>
          <v-btn text to="/" class="align-self-center">Home</v-btn>
          <v-btn text to="/main" class="align-self-center">Bộ</v-btn>
          <v-spacer />
          <v-btn v-if="loggedIn" text to="/logout" class="align-self-center">Logout</v-btn>
          <v-btn v-else text to="/login" class="align-self-center">Login</v-btn>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template> 

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      dialog: false,
      items: []
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    }
  },
  methods: {
  }
};
</script>
<style>
.display-4.nihongo {
  font-family: Hiragino Mincho Pro, ヒラギノ明朝 Pro W3, ＭＳ 明朝, ＭＳ Ｐ明朝,
    serif !important;
}
img{
  max-width:100%
}
</style>
