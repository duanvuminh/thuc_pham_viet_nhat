import Vue from 'vue'
import firebase from 'firebase/app';
import VueSimplemde from 'vue-simplemde';
import 'simplemde/dist/simplemde.min.css';

if (!firebase.apps.length) {
    firebase.initializeApp(config)
    firebase
        .firestore()
        .enablePersistence({ synchronizeTabs: true })
}

Vue.component('vue-simplemde', VueSimplemde);
var SocialSharing = require('vue-social-sharing');
Vue.use(SocialSharing);
var infiniteScroll = require('vue-infinite-scroll');
Vue.use(infiniteScroll);
