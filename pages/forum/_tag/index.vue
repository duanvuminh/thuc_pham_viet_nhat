<template>
  <v-card class="mx-auto my-5" max-width="500">
    <v-img v-if="document.src" height="250" :src="document.src" contain></v-img>

    <v-card-title>{{document.full_name}}</v-card-title>

    <v-card-text>
      <v-row align="center" class="mx-0">
        <v-rating :value="4.5" color="amber" dense half-increments readonly size="14"></v-rating>

        <div class="grey--text ml-4">4.5 (413)</div>
      </v-row>
      <div>{{document.description}}</div>
    </v-card-text>
  </v-card>
</template>
<script>
// import HtmlParser from "@/components/HtmlParser";
import firebase from "firebase/app";
import "firebase/firestore";
import { mapState } from "vuex";

export default {
  async asyncData({ params, store, $axios }) {
    let document = {};
    await firebase
      .firestore()
      .collection("topic")
      .doc(params.tag)
      .get()
      .then((doc) => {
        document = { id: doc.id, ...doc.data() };
      });
    return { document };
  },
  beforeCreate() {},
  components: {},
  created() {},
  computed: {},
  data() {
    return {
      collectionUrl: "forum",
      date: null,
    };
  },
  head() {
    return {
      titleTemplate: `%s - Forum`,
    };
  },
  layout: "simpleForum",
  methods: {},
  mounted() {},
  watch: {},
};
</script>
<style>
.markdown-editor .CodeMirror,
.markdown-editor .CodeMirror-scroll {
  min-height: 200px;
}
</style>
