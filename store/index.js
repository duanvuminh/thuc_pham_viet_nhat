export const state = () => ({
  count: 0,
  loggedIn: false,
  showPlus:false
})

export const mutations = {
  setLoginState(state, islogin) {
    state.loggedIn = islogin;
  },
  setshowPlus(state, islogin) {
    state.showPlus = islogin;
  }
}