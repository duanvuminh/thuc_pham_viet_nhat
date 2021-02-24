<template>
  <div>
    <add v-if="cus_component=='forum'" :size="40" :rows="2" :never_hide="true" @add="add" ref="add"></add>
    <component v-bind:is="cus_component" :collectionUrl="collectionUrl" ref="forum"></component>
  </div>
</template>
<script>
// import HtmlParser from "@/components/HtmlParser";
import { mapState } from "vuex";
// const forum = () => import("@/components/comment/Forum");
import forum from "@/components/comment/forum_template/Forum";
import save from "@/components/comment/forum_template/Save";
//const add = () => import("@/components/comment/AddForum");
import add from "@/components/comment/AddForum";
//const bottom = () => import("@/components/comment/BottomForum");
//import Article from "@/components/comment/Article";

export default {
  async asyncData({ params, store, $axios,$fire }) {
    await $fire.firestoreReady()
  },
  beforeCreate() {},
  components: {
    forum,
    add,
    save
  },
  created() {},
  computed: {
    cus_component(){
      if(this.$route.params.id=='save'){
        return 'save'
      }else{
        return 'forum'
      }
    }
  },
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
  methods: {
    add(message) {
      this.$refs.forum.add(message);
    },
    datechange(val) {
      this.date = val;
    },
  },
  mounted() {
  },
  watch: {},
};
</script>
<style>
.markdown-editor .CodeMirror,
.markdown-editor .CodeMirror-scroll {
  min-height: 200px;
}
</style>
