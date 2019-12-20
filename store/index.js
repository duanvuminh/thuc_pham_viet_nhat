import JWTDecode from "jwt-decode";
import cookieparser from "cookieparser";

export const state = () => ({
  count: 0,
  japanesInput: false,
  connectedFirebase:false,
  loggedIn: false,
  user: {}
})

export const mutations = {
  setLoginState(state, islogin) {
    state.loggedIn = islogin;
  },
  setUser(state, user) {
    state.user = user;
  },
  setJapanesInput(state, value) {
    state.japanesInput = value;
  },
  setConnectedFirebase(state, value) {
    state.connectedFirebase = value;
  },
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (process.server && process.static) return;
    if (!req.headers.cookie) return;

    const parsed = cookieparser.parse(req.headers.cookie);
    const emailCookie = parsed.email;
    if (!emailCookie) return;
    commit("setLoginState", true);
    commit("setUser", {email: emailCookie});
  },
  // nuxtServerInit({ commit }, { req }) {
  //   if (process.server && process.static) return;
  //   if (!req.headers.cookie) return;

  //   const parsed = cookieparser.parse(req.headers.cookie);
  //   const accessTokenCookie = parsed.access_token;

  //   if (!accessTokenCookie) return;

  //   const decoded = JWTDecode(accessTokenCookie);

  //   if (decoded) {
  //     commit("setUser", {
  //       uid: decoded.user_id,
  //       email: decoded.email
  //     });
  //     commit("setLoginState",true);
  //   }
  // }
};