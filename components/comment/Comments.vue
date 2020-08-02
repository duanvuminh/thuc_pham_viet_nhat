<template>
  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
    <v-row>
      <v-col cols="12">
        <h2>Trả lời</h2>
      </v-col>
      <v-col cols="12">
        <add :size="40" :rows="2" :never_hide="true" @add="addRoot"></add>
      </v-col>
      <v-col cols="12">
        <comment
          v-for="item in comments"
          :key="item.id"
          :comment="item"
          @add="add"
          :isRoot="true"
          :rootId="item.id"
          :rootEmail="item.userEmail"
          :path="`${collectionUrl}/${item.id}`"
        >
          <v-col cols="12" class="mt-0 pt-0">
            <div class="d-flex justify-start">
              <div class="ml-9 flex-grow-1">
                <comment
                  v-for="item_sub in item.commentSub"
                  :key="item_sub.id"
                  :comment="item_sub"
                  @add="add"
                  :isRoot="false"
                  :rootId="item.id"
                  :rootEmail="item.userEmail"
                  :path="`${collectionUrl}/${item.id}/${collectionSubUrl}/${item_sub.id}`"
                ></comment>
              </div>
            </div>
          </v-col>
        </comment>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
//const comment = () => import("./Comment");
import comment from './Comment';
//const add = () => import("./Add");
import add from "./Add";

export default {
  components: {
    comment,
    add
  },
  created() {},
  data() {
    return {
      busy: false,
      size: 50,
      email: this.$store.state.user.email,
      limit: 10,
      last: null,
      next: null
    };
  },
  methods: {
    add(comment) {
      this.comments.forEach((item, index) => {
        if (item.id == comment.rootId) {
          if (comment.for == item.userEmail) {
            comment.for = "";
          }
        }
      });
      firebase
        .firestore()
        .collection(
          `${this.collectionUrl}/${comment.rootId}/${this.collectionSubUrl}`
        )
        .add(comment)
        .then(docRef => {
          comment.id = docRef.id;
          this.comments.forEach((item, index) => {
            if (item.id == comment.rootId) {
              this.comments[index].commentSub.unshift(comment);
            }
          });
        });
    },
    addRoot(comment) {
      comment.commentSub = [];
      comment.for = null;
      firebase
        .firestore()
        .collection(`${this.collectionUrl}`)
        .add(comment)
        .then(docRef => {
          comment.id = docRef.id;
          this.comments.unshift(comment);
        });
    },
    loadMore() {
      if (this.next) {
        this.busy = true;
        this.next.get().then(documentSnapshots => {
          // Get the last visible document
          documentSnapshots.forEach(async doc => {
            let commentSub = [];
            await firebase
              .firestore()
              .collection(
                `${this.collectionUrl}/${doc.id}/${this.collectionSubUrl}`
              )
              .orderBy("time")
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(sbcomment => {
                  commentSub.push({
                    id: sbcomment.id,
                    userEmail: sbcomment.data().userEmail,
                    comment: sbcomment.data().comment,
                    for: sbcomment.data().for,
                    time: new Date(sbcomment.data().time.seconds * 1e3)
                  });
                });
              });
            if (
              this.comments.every(x => {
                return x.id != doc.id;
              })
            ) {
              this.comments.push({
                id: doc.id,
                userEmail: doc.data().userEmail,
                comment: doc.data().comment,
                for: doc.data().for,
                time: new Date(doc.data().time.seconds * 1e3),
                commentSub: commentSub
              });
            }
          });
          this.busy = false;
          this.last = documentSnapshots.docs[documentSnapshots.docs.length - 1];
          if (!this.last) return;
          // Construct a new query starting at this document,
          // get the next 25 cities.
          this.next = firebase
            .firestore()
            .collection(this.collectionUrl)
            .orderBy("time")
            .startAfter(this.last)
            .limit(this.limit);
        });
      }
    }
  },
  mounted() {
    console.log(this.lastID);
    if (this.lastID) {
      firebase
        .firestore()
        .collection(this.collectionUrl)
        .doc(this.lastID)
        .get()
        .then(doc => {
          this.last = doc;
          this.next = firebase
            .firestore()
            .collection(this.collectionUrl)
            .orderBy("time")
            .startAfter(this.last)
            .limit(this.limit);
        });
    }
    this.comments.forEach(item => {
      firebase
        .firestore()
        .collection(`${this.collectionUrl}/${item.id}/${this.collectionSubUrl}`)
        .orderBy("time")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(sbcomment => {
            item.commentSub.push({
              id: sbcomment.id,
              userEmail: sbcomment.data().userEmail,
              comment: sbcomment.data().comment,
              for: sbcomment.data().for,
              time: new Date(sbcomment.data().time.seconds * 1e3)
            });
          });
        });
    });
  },
  props: ["comments", "collectionUrl", "collectionSubUrl", "lastID"]
};
</script>
