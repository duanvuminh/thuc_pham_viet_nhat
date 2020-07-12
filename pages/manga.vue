<template>
  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
    <v-col cols="12">
      <v-row align="start" justify="center">
        <template v-for="(post,index) in posts">
          <v-card style="margin-bottom: 2rem;width:100%" :key="index" class="ma-2" elevation="0">
            <v-card-text>
              <v-img
                v-if="post.url"
                class="orange--text align-end"
                :lazy-src="post.url"
                :src="post.url"
                contain
              ></v-img>
              <HtmlParser :content="$md.render(post.content)"></HtmlParser>
              <b>{{post.id}}</b>
            </v-card-text>
          </v-card>
        </template>
      </v-row>
    </v-col>
  </div>
</template>
<script>
import HtmlParser from "@/components/HtmlParser";
//const HtmlParser = () => import("@/components/HtmlParser");

import firebase from "firebase/app";
import "firebase/firestore";
import { mapState } from "vuex";
export default {
  async asyncData({ params, store, $axios }) {
    let posts = [];
    let lastId = "";
    let limit = 5;
    try {
      await firebase
        .firestore()
        .collection("manga")
        .orderBy("edited", "desc")
        .limit(5)
        .get()
        .then(documentSnapshots => {
          // Get the last visible document
          // last = documentSnapshots.docs[documentSnapshots.docs.length - 1];
          // Construct a new query starting at this document,
          // get the next 25 cities.
          documentSnapshots.forEach(doc => {
            posts.push({
              id: doc.id,
              url: doc.data().url,
              content: doc.data().content
            });
            lastId = doc.id;
          });
        });
    } catch (err) {
      console.log(err);
    }
    return { posts, lastId, limit };
  },
  beforeCreate() {},
  components: {
    HtmlParser
  },
  created() {
    if (this.lastId) {
      firebase
        .firestore()
        .collection("manga")
        .doc(this.lastId)
        .get()
        .then(doc => {
          this.last = doc;
          this.next = firebase
            .firestore()
            .collection("manga")
            .orderBy("edited", "desc")
            .startAfter(this.last)
            .limit(this.limit);
        });
    } else {
      firebase
        .firestore()
        .collection("manga")
        .orderBy("edited", "desc")
        .limit(5)
        .get()
        .then(documentSnapshots => {
          // Get the last visible document
          // last = documentSnapshots.docs[documentSnapshots.docs.length - 1];
          // Construct a new query starting at this document,
          // get the next 25 cities.
          documentSnapshots.forEach(doc => {
            this.posts.push({
              id: doc.id,
              url: doc.data().url,
              content: doc.data().content
            });
            this.lastId = doc.id;
            this.last = doc;
          });
          this.next = firebase
            .firestore()
            .collection("manga")
            .orderBy("edited", "desc")
            .startAfter(this.last)
            .limit(this.limit);
        });
    }
  },
  computed: {
    ...mapState(["user", "connectedFirebase"])
  },
  data() {
    return {
      posts: [],
      limit: 5,
      next: {},
      last: {},
      busy: false
    };
  },
  head() {
    return {
      titleTemplate: `%s - Học tiếng nhật với manga`
    };
  },
  layout: "simple",
  methods: {
    loadMore() {
      if (!this.next.firestore) return;
      this.busy = true;
      // this.$axios.get("").then(response => {
      //   let data = response.data.data.posts;
      //   // data.map( x=>  {
      //   //      this.translate(x.title).then(
      //   //        r=> x.title_vi = r
      //   //      )
      //   // })
      //   this.posts = this.posts.concat(data);
      //   this.busy = false;
      //   this.next = response.data.data.nextCursor;
      // })

      this.next.get().then(documentSnapshots => {
        // Get the last visible document
        documentSnapshots.forEach(doc => {
          this.posts.push({ id: doc.id, ...doc.data() });
        });
        this.busy = false;
        this.last = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        console.log("last", this.posts);
        if (!this.last) return;
        // Construct a new query starting at this document,
        // get the next 25 cities.
        this.next = firebase
          .firestore()
          .collection("manga")
          .orderBy("edited", "desc")
          .startAfter(this.last)
          .limit(this.limit);
      });
    }
    // translate(title) {
    //   return this.$axios
    //     .$post(
    //       "https://translation.googleapis.com/language/translate/v2?key=AIzaSyCgybxabzEcfCXOeZHVrwVenvrtY7OkV3M",
    //       {
    //         q: title,
    //         source: "en",
    //         target: "vi",
    //         format: "text"
    //       }
    //     )
    //     .then(r => {
    //      return r.data.translations[0].translatedText;
    //     });
    // }
  },
  mounted() {}
};
</script>
