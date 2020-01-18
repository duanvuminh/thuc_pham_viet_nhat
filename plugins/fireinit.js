import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import Cookie from "js-cookie";
var config = {
  apiKey: "AIzaSyCniellt7ZkxGUk6r3ISo476bkwc0ya3OA",
  authDomain: "gaonhat-1b0c8.firebaseapp.com",
  databaseURL: "https://gaonhat-1b0c8.firebaseio.com",
  projectId: "gaonhat-1b0c8",
  storageBucket: "gaonhat-1b0c8.appspot.com",
  messagingSenderId: "123013934241",
  appId: "1:123013934241:web:3055123c28ad60838f94e0",
  measurementId: "G-6XKE2PS3YR"
  // Optionally pass in properties for database, authentication and cloud messaging,
  // see their respective docs.
}
if (!firebase.apps.length) {
  firebase.initializeApp(config)
  firebase
  .firestore()
  .enablePersistence({ synchronizeTabs: true })
}
  
export default ({ store }) => {
  firebase.auth().onAuthStateChanged((user) => {
    console.log("firebase work")
    store.commit("setConnectedFirebase",true);
    if (user) {
      firebase
        .auth()
        .currentUser.getIdToken()
        .then(idToken => {
          Cookie.set("access_token", idToken);
        });
      Cookie.set("email", user.providerData[0].email);
      store.commit("setUser", { email: user.providerData[0].email, uid: user.providerData[0].uid });
      store.commit("setLoginState", true);
    } else {
      Cookie.remove("email");
      Cookie.remove("access_token");
      store.commit("setUser", {});
      store.commit("setLoginState", false);
    }
  })
}