<template>
  <div>
    <add :size="40" :rows="2" :never_hide="true" @datechange="datechange" @add="add" :type="type"></add>
    <forum :type="type" :collectionUrl="collectionUrl" :date="date" :key="key" ref="forum"></forum>
    <bottom @changeType="changeType"></bottom>
  </div>
</template>
<script>
// import HtmlParser from "@/components/HtmlParser";
import firebase from "firebase/app";
import "firebase/firestore";
const forum = () => import("@/components/comment/Forum");
const add = () => import("@/components/comment/AddForum");
const bottom = () => import("@/components/comment/BottomForum");
export default {
  async asyncData({ params, store, $axios }) {},
  beforeCreate() {},
  components: {
    forum,
    add,
    bottom
  },
  created() {},
  computed: {
    key() {
      return `${this.date}${this.type}`;
    }
  },
  data() {
    return {
      collectionUrl: "forum",
      date: null,
      type: "home"
    };
  },
  head() {
    return {
      titleTemplate: `%s - Forum`
    };
  },
  layout: "simple",
  methods: {
    add(message){
      this.$refs.forum.add(message)
    },
    datechange(val) {
      this.date = val;
    },
    changeType(val) {
      this.type = val;
    }
  },
  mounted() {}
};
</script>
<style>
.markdown-editor .CodeMirror,
.markdown-editor .CodeMirror-scroll {
  min-height: 200px;
}
</style>
