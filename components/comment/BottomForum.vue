<template>
  <div>
    <template v-if="!drawer">
      <v-bottom-navigation v-model="tabval" fixed dense>
        <v-btn value="home">
          <v-icon :color="tabval=='home'?'teal lighten-3':''">mdi-home</v-icon>
        </v-btn>

        <v-btn value="mypage">
          <v-icon :color="tabval=='mypage'?'teal lighten-3':''">mdi-account-arrow-left</v-icon>
        </v-btn>
        <v-btn
          icon
          v-if="focusTab"
          :value="focusTab"
          :color="tabval==focusTab?'teal lighten-3':''"
        >{{focusTab}}</v-btn>
      </v-bottom-navigation>
      <v-btn color="pink" dark fixed bottom right fab @click="dialog=true">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <tags
      @setDialogTag="setDialogTag"
      :dialogTag="dialog"
      @selecTopic1="selecTopic1"
      @selecTopic="selecTopic"
      @setTagName="setTagName"
      :full="false"
      @setDrawer="setDrawer"
      :drawer="drawer"
    ></tags>
  </div>
</template>
<script>
//const tags = () => import("./TagsForum");
import tags from "./TagsForum";
export default {
  mounted() {
    // setInterval(() => {
    //   console.log(this.tabval);
    // }, 300);
  },
  components: {
    tags,
  },
  data() {
    return {
      dialog: false,
      focusTab: "",
      tabval: "home",
      drawer: null,
    };
  },
  methods: {
    setDialogTag(val) {
      this.dialog = val;
    },
    setDrawer(val) {
      this.drawer = val;
    },
    setTagName(topic) {
      this.focusTab = topic;
      this.tabval = topic;
    },
    selecTopic1(level1, topic, topic1) {
      this.$emit("selecTopic1", level1, topic, topic1);
    },
    selecTopic(level1, topic) {
      this.$emit("selecTopic", level1, topic);
    },
  },
  watch: {
    // tabval(val) {
    //   this.$emit("changeType", val);
    // },
  },
};
</script>