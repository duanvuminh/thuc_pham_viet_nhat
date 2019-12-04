<template>
  <v-card class="mx-auto">
    <v-card-text v-html="$md.render(item.vi)"></v-card-text>

    <v-card-actions>
      <v-btn v-if="item.id=='duanvuminh@gmail.com'" text color="deep-purple accent-4">
        <v-icon left>mdi-star-outline</v-icon>Offical
      </v-btn>
      <v-btn v-else color="orange" text dark>{{item.id}}</v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="this.$store.state.loggedIn" text icon @click="like(item)">
        <v-icon :color="color">mdi-thumb-up</v-icon>
      </v-btn>
      <small v-if="couter>0">{{couter}}</small>
      <!-- color="blue lighten-2" -->
    </v-card-actions>
  </v-card>
</template>
<script>
import firebase from "firebase";
export default {
  props: ["item", "searchkey", "email"],
  data() {
    return {
      color: "",
      isliked: false,
      couter: 0
    };
  },
  computed: {},
  methods: {
    like(item) {
      if (!this.isliked) {
        this.couter += 1;
        firebase
          .app()
          .firestore()
          .collection("kanji")
          .doc(this.searchkey)
          .collection("oboe")
          .doc(this.item.id)
          .collection("liked")
          .doc(this.email)
          .set(
            {
              date: new Date()
            },
            { merge: true }
          )
          .then(r => {
            firebase
              .app()
              .firestore()
              .collection("kanji")
              .doc(this.searchkey)
              .collection("oboe")
              .doc(this.item.id)
              .set(
                {
                  couter: this.item.id=="duanvuminh@gmail.com"?this.couter+999999:this.couter
                },
                { merge: true }
              );
            this.color = "blue lighten-2";
            this.isliked = true;
          });
      } else {
        this.couter -= 1;
        firebase
          .app()
          .firestore()
          .collection("kanji")
          .doc(this.searchkey)
          .collection("oboe")
          .doc(this.item.id)
          .collection("liked")
          .doc(this.email)
          .delete()
          .then(() => {
            firebase
              .app()
              .firestore()
              .collection("kanji")
              .doc(this.searchkey)
              .collection("oboe")
              .doc(this.item.id)
              .set(
                {
                  couter: this.item.id=="duanvuminh@gmail.com"?this.couter+999999:this.couter
                },
                { merge: true }
              );
            this.color = "";
            this.isliked = false;
          })
          .catch(function(error) {
            console.error("Error removing document: ", error);
          });
      }
    }
  },
  mounted() {
    firebase
      .app()
      .firestore()
      .collection("kanji")
      .doc(this.searchkey)
      .collection("oboe")
      .doc(this.item.id)
      .collection("liked")
      .doc(this.email)
      .get()
      .then(r => {
        if (r.data()) {
          this.isliked = true;
          this.color = "blue lighten-2";
        } else {
          this.isliked = false;
          this.color = "";
        }
      });
    firebase
      .app()
      .firestore()
      .collection("kanji")
      .doc(this.searchkey)
      .collection("oboe")
      .doc(this.item.id)
      .get()
      .then(r => {
        this.couter = r.data().couter;
        if ((this.item.id = "duanvuminh@gmail.com")) {
          this.couter -= 999999;
        }
      });
  }
};
</script>