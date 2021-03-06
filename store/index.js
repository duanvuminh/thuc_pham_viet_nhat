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
  // const variable
  mypage: "4PisKFBkxDzV7voklXYA",
  defaultTopic: "8ZeUI85LG6OtNTeDDIqT",
  // drawer
  tags: [],
  //map
  selectedLocation: null
})

export const mutations = {
  setSelectedLocation(state, val) {
    state.selectedLocation = val;
  },
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
  editContent(state, { index, val }) {
    state.contents[index].content = val;
  },
  // data
  pushData(state, { index, index1, val }) {
    state.contents[index].data.splice(index1 + 1, 0, val);
  },
  unshiftData(state, value) {
    state.contents.data.unshift(value);
  },
  spliceData(state, { index, index1 }) {
    state.contents[index].data.splice(index1, 1);
  },
  editData(state, { index, index1, val }) {
    state.contents[index].data[index1] = val;
  },
  editData1(state, { index, index1, val }) {
    state.contents[index].data = val;
  },
  // end data
  setDate(state, val) {
    state.date = val;
  },
  //drawe
  setTag(state, val) {
    state.tags = val;
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