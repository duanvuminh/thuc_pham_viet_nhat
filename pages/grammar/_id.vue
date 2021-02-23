<template>
  <v-row align="center">
    <div>
      <h1>{{post.title}}</h1>
      <div>
        <HtmlParser :content="$md.render(post.content)"></HtmlParser>
      </div>
    </div>
  </v-row>
</template>
<script>
// import HtmlParser from "@/components/HtmlParser";
const HtmlParser = () => import("@/components/HtmlParser");
export default {
  async asyncData({ params, store, $axios }) {
    return {id:params.id}
  },
  beforeCreate() {},
  components: {
    HtmlParser
  },
  created() {
    
  },
  computed: {
  },
  data() {
    return {
      post: {
        content:""
      },
    };
  },
  head() {
    return {
      titleTemplate: `%s - Học tiếng nhật với Oboe`
    };
  },
  layout: "oboe",
  methods: {
  },
  mounted() {
    this.$fire
      .firestore
      .collection("grammar")
      .doc(this.id)
      .get()
      .then(doc => {
        // Get the last visible document
        // last = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        // Construct a new query starting at this document,
        // get the next 25 cities.
        this.post = doc.data()
        //console.log(doc)
      });
  }
};
</script>