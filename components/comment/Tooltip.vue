<template>
  <div class="d-flex">
    <template v-if="showMessage">
      <div>
        <v-btn text :to="`/articles/${this.id}`" x-small fab>
          <v-icon dark x-small>mdi-message-reply-text</v-icon>
        </v-btn>
        {{messageCount>0?messageCount:""}}
      </div>
    </template>
    <Like icon="mdi-thumb-up" :path="path" name="liked"></Like>
    <v-btn text x-small fab @click="save" :color="is_saved==1?'blue':null">
      <v-icon dark x-small>mdi-bookmark-multiple</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <ActionPure
      v-if="editable"
      :_add="false"
      :_edit="true"
      :_delete="true"
      @edit="$emit('open-dialog')"
      @delete="$emit('delete-article')"
    ></ActionPure>
  </div>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
import Like from "./Like";
import ActionPure from "./ActionPure";

export default {
  components: {
    Like,
    ActionPure,
  },
  computed: {
    path() {
      return `forum/${this.id}`;
    },
    showMessage() {
      return this.$route.params.aid ? false : true;
    },
  },
  data() {
    return {
      messageCount: 0,
      is_saved: false,
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
    firebase
      .firestore()
      .doc(`forum/${this.id}`)
      .collection("comments")
      .get()
      .then((snap) => {
        this.messageCount = snap.size;
      });
  },
  props: ["editable", "id"],
};
</script>
