<template>
  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
    <v-row class="mb-5 pb-5">
      <v-col cols="12">
        <h4 v-if="type=='mypage'" class="mb-3 text-center">Put your stuff here to note</h4>
        <oContent v-for="item in contents" :key="item.id" :content="item" @setId="val=>$emit('setId',val)" :inApp="false"></oContent>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
//const oContent = () => import("./Content");
import oContent from "./Content";

export default {
  components: {
    oContent,
  },
  created() {},
  computed: {},
  data() {
    return {
      busy: false,
      contents: [],
      email: this.$store.state.user.email,
      limit: 10,
      lastID: null,
      now: 1,
    };
  },
  methods: {
    add(message) {
      firebase
        .firestore()
        .collection("forum")
        .add(message)
        .then((docRef) => {
          message.id = docRef.id;
          this.contents.unshift(message);
        });
    },
    loadMore() {
      if (!this.lastID) return;
      this.busy = true;
      firebase
        .firestore()
        .collection(this.collectionUrl)
        .doc(this.lastID)
        .get()
        .then((last) => {
          return firebase
            .firestore()
            .collection(this.collectionUrl)
            .where("type", "==", this.type.id)
            .where(
              "date",
              this.date ? "==" : "<",
              this.date ? this.date : "99999999"
            )
            .orderBy(this.date ? "time" : "date", "desc")
            .startAfter(last)
            .limit(this.limit)
            .get()
            .then((documentSnapshots) => {
              // Get the last visible document
              documentSnapshots.forEach((doc) => {
                this.lastID = doc.id;
                this.contents.push({
                  id: doc.id,
                  creator: doc.data().creator,
                  content: doc.data().content,
                  time: new Date(doc.data().time.seconds * 1e3),
                  type: doc.data().type,
                });
              });
              this.busy = false;
            });
        });
    },
  },
  mounted() {
    try {
      firebase
        .firestore()
        .collection(this.collectionUrl)
        .where("type", "==", this.type.id)
        .where(
          "date",
          this.date ? "==" : "<",
          this.date ? this.date : "99999999"
        )
        .orderBy(this.date ? "time" : "date", "desc")
        .limit(10)
        .get()
        .then((documentSnapshots) => {
          // Get the last visible document
          // last = documentSnapshots.docs[documentSnapshots.docs.length - 1];
          // Construct a new query starting at this document,
          // get the next 25 cities.
          documentSnapshots.forEach((doc) => {
            this.lastID = doc.id;
            this.contents.push({
              id: doc.id,
              creator: doc.data().creator,
              content: doc.data().content,
              type: doc.data().type,
              time: new Date(doc.data().time.seconds * 1e3),
            });
          });
        });
    } catch (err) {
      console.log(err);
    }
  },
  props: ["collectionUrl", "type", "date"],
};
</script>
