export default ({ route, store, redirect }) => {
  !store.state.loggedIn && isAdminRoute(route)?redirect('/login'):''
}
function isAdminRoute(route) {
  if (route.matched.some(record => record.path == '/auth')) {
    return true
  }
}