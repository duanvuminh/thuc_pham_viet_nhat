<template>
  <v-row align="center" justify="center">
    <v-col class="flex-sm-grow-0 flex-grow-1">
      <v-carousel v-if="card.image_url1" height="300">
        <v-carousel-item
          v-for="(item,i) in arrayImage"
          :key="i"
          :src="item"
          reverse-transition="fade-transition"
          transition="fade-transition"
        ></v-carousel-item>
      </v-carousel>
      <h1>{{card.name}}</h1>
      <div v-html="$md.render(card.description)"></div>
      <v-textarea
        label="Comment"
        auto-grow
        :rows="rows"
        @keypress="addComment"
        v-model="comment"
        :readonly="readonly"
        :placeholder="placeholder"
        :loading="loading"
      >
        <template slot="prepend">
          <v-avatar color="teal" size="48">
            <span class="white--text headline">{{avartar}}</span>
          </v-avatar>
        </template>
      </v-textarea>
      <template v-for="(item,i) in comments">
        <Comment
          :item="item"
          :key="i"
          @updateMe="addCommentSub"
          :parentCommentId="item.id"
          :forCommentId="item.id"
          :showname="false"
        >
          <v-col cols="10" offset="2" :key="i" class="pt-0">
            <template v-for="(item1,i) in item.comments">
              <Comment
                :item="item1"
                :key="i"
                @updateMe="addCommentSub"
                :parentCommentId="item.id"
                :forCommentId="item1.id"
                :showname="true"
              ></Comment>
            </template>
          </v-col>
        </Comment>
      </template>
    </v-col>
  </v-row>
</template>
<script>
import firebase from "firebase";
import Comment from "@/components/Comment";

export default {
  async asyncData({ params }) {
    let pieces = params.id.split("-");
    let id = pieces[pieces.length - 1];
    let item = firebase
      .app()
      .firestore()
      .collection("dulich")
      .doc(id);
    //
    let joker = await item
      .get()
      .then(rs => {
        let card = rs.data();
        return item
          .collection("commentsAdmin")
          .orderBy("date_edit", "desc")
          .get()
          .then(snapshot => {
            let promises = [];
            snapshot.forEach(doc => {
              let commentSubs = [];
              promises.push(
                item
                  .collection("commentsAdmin")
                  .doc(doc.id)
                  .collection("comments")
                  .orderBy("date_edit", "desc")
                  .get()
                  .then(snapshotSub => {
                    snapshotSub.forEach(docsub => {
                      commentSubs.push({ id: docsub.id, ...docsub.data() });
                    });
                    return {
                      id: doc.id,
                      comments: commentSubs,
                      ...doc.data()
                    };
                  })
              );
            });
            return Promise.all(promises).then(comments => {
              return { id, card, comments };
            });
          });
      })
      .then();
    return { ...joker };
    //
    // const rs = await item.get();
    // let card = rs.data();
    // let commentsCollection = await item.collection("comments").get();
    // let comments = [];
    // commentsCollection.forEach(async doc => {
    //   // doc.data() is never undefined for query doc snapshots
    //   //console.log(doc.id, " => ", doc.data());
    //   let commentsubCollection = await item
    //     .collection("comments")
    //     .doc(doc.id)
    //     .collection("comments")
    //     .get();
    //   let commentsSub = [];
    //   commentsubCollection.forEach(doc => {
    //     // doc.data() is never undefined for query doc snapshots
    //     //console.log(doc.id, " => ", doc.data());
    //     commentsSub.push({ id: doc.id, ...doc.data() });
    //   });
    //   comments.push({ id: doc.id, comments: commentsSub, ...doc.data() });
    // });
    // return { id, card, comments };
  },
  components: {
    Comment
  },
  beforeCreate() {},
  computed: {
    arrayImage() {
      let ar = [];
      if (this.card.image_url1) {
        ar = [this.card.image_url1];
      }
      if (this.card.image_url2) {
        ar = [this.card.image_url1, this.card.image_url2];
      }
      if (this.card.image_url3) {
        ar = [this.card.image_url1, this.card.image_url2, this.card.image_url3];
      }
      return ar;
    },
    readonly() {
      return !this.$store.state.loggedIn;
    },
    placeholder() {
      return this.$store.state.loggedIn ? "" : "Login to comment";
    },
    avartar() {
      return this.user.email ? this.user.email[0] : "^.^";
    }
  },
  data() {
    return {
      user: {},
      comment: "",
      checkbox: true,
      card: {},
      comments: [],
      rows: 1,
      loading: false
    };
  },
  head() {
    return {
      titleTemplate: `%s - ${this.card.name}`,
      title: process.env.site_name || "",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: this.card.seo || ""
        }
      ]
    };
  },
  layout: "admin",
  methods: {
    iso8601Time(timestamp) {
      // console.log(timestamp);
      try {
        return new Date(timestamp.seconds * 1e3).toISOString().slice(0, -5);
      } catch (e) {
        return new timestamp.toISOString().slice(0, -5);
      }
    },
    addComment(e) {
      if (!this.$store.state.loggedIn) {
        return;
      }
      if (
        e.key == "Enter" &&
        this.comment.replace(/(\r\n|\n|\r)/gm, "").trim()
      ) {
        this.loading = true;
        firebase
          .firestore()
          .collection("dulich")
          .doc(this.id)
          .collection("commentsAdmin")
          .add({
            text: this.comment,
            date_create: new Date(),
            date_edit: new Date(),
            forCommentId: "",
            parentCommentId: "",
            ...this.user
          })
          .then(r => {
            this.loading = false;
            this.comments.unshift({
              id: r.id,
              text: this.comment,
              date_create: new Date(),
              date_edit: new Date(),
              forCommentId: "",
              parentCommentId: "",
              ...this.user
            });
            this.comment = "";
            this.rows = 1;
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
      }
    },
    addCommentSub(value) {
      firebase
        .firestore()
        .collection("dulich")
        .doc(this.id)
        .collection("commentsAdmin")
        .doc(value.parentCommentId)
        .collection("comments")
        .add(value)
        .then(r => {
          this.loading = false;
          let parent = this.comments.filter(x => x.id == value.parentCommentId);
          if (value.forCommentId == value.parentCommentId) {
            parent[0].comments.unshift({
              id: r.id,
              ...value
            });
          } else {
            let index =
              parent[0].comments.findIndex(x => x.id == value.forCommentId) + 1;
            parent[0].comments.splice(index, 0, {
              id: r.id,
              ...value
            });
          }
          this.comment = "";
          this.rows = 1;
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
    }
  },
  mounted() {
    this.user = this.$store.state.user;
  }
};
</script>
<style>
img{
  max-width:100%
}
</style>