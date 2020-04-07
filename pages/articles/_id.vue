<template>
  <div>
    <oContent :content="item" @edit="edit"></oContent>
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
import firebase from "firebase/app";
import "firebase/firestore";
const Comments = () => import("@/components/comment/Comments");
const oContent = () => import("@/components/comment/Content");

export default {
  async asyncData({ params, store, $axios }) {
    let comments = [];
    let lastID = "";
    let item = [];
    try {
      await firebase
        .firestore()
        .collection("forum")
        .doc(params.id)
        .get()
        .then(doc => {
          item = doc.data();
          item.id = doc.id;
          item.time = new Date(item.time.seconds * 1e3);
        });
      await firebase
        .firestore()
        .collection("forum")
        .doc(params.id)
        .collection("comments")
        .orderBy("time")
        .limit(10)
        .get()
        .then(documentSnapshots => {
          // Get the last visible document
          // last = documentSnapshots.docs[documentSnapshots.docs.length - 1];
          // Construct a new query starting at this document,
          // get the next 25 cities.
          documentSnapshots.forEach(doc => {
            lastID = doc.id;
            comments.push({
              id: doc.id,
              userEmail: doc.data().userEmail,
              comment: doc.data().comment,
              for: doc.data().for,
              time: new Date(doc.data().time.seconds * 1e3),
              commentSub: []
            });
          });
        });
    } catch (err) {
      console.log(err);
    }
    return { comments, lastID, item };
  },
  beforeCreate() {},
  components: {
    Comments,
    oContent
  },
  created() {},
  computed: {},
  data() {
    return {
      collectionSubUrl: "commentSub",
      collectionUrl: `forum/${this.$route.params.id}/comments`
    };
  },
  head() {
    return {
      titleTemplate: `%s - Forum`
    };
  },
  layout: "simple",
  methods: {
    fbtime(timestamp) {
      // console.log(timestamp);
      return new Date(timestamp.seconds * 1e3);
    },
    edit(content, id) {
      firebase
        .firestore()
        .collection("forum")
        .doc(id)
        .update({
          content: content
        });
      this.item.content = content;
    }
  },
  mounted() {}
};
</script>
