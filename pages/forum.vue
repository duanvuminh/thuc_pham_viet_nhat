<template>
  <div>
    <template v-if="artId==null">
      <add :size="40" :rows="2" :never_hide="true" @datechange="datechange" @add="add" ref="add"></add>
      <forum
        :type="type"
        :collectionUrl="collectionUrl"
        :date="date"
        :key="key"
        ref="forum"
        @setId="setId"
      ></forum>
    </template>
    <Article :id="artId" :key="artId" @setId="setId"></Article>
    <bottom @selecTopic1="selecTopic1" @selecTopic="selecTopic"></bottom>
  </div>
</template>
<script>
// import HtmlParser from "@/components/HtmlParser";
import firebase from "firebase/app";
import "firebase/firestore";
// const forum = () => import("@/components/comment/Forum");
import forum from "@/components/comment/Forum";
//const add = () => import("@/components/comment/AddForum");
import add from "@/components/comment/AddForum";
//const bottom = () => import("@/components/comment/BottomForum");
import bottom from "@/components/comment/BottomForum";
import Article from "@/components/comment/Article";

export default {
  async asyncData({ params, store, $axios }) {},
  beforeCreate() {},
  components: {
    forum,
    add,
    bottom,
    Article,
  },
  created() {},
  computed: {
    key() {
      return `${this.date}${this.type.id}`;
    },
    addKey() {
      return id;
    },
    type() {
      return { level1: this.level1, topic: this.topic, id: this.id };
    },
  },
  data() {
    return {
      collectionUrl: "forum",
      date: null,
      artId: null,
      /// type
      level1: null,
      topic: null,
      id: null,
      /// end type
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
    selecTopic1(level1, topic, topic1) {
      this.level1 = level1;
      this.topic = topic;
      this.id = topic1;
    },
    selecTopic(level1, topic) {
      this.level1 = level1;
      this.topic = topic;
      this.id = topic;
    },
    setId(val) {
      this.artId = val;
    },
  },
  mounted() {},
  watch: {
    type(val) {
      this.artId = null;
      this.$nextTick(() => {
        this.$refs.add.setType(val.id);
      });
    },
  },
};
</script>
<style>
.markdown-editor .CodeMirror,
.markdown-editor .CodeMirror-scroll {
  min-height: 200px;
}
</style>
