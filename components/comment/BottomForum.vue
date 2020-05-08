<template>
  <div>
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
    <tags @setDialogTag="setDialogTag" :dialogTag="dialog" @setTagName="setTagName" :full="false"></tags>
    <v-btn color="pink" dark fixed bottom right fab @click="dialog=true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
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
    tags
  },
  data() {
    return {
      dialog: false,
      focusTab: "",
      tabval: "home"
    };
  },
  methods: {
    setDialogTag(val) {
      this.dialog = val;
    },
    setTagName(topic) {
      this.focusTab = topic;
      this.tabval = topic;
    }
  },
  watch: {
    tabval(val) {
      this.$emit("changeType", val);
    }
  }
};
</script>