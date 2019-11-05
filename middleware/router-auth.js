export default function ({ store, redirect, route }) {
  store.state.loggedIn && route.name == 'login' ? redirect('/admin') : ''
  !store.state.loggedIn && isAdminRoute(route) ? redirect('/login') : ''
}

function isAdminRoute(route) {
  if (route.matched.some(record => record.path == '/admin')) {
    return true
  }
}