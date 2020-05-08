<template>
  <v-row justify="center">
    <Search />
    <v-col cols="12">
      <HtmlParser :content="$md.render(introdue)" />
      <a text @click="getfulllistkanji">
        <small>{{showmore?"show less":"show more"}}</small>
      </a>
      <template v-if="showmore">
        <HtmlParser :content="all" />
      </template>
    </v-col>
  </v-row>
</template>
<script>
import HtmlParser from "@/components/HtmlParser";
//const HtmlParser = () => import("@/components/HtmlParser");
import Search from "@/components/nihongo/Search";
// const Search = () => import("@/components/nihongo/Search");
export default {
  components: {
    Search,
    HtmlParser
  },
  data() {
    return {
      all: "",
      introdue: ` 
[池](/show/池)｜[北](/show/北)｜[姦](/show/姦)｜...
      `,
      showmore: false
    };
  },
  layout: "oboe",
  methods: {
    getfulllistkanji() {
      this.showmore = !this.showmore;
      if (!this.showmore) return;
      this.$axios.get(`/api/all`).then(r => {
        this.all = this.$md.render(r.data.html);
      });
    }
  },
  mounted() {}
};
</script>