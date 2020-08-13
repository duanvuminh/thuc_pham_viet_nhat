export default ({ route, store, redirect }) => {
  store.state.user.email!="duanvuminh@gmail.com" && isAdminRoute(route)?redirect('/login'):''
}
function isAdminRoute(route) {
  if (route.matched.some(record => record.path.indexOf('/auth/manga')>=0)) {
    return true
  }
}