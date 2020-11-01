<template>
  <v-row justify="center" style="width: 100%; max-width: 600px">
    <v-card>
      <v-card-text>
        <v-img
        v-if="url"
        class="orange--text align-end"
        :src="url"
        contain
      ></v-img>
        <div v-html="text"></div>
      </v-card-text>
    </v-card>
  </v-row>
</template>
<script>
import Search from "@/components/nihongo/Search";
//const Search = ()=>import("@/components/nihongo/Search")
import HtmlParser from "@/components/HtmlParser";
//const HtmlParser = ()=>import("@/components/HtmlParser")

export default {
  async asyncData({ params, store, $axios }) {
    let api = await $axios
      .$get("/api/handwriting", {
        params: {
          id: store.state.visionurl,
        },
      })
      .then();
    return {
      url: store.state.visionurl,
      text: api.result,
    };
  },
  components: {
    Search,
    HtmlParser,
  },
  data() {
    return {};
  },
  layout: "oboe",
  methods: {},
  mounted() {},
};
</script>