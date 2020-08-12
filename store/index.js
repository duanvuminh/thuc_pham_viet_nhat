import JWTDecode from "jwt-decode";
import cookieparser from "cookieparser";

export const state = () => ({
  count: 0,
  contents: [],
  date: null,
  japanesInput: false,
  connectedFirebase: false,
  loggedIn: false,
  visionurl: "",
  user: {},
  topic: '8ZeUI85LG6OtNTeDDIqT',
  // const variable
  mypage: "4PisKFBkxDzV7voklXYA",
  defaultTopic: "8ZeUI85LG6OtNTeDDIqT"
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
  setVision(state, value) {
    state.visionurl = value;
  },
  setConnectedFirebase(state, value) {
    state.connectedFirebase = value;
  },
  setTopic(state, value) {
    state.topic = value;
  },
  setContent(state, value) {
    state.contents = value;
  },
  pushContent(state, value) {
    state.contents.push(value);
  },
  unshiftContent(state, value) {
    state.contents.unshift(value);
  },
  spliceContent(state, index) {
    state.contents.splice(index, 1);
  },
  editContent(state, index, val) {
    state.contents[index].content = val;
  },
  setDate(state, val) {
    state.date = val;
  }
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (process.server && process.static) return;
    if (!req.headers.cookie) return;

    const parsed = cookieparser.parse(req.headers.cookie);
    const emailCookie = parsed.email;
    if (!emailCookie) return;
    commit("setLoginState", true);
    commit("setUser", { email: emailCookie });
  },
};