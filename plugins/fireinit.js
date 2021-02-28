import Cookie from "js-cookie";
export default ({ store, $fire }) => {
    // await $fire.authReady()
    $fire.authReady().then(() => {
        $fire.auth.onAuthStateChanged((user) => {
            store.commit("setConnectedFirebase", true);
            if (user) {
                user.getIdToken()
                    .then(idToken => {
                        Cookie.set("access_token", idToken);
                    });
                Cookie.set("access_token", );
                Cookie.set("email", user.providerData[0].email);
                store.commit("setUser", { email: user.providerData[0].email, uid: user.providerData[0].uid });
                store.commit("setLoginState", true);
            } else {
                Cookie.remove("email");
                Cookie.remove("access_token");
                store.commit("setUser", {});
                store.commit("setLoginState", false);
            }
        });
    })

}