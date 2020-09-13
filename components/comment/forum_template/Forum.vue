<template>
  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
    <v-row class="mb-5 pb-5">
      <v-col cols="12">
        <oContent
          v-for="(item,index) in contents"
          :key="item.id"
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
import firebase from "firebase/app";
import "firebase/firestore";
import { mapState } from "vuex";
//const oContent = () => import("./Content");
import oContent from "../Content";

export default {
  components: {
    oContent,
  },
  computed: {
    ...mapState(["contents", "date"]),
    // key() {
    //   return [this.topic, this.date].join();
    // },
  },
  created() {},
  data() {
    return {
      busy: false,
      email: this.$store.state.user.email,
      limit: 10,
      lastID: null,
      now: 1,
      topic:null
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
          this.$store.commit("unshiftContent", message);
        });
    },
    deleteArticle(index, id) {
      this.$store.commit("spliceContent", index);
    },
    edit(index, newVal) {
      // this.contents[index].content = newVal;
      this.$store.commit("editContent", { index, val: newVal });
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
            .where("type", "==", this.topic)
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
    this.topic = this.$route.params.id;   
    try {
      if (this.contents.length > 0) {
        this.lastID = this.contents[this.contents.length - 1].id;
        return;
      }
      firebase
        .firestore()
        .collection(this.collectionUrl)
        .where("type", "==", this.topic)
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
    } catch (err) {
      // console.log(err);
    }
  },
  watch: {
    // key() {
    //   try {
    //     this.$store.commit("setContent", []);
    //     this.lastID = null;
    //     firebase
    //       .firestore()
    //       .collection(this.collectionUrl)
    //       .where("type", "==", this.topic)
    //       .where(
    //         "date",
    //         this.date ? "==" : "<",
    //         this.date ? this.date : "99999999"
    //       )
    //       .orderBy(this.date ? "time" : "date", "desc")
    //       .limit(10)
    //       .get()
    //       .then((documentSnapshots) => {
    //         // Get the last visible document
    //         // last = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    //         // Construct a new query starting at this document,
    //         // get the next 25 cities.
    //         documentSnapshots.forEach((doc) => {
    //           this.lastID = doc.id;
    //           this.$store.commit("pushContent", {
    //             id: doc.id,
    //             creator: doc.data().creator,
    //             content: doc.data().content,
    //             type: doc.data().type,
    //             time: new Date(doc.data().time.seconds * 1e3),
    //             data: doc.data().data,
    //             cus_component: doc.data().cus_component,
    //           });
    //         });
    //       });
    //   } catch (err) {
    //     // console.log(err);
    //   }
    // },
  },
  props: ["collectionUrl"],
};
</script>
