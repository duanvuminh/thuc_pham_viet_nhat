<template>
  <Comments></Comments>
</template>
<script>
// import HtmlParser from "@/components/HtmlParser";
const Comments = () => import("@/components/comment/Comments");

export default {
  async asyncData({ params, store, $axios }) {},
  beforeCreate() {},
  components: {
    Comments
  },
  created() {},
  computed: {},
  data() {},
  head() {
    return {
      titleTemplate: `%s - Forum`
    };
  },
  layout: "oboe",
  methods: {},
  mounted() {}
};
</script>
