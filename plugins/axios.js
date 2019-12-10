import Vue from 'vue'
import firebase from 'firebase';
import Cookie from "js-cookie";
var SocialSharing = require('vue-social-sharing');
Vue.use(SocialSharing);

export default function ({ $axios, redirect, app: { store, router } }) {
  // 注: ここの引数を今は使わないからと _ とかにするとエラーになる
  // $axios.onResponse(config => {
  //     $axios.setHeader('Access-Control-Allow-Origin', "*")
  // })
  // firebase.analytics()
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      Cookie.set("email", user.email);
      store.commit("setLoginState", true);
      store.commit("setUser", {
        uid: user.user_id,
        email: user.email
      });
    } else {
      Cookie.remove("email");
      store.commit("setUser", {
      });
      store.commit("setLoginState", false);
    }
  })
}