<template>
  <div class="ma-3" style="max-width:750px;width:100%">
    <v-app-bar elevation="0" color="transparent" dense fixed>
      <v-spacer></v-spacer>
      <v-btn fab small to="/forum">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn fab small @click="$router.go(-1)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-app-bar>
    <oContent :content="item" @edit="edit" @deleteArticle="deleteArticle"></oContent>
    <Comments
      :comments="comments"
      :collectionSubUrl="collectionSubUrl"
      :collectionUrl="collectionUrl"
      :lastID="lastID"
    ></Comments>
  </div>
</template>
<script>
// import HtmlParser from "@/components/HtmlParser";
import { mapState } from "vuex";

const Comments = () => import("@/components/comment/Comments");
const oContent = () => import("@/components/comment/Content");

export default {
  async asyncData({ params, store, $axios,$fire }) {
    let comments = [];
    let lastID = "";
    let item = [];
    //changeDrawner
    try {
      await $fire
        .firestore
        .collection("forum")
        .doc(params.aid)
        .get()
        .then((doc) => {
          item = doc.data();
          item.id = doc.id;
          item.time = new Date(item.time.seconds * 1e3);
        });
      await $fire
        .firestore
        .collection("forum")
        .doc(params.aid)
        .collection("comments")
        .orderBy("time")
        .limit(10)
        .get()
        .then((documentSnapshots) => {
          // Get the last visible document
          // last = documentSnapshots.docs[documentSnapshots.docs.length - 1];
          // Construct a new query starting at this document,
          // get the next 25 cities.
          documentSnapshots.forEach((doc) => {
            lastID = doc.id;
            comments.push({
              id: doc.id,
              userEmail: doc.data().userEmail,
              comment: doc.data().comment,
              for: doc.data().for,
              time: new Date(doc.data().time.seconds * 1e3),
              commentSub: [],
            });
          });
        });
    } catch (err) {
      // console.log(err);
    }
    return { comments, lastID, item };
  },
  beforeCreate() {},
  components: {
    Comments,
    oContent,
  },
  created() {
  },
  computed: {
    ...mapState(["contents"]),
  },
  data() {
    return {
      collectionSubUrl: "commentSub",
      collectionUrl: `forum/${this.$route.params.aid}/comments`,
    };
  },
  head() {
    return {
      titleTemplate: `%s - Forum`,
      // title: `Oboe - cách học kanji với cách nhớ đơn giản`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Forum hỏi đáp về tiếng nhật và cuộc sống ở nhật",
        },
      ],
    };
  },
  layout: "noheader",
  methods: {
    fbtime(timestamp) {
      // console.log(timestamp);
      return new Date(timestamp.seconds * 1e3);
    },
    edit(content, id) {
      this.item.content = content;
    },
    deleteArticle() {
      for (let i = 0; i < this.contents.length; i++) {
        if (this.contents[i].id == this.item.id) {
          this.$store.commit("spliceContent", i);
        }
      }
      this.$router.go(-1);
    },
  },
  mounted() {},
};
</script>
