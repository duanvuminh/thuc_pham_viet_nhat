<template>
  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
    <v-row class="mb-5 pb-5">
      <v-col cols="12">
        <oContent
          v-for="(item,index) in contents"
          :key="index.id"
          :content="item"
          @deleteArticle="deleteArticle(index,...arguments)"
          @edit="edit(index,...arguments)"
          :index="index"
        ></oContent>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapState } from "vuex";
//const oContent = () => import("./Content");
import oContent from "../Content";

export default {
  components: {
    oContent,
  },
  computed: {
    ...mapState(["topic", "contents"]),
  },
  created() {},
  data() {
    return {
      busy: false,
      email: this.$store.state.user.email,
      limit: 10,
      lastID: null,
      now: 1,
      saveList: [],
    };
  },
  methods: {
    deleteArticle(index, id) {
      this.$store.commit("spliceContent", index);
    },
    edit(index, newVal, id) {
      // this.contents[index].content = newVal;
      this.$store.commit("editContent", { index, val: newVal });
    },
    loadMore() {
      if (!this.lastID) return;
      this.busy = true;
      this.$fire
        .firestore
        .collection(this.collectionUrl)
        .doc(this.lastID)
        .get()
        .then((last) => {
          return this.$fire
            .firestore
            .collection(this.collectionUrl)
            .where(
              this.$fire.firestore.FieldPath.documentId(),
              "in",
              this.saveList
            )
            .startAfter(last)
            .limit(this.limit)
            .get()
            .then((documentSnapshots) => {
              // Get the last visible document
              documentSnapshots.forEach((doc) => {
                this.lastID = doc.id;
                this.$store.commit("pushContent", {
                  id: doc.id,
                  creator: doc.data().creator,
                  content: doc.data().content,
                  time: new Date(doc.data().time.seconds * 1e3),
                  type: doc.data().type,
                  data: doc.data().data,
                  cus_component: doc.data().cus_component,
                });
              });
              this.busy = false;
            });
        });
    },
  },
  mounted() {
    this.saveList = [];
    this.$fire
      .firestore
      .collection(`users/${this.$store.state.user.email}/save`)
      .where("is_saved", "==", true)
      .get()
      .then((documentSnapshots) => {
        documentSnapshots.forEach((doc) => {
          this.saveList.push(doc.data().id);
        });
        if (this.contents.length > 0) {
          return;
        }
        this.$fire
          .firestore
          .collection(this.collectionUrl)
          .where(this.$fire.firestore.FieldPath.documentId(), "in", this.saveList)
          .limit(10)
          .get()
          .then((documentSnapshots) => {
            // Get the last visible document
            // last = documentSnapshots.docs[documentSnapshots.docs.length - 1];
            // Construct a new query starting at this document,
            // get the next 25 cities.
            documentSnapshots.forEach((doc) => {
              this.lastID = doc.id;
              this.$store.commit("pushContent", {
                id: doc.id,
                creator: doc.data().creator,
                content: doc.data().content,
                type: doc.data().type,
                time: new Date(doc.data().time.seconds * 1e3),
                data: doc.data().data,
                cus_component: doc.data().cus_component,
              });
            });
          });
      });
  },
  watch: {},
  props: ["collectionUrl"],
};
</script>
