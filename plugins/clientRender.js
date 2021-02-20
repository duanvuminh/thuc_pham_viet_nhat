import Vue from 'vue'
import firebase from 'firebase/app';

if (!firebase.apps.length) {
    firebase.initializeApp(config)
    firebase
        .firestore()
        .enablePersistence({ synchronizeTabs: true })
}

// var SocialSharing = require('vue-social-sharing');
// Vue.use(SocialSharing);
var infiniteScroll = require('vue-infinite-scroll');
Vue.use(infiniteScroll);
