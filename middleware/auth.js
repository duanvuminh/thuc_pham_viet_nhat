import firebase from 'firebase'

export default  ({ route, store, redirect })=> {
   let p = firebase.auth().onAuthStateChanged((user) => {
    console.log(user);
    console.log(store.state.loggedIn);
    if (user) {
        store.commit("setLoginState", true);
      } else {
        store.commit("setLoginState", false);
      }
      store.state.loggedIn && route.name == 'login' ? redirect('/admin') : ''
      !store.state.loggedIn && isAdminRoute(route) ? redirect('/login') : ''
  })
}
function isAdminRoute(route) {
    if (route.matched.some(record => record.path == '/admin')) {
      return true
    }
  }