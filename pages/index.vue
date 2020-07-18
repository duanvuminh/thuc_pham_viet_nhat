<template>
  <v-col cols="11" md="6">
    <v-row align="start" justify="center">
      <Logo />
      <Search />
      <v-col cols="12">
        <v-row align="start" justify="space-around">
          <nuxt-link to="/9gag" class="nuxt-link">Otaku</nuxt-link>
          <nuxt-link to="/manga" class="nuxt-link">Blog</nuxt-link>
          <nuxt-link to="/main" class="nuxt-link">Bộ kanji</nuxt-link>
          <a href="https://simplemde.com/markdown-guide" class="nuxt-link">Cách viết bài</a>
          <a text @click="getfulllistkanji">{{showmore?"Ẩn":"Kanji cơ bản"}}</a>
        </v-row>
      </v-col>
      <v-col cols="12">
        <template v-if="showmore">
          <HtmlParser :content="all" />
        </template>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import HtmlParser from "@/components/HtmlParser";
import Logo from "@/components/Logo";
//const HtmlParser = () => import("@/components/HtmlParser");
import Search from "@/components/nihongo/Search";
// const Search = () => import("@/components/nihongo/Search");
export default {
  components: {
    Search,
    HtmlParser,
    Logo
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
  head() {
    return {
      titleTemplate: `%s - cách học kanji với cách nhớ đơn giản`,
      // title: `Oboe - cách học kanji với cách nhớ đơn giản`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Cách học kanji qua những câu chuyện thú vị cho người mới bắt đầu, kanji n1,n2,n3,n4,n5"
        }
      ]
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