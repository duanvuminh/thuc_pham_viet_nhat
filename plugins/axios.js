import firebase from 'firebase';

export default function ({ $axios, redirect, app: { store, router } }) {
    // 注: ここの引数を今は使わないからと _ とかにするとエラーになる
    // $axios.onResponse(config => {
    //     $axios.setHeader('Access-Control-Allow-Origin', "*")
    // })
    // firebase.analytics()
    router.beforeEach((to, from, next) => {
        if (!store.state.loggedIn && isAdminRoute(to)) {
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        } else {
          next()
        }
      })
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            store.commit("setLoginState", true);
        } else {
            store.commit("setLoginState", false);
        }
    })
}
function isAdminRoute(route) {
    if (route.matched.some(record => record.path == '/auth')) {
      return true
    }
  }