<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>{{isLoggingIn ?"Đăng nhập":"Đăng kí"}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-text-field
              label="Email đăng nhập"
              name="login"
              prepend-icon="person"
              type="text"
              v-model="user.email"
              :rules="emailRules"
              :disabled="processing"
            />

            <v-text-field
              id="password"
              label="Mật khẩu"
              name="password"
              prepend-icon="lock"
              type="password"
              v-model="user.password"
              :rules="passwordRules"
              :disabled="processing"
            />
            <v-text-field
              v-if="!isLoggingIn"
              id="confirmPassword"
              label="Xác nhận lại mật khẩu"
              name="confirmPassword"
              prepend-icon="lock"
              type="password"
              v-model="user.confirmPassword"
              :rules="confirmPasswordRules"
              :disabled="processing"
            />
            <v-btn @click="googleSignIn" dark color="red darken-1" small text>
              <v-icon>mdi-google</v-icon>+Login
            </v-btn>
            <v-btn @click="facebookSignIn" dark color="primary" small text>
              <v-icon>mdi-facebook</v-icon>Login
            </v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="processing"
            color="primary"
            @click="submit"
          >{{isLoggingIn ? 'Đăng nhập' : 'Đăng kí'}}</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn
            text
            @click="toggleForm"
          >{{isLoggingIn ? 'Chưa có tài khoản? Click vào đây ' : 'Quay lại màn hình đăng nhập'}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-dialog v-model="dialog" max-width="90%">
      <v-card>
        <v-card-title class="headline">Thông báo lỗi</v-card-title>

        <v-card-text>
          {{message}}
          <br />
          <nuxt-link
            to="/support"
            v-if="isLoggingIn"
          >Nếu vấn đề vẫn sảy ra hãy liên lạc với chúng tôi</nuxt-link>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">Đã hiểu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import firebase from "firebase";
import Cookie from "js-cookie";

export default {
  layout: "oboe",
  beforeCreate() {
    // ここでローディングのインジケータアニメーションを表示すると良い
    // firebase.auth().onAuthStateChanged(user => {
    //   if (user) {
    //     this.$store.commit("setLoginState", true);
    //     this.$router.push("/");
    //   } else {
    //     this.$store.commit("setLoginState", false);
    //   }
    // });
  },
  data() {
    return {
      confirmPasswordRules: [
        v => !!v || "Hãy nhập lại mật khẩu.",
        v => v == this.user.password || "Xác nhận mật khẩu khônng đúng."
      ],
      dialog: false,
      emailRules: [
        v => !!v || "E-mail không được trống",
        v => /.+@.+\..+/.test(v) || "E-mail không đúng."
      ],
      isLoggingIn: true,
      message: "",
      passwordRules: [
        v => /[a-z]+/.test(v) || "Ít nhất 1 chữ thường.",
        v => /[A-Z]+/.test(v) || "Ít nhất 1 chữ hoa.",
        v => /.{8,}/.test(v) || "Ít nhất 8 kí tự.",
        v => /[0-9]+/.test(v) || "Ít nhất có 1 số."
      ],
      processing: false,
      user: {
        email: "",
        password: "",
        confirmPassword: ""
      },
      valid: true
    };
  },
  methods: {
    toggleForm() {
      this.isLoggingIn = !this.isLoggingIn;
    },

    submit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.processing = true;
      if (this.isLoggingIn) {
        this.login();
      } else {
        this.register();
      }
    },
    facebookSignIn() {
      let provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope("email");
      provider.pe;
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          // store the user ore wathever
          // this.$router.push("/home");
          let token = result.credential.accessToken;
          // The signed-in user info.
          let user = result.user.providerData[0];

          const { email, uid } = user;
          this.$store.commit("setUser", { email, uid });
          this.$store.commit("setLoginState", true);
          // Set JWT to the cookie
          Cookie.set("email", email);
          firebase
            .auth()
            .currentUser.getIdToken()
            .then(idToken => {
              Cookie.set("access_token", idToken);
              this.$router.push("/");
            });
          this.processing = false;
          
        })
        .catch(error => {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          this.message = errorCode;
          this.dialog = true;
          this.processing = false;
          // ...
        });
    },
    googleSignIn() {
      let provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          // store the user ore wathever
          // this.$router.push("/home");
          let token = result.credential.accessToken;
          // The signed-in user info.
          let user = result.user.providerData[0];

          const { email, uid } = user;
          this.$store.commit("setUser", { email, uid });
          this.$store.commit("setLoginState", true);
          // Set JWT to the cookie
          Cookie.set("email", email);
          firebase
            .auth()
            .currentUser.getIdToken()
            .then(idToken => {
              Cookie.set("access_token", idToken);
              this.$router.push("/");
            });
          this.processing = false;
        })
        .catch(error => {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          this.message = errorCode;
          this.dialog = true;
          this.processing = false;
          // ...
        });
    },
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.user.email, this.user.password)
        .then(data => {
          // console.log(data)
          firebase
            .auth()
            .currentUser.getIdToken()
            .then(idToken => {
              const token = idToken;
              const { email, uid } = firebase.auth().currentUser;
              this.$store.commit("setUser", { email, uid });
              this.$store.commit("setLoginState", true);
              // Set JWT to the cookie
              Cookie.set("email", email);
              Cookie.set("access_token", token);
              this.processing = false;
              this.$router.push("/");
            });
        })
        .catch(error => {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          this.message = errorCode;
          this.dialog = true;
          this.processing = false;
        });
    },
    register() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.user.email, this.user.password)
        .then(data => {
          //console.log(data)
          const token = data.user.refreshToken;
          const { email, uid } = data.user;
          this.$store.commit("setUser", { email, uid });
          this.$store.commit("setLoginState", true);
          // Set JWT to the cookie
          Cookie.set("email", email);
          firebase
            .auth()
            .currentUser.getIdToken()
            .then(idToken => {
              Cookie.set("access_token", idToken);
            });
          this.processing = false;
          this.$router.push("/");
        })
        .catch(error => {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          this.message = errorCode;
          this.dialog = true;
          this.processing = false;
          // ...
        });
    }
  },
  mounted() {}
};
</script>