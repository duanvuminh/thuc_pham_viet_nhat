<template>
  <v-row justify="center">
    <Search />
    <v-img v-if="url" class="orange--text align-end" :src="url" contain></v-img>
    <div v-html="text"></div>
  </v-row>
</template>
<script>
import Search from "@/components/nihongo/Search";
import HtmlParser from "@/components/HtmlParser";
export default {
  async asyncData({ params, store, $axios }) {
    let api = await $axios
      .$get("/api/handwriting", {
        params: {
          id: store.state.visionurl
        }
      })
      .then();
    return {
      url: store.state.visionurl,
      text:api.result
    };
  },
  components: {
    Search,
    HtmlParser
  },
  data() {
    return {};
  },
  layout: "oboe",
  methods: {},
  mounted() {
  }
};
</script>