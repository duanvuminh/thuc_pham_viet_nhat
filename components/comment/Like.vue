<template>
  <div>
    <v-btn text icon :color="is_liked==1?'blue':null" @click="upvote" small>
      <v-icon x-small>{{mdiThumbUp}}</v-icon>
    </v-btn>
    <span v-if="liked">{{liked}}</span>
  </div>
</template>
<script>
import {mdiThumbUp} from "@mdi/js"
export default {
  components: {},
  data() {
    return {
      is_liked: -1,
      liked: 0,
      mdiThumbUp
    };
  },
  methods: {
    upvote() {
      if (this.$store && this.$store.state.user.email == null) {
        this.$router.push(`/login`);
        return;
      }
      this.is_liked = -1 * this.is_liked;
      this.liked += this.is_liked;
      this.$fire
        .firestore
        .doc(this.path)
        .set(
          {
            total_likeds: this.$fireModule.firestore.FieldValue.increment(this.is_liked)
          },
          { merge: true }
        );
      this.$fire
        .firestore
        .doc(`${this.path}/${this.name}/${this.$store.state.user.email}`)
        .set(
          {
            date: new Date(),
            is_liked: this.is_liked == 1 ? true : false
          },
          { merge: true }
        );
    }
  },
  async mounted() {
    await this.$fire.firestoreReady();
    this.$fire
      .firestore
      .doc(this.path)
      .get()
      .then(doc => {
        this.liked = doc.data().total_likeds?doc.data().total_likeds:0;
        if (!this.liked) {
          this.liked = 0;
        }
      });
    this.$fire
      .firestore
      .doc(`${this.path}/${this.name}/${this.$store.state.user.email}`)
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
  },
  props: ["icon", "path", "name"],
  computed: {}
};
</script>
