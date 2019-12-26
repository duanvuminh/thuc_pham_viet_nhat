<template>
  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
    <v-row align="center" justify="center">
      <v-card
        v-for="(post,index) in posts"
        style="margin-bottom: 2rem;"
        data-aos="slide-up"
        data-aos-offset="100"
        data-aos-easing="ease-out-back"
        :key="index"
        class="ma-2"
        elevation="0"
      >
        <v-img v-if="post.url" class="orange--text align-end" :src="post.url" contain></v-img>
        <v-card-text>
          <HtmlParser :content="$md.render(post.content)"></HtmlParser>
          <b>{{post.id}}</b>
        </v-card-text>
      </v-card>
    </v-row>
  </div>
</template>
<script>
import HtmlParser from "@/components/HtmlParser";
import firebase from "firebase/app";
import "firebase/firestore";
import { mapState } from "vuex";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
export default {
  async asyncData({ params, store, $axios }) {
    let posts=[]
    let last={}
    let next ={}
    let limit=5
    await firebase
      .firestore()
      .collection("manga")
      .orderBy("edited", "desc")
      .limit(5)
      .get()
      .then(documentSnapshots => {
        // Get the last visible document
        documentSnapshots.forEach(doc => {
          posts.push({ id: doc.id, ...doc.data() });
        });
        last = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        // Construct a new query starting at this document,
        // get the next 25 cities.
        next = firebase
          .firestore()
          .collection("manga")
          .orderBy("edited", "desc")
          .startAfter(last)
          .limit(limit);
      });
      return {posts,last,next,limit}
  },
  beforeCreate() {},
  components: {
    HtmlParser
  },
  created() {
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
  layout: "oboe",
  methods: {
    loadMore() {
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
  mounted() {
    AOS.init();
  }
};
</script>