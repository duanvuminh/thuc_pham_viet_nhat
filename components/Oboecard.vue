<template>
  <v-card class="mx-auto" elevation="1">
    <v-card-text class="pb-0">
      <HtmlParser :content="$md.render(item.vi)" />
    </v-card-text>
    <v-card-actions class="pt-0">
      <v-btn v-if="item.id=='duanvuminh@gmail.com'" text color="deep-purple accent-4" small>
        <v-icon left>mdi-star-outline</v-icon>Offical
      </v-btn>
      <v-btn v-else color="orange" text dark small>{{name}}</v-btn>
      <v-spacer></v-spacer>
      <!-- color="blue lighten-2" -->
      <v-btn text icon :color="is_liked==1?'blue':null" @click="upvote">
        <v-icon small>mdi-thumb-up</v-icon>
      </v-btn>
      <span v-if="liked">{{liked}}</span>
      <client-only>
        <social-sharing
          :url="`https://oboemasu.com${$route.path}`"
          :quote="$md.render(item.vi).replace(/<[^>]*>?/gm, '')"
          inline-template
        >
          <div>
            <network network="facebook">
              <v-btn text icon>
                <v-icon small>mdi-share</v-icon>
              </v-btn>
            </network>
          </div>
        </social-sharing>
      </client-only>
    </v-card-actions>
  </v-card>
</template>
<script>
//const HtmlParser = ()=>import("@/components/HtmlParser");
import HtmlParser from "@/components/HtmlParser";
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  props: ["item", "searchkey", "email"],
  components: {
    HtmlParser
  },
  data() {
    return {
      name: null,
      liked: 0,
      is_liked: -1
    };
  },
  computed: {},
  methods: {
    upvote() {
      this.is_liked = -1 * this.is_liked;
      this.liked += this.is_liked;
      firebase
        .firestore()
        .collection("kanji")
        .doc(this.searchkey)
        .collection("oboe")
        .doc(this.item.id)
        .set(
          {
            total_likeds: firebase.firestore.FieldValue.increment(this.is_liked)
          },
          { merge: true }
        );
      firebase
        .firestore()
        .collection("kanji")
        .doc(this.searchkey)
        .collection("oboe")
        .doc(this.item.id)
        .collection("liked")
        .doc(this.email)
        .set(
          {
            date: new Date(),
            is_liked: this.is_liked == 1 ? true : false
          },
          { merge: true }
        );
    }
  },
  mounted() {
    this.$axios.get(`/api/user?id=${this.email}`).then(r => {
      this.name = r.data.name;
    });
    firebase
      .firestore()
      .collection("kanji")
      .doc(this.searchkey)
      .collection("oboe")
      .doc(this.item.id)
      .get()
      .then(doc => {
        this.liked = doc.data().total_likeds;
      });
    firebase
      .firestore()
      .collection("kanji")
      .doc(this.searchkey)
      .collection("oboe")
      .doc(this.item.id)
      .collection("liked")
      .doc(this.email)
      .get()
      .then(doc => {
        if (doc.exists) {
          if (doc.data().is_liked) {
            this.is_liked = 1;
          } else {
            this.is_liked = -1;
          }
        } else {
          this.is_liked = -1;
        }
      });
    // .then(documentSnapshots => {
    //   documentSnapshots.forEach(doc => {
    //     posts.push({
    //       id: doc.id,
    //       url: doc.data().url,
    //       content: doc.data().content
    //     });
    //     lastId = doc.id;
    //   });
    // });
  }
};
</script>