import Vue from 'vue'
import firebase from 'firebase/app';
import VueSimplemde from 'vue-simplemde';
import 'simplemde/dist/simplemde.min.css';

Vue.component('vue-simplemde', VueSimplemde);
var SocialSharing = require('vue-social-sharing');
Vue.use(SocialSharing);
var infiniteScroll = require('vue-infinite-scroll');
Vue.use(infiniteScroll);
