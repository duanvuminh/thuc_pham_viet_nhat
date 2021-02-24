<template>
  <v-card class="mx-auto my-5" width="500">
    <v-img v-if="document.src" height="250" :src="document.src" contain></v-img>

    <v-card-title>{{document.full_name}}</v-card-title>

    <v-card-text>
      <v-row align="center" class="mx-0">
        <v-rating :value="4.5" color="amber" dense half-increments readonly size="14"></v-rating>

        <div class="grey--text ml-4">4.5 (413)</div>
      </v-row>
      <HtmlParser :content="$md.render(document.description)"></HtmlParser>
    </v-card-text>
  </v-card>
</template>
<script>
// import HtmlParser from "@/components/HtmlParser";
import { mapState } from "vuex";
import HtmlParser from "@/components/HtmlParser";

export default {
  async asyncData({ params, store, $axios,$fire }) {
    await $fire.firestoreReady()
    let document = {};
    await $fire
      .firestore
      .collection("topic")
      .doc(params.tag)
      .get()
      .then((doc) => {
        document = { id: doc.id, ...doc.data() };
      });
    return { document };
  },
  beforeCreate() {},
  components: {
    HtmlParser
  },
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
