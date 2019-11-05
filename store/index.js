export const state = () => ({
  count: 0,
  loggedIn: false
})

export const mutations = {
  setLoginState(state, islogin) {
    state.loggedIn = islogin;
  }
}