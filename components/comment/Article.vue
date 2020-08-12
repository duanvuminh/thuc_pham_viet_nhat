<template>
  <div v-if="item!=null">
    <oContent :content="item" @edit="edit" @deleteArticle="deleteArticle" :inApp="true"></oContent>
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
//const Comments = () => import("@/components/comment/Comments");
import Comments from '@/components/comment/Comments';
//const oContent = () => import("@/components/comment/Content");
import oContent from '@/components/comment/Content';

export default {
  components: {
    Comments,
    oContent,
  },
  created() {},
  computed: {},
  data() {
    return {
      collectionSubUrl: "commentSub",
      collectionUrl: `forum/${this.id}/comments`,
      comments: [],
      lastID: null,
      item: null,
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
  layout: "simpleForum",
  methods: {
    fbtime(timestamp) {
      // console.log(timestamp);
      return new Date(timestamp.seconds * 1e3);
    },
    edit(content, id) {
      firebase.firestore().collection("forum").doc(id).update({
        content: content,
      });
      this.item.content = content;
    },
    deleteArticle(id){
      
    }
  },
  mounted() {
    if (!this.id) {
      return;
    }
    firebase
      .firestore()
      .collection("forum")
      .doc(this.id)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return;
        }
        this.item = {
          id: doc.id,
          ...doc.data(),
        };
        this.item.time = new Date(doc.data().time.seconds * 1e3);
      });
    firebase
      .firestore()
      .collection("forum")
      .doc(this.id)
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
          this.lastID = doc.id;
          this.comments.push({
            id: doc.id,
            userEmail: doc.data().userEmail,
            comment: doc.data().comment,
            for: doc.data().for,
            time: new Date(doc.data().time.seconds * 1e3),
            commentSub: [],
          });
        });
      });
  },
  props: ["id"],
};
</script>
