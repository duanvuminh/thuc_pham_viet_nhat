<template>
  <div class="d-flex">
    <template v-if="!inApp">
      <v-btn text @click="$emit('setId',id)" small fab>
        <v-icon dark small>mdi-message-reply-text</v-icon>
      </v-btn>
      {{messageCount>0?messageCount:""}}
    </template>
    <Like icon="mdi-thumb-up" :path="path" name="liked"></Like>
    <v-btn text small fab @click="save" :color="is_saved==1?'blue':null">
      <v-icon dark small>mdi-bookmark-multiple</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-menu v-if="show&&inApp" bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon color="grey darken-1" small>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="$emit('openDialog')">
          <v-list-item-title>
            <v-icon color="grey darken-1" small>mdi-pencil-circle-outline</v-icon>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
import Like from "./Like";
export default {
  components: {
    Like,
  },
  data() {
    return {
      messageCount: 0,
      is_saved: false,
      show: true,
    };
  },
  methods: {
    save() {
      if (this.$store && this.$store.state.user.email == null) {
        this.$router.push(`/login`);
        return;
      }
      this.is_saved = !this.is_saved;
      firebase
        .firestore()
        .doc(`users/${this.$store.state.user.email}/save/${this.id}`)
        .set(
          { id: this.id, path: this.path, is_saved: this.is_saved },
          { merge: true }
        );
    },
    setShow(val) {
      this.show = val;
    },
  },
  mounted() {
    firebase
      .firestore()
      .doc(`users/${this.$store.state.user.email}/save/${this.id}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.is_saved = doc.data().is_saved;
        }
      });
  },
  props: ["id", "inApp"],
  computed: {
    path() {
      return `forum/${this.id}`;
    },
  },
};
</script>
