<template>
  <div>
    Đang thoát...
    <v-dialog v-model="dialog" max-width="90%">
      <v-card>
        <v-card-title class="headline">Thông báo lỗi</v-card-title>

        <v-card-text>
          {{message}}
          <br />
          <nuxt-link to="/support" v-if="isLogout">Nếu vấn đề vẫn sảy ra hãy liên lạc với chúng tôi</nuxt-link>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <nuxt-link to="/">
            <v-btn color="green darken-1" text @click="dialog = false">Đã hiểu</v-btn>
          </nuxt-link>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import firebase from "firebase/app";
import "firebase/auth";
import Cookie from "js-cookie";
export default {
  beforeCreate() {
    // ここでローディングのインジケータアニメーションを表示すると良い
    firebase
      .auth()
      .signOut()
      .then(() => {
        Cookie.remove("access_token");
        Cookie.remove("email");
        this.$store.commit("setUser", {});
        this.$store.commit("setLoginState", false);
        this.$router.push("/");
      })
      .catch(error => {
        // An error happened
        this.message = error;
        this.dialog = true;
      });
  },
  data() {
    return {
      dialog: false,
      isLogout: true,
      message: ""
    };
  },
  head() {
    return {
      titleTemplate: `%s - logout`
    };
  },
  mounted() {}
};
</script>