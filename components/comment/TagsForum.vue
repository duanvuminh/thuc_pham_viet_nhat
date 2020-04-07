<template>
  <v-dialog v-model="dialogTag1" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar color="teal lighten-3" dark dense>
        <v-btn icon dark @click="$emit('setDialogTag', false); dialogTag1=false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Chọn chủ đề</v-toolbar-title>
      </v-toolbar>
      <!-- <v-col cols="12">
        <v-text-field label="Tìm kiếm" outlined dense hide-details></v-text-field>
      </v-col>-->
      <div class="text-left">
        <v-chip
          v-for="item in tags"
          :key="item.id"
          class="ma-2"
          :color="item.name=='home'||item.name=='mypage'?'red':''"
          outlined
          @click="selectTopic(item.name)"
        >{{rename(item.name)}}</v-chip>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  async mounted() {},
  computed: {},
  data() {
    return {
      dialogTag1: false,
      tags: []
    };
  },
  methods: {
    selectTopic(topic) {
      this.$emit("setDialogTag", false);
      this.dialogTag1 = false;
      this.$emit("setTagName", topic);
    },
    rename(name) {
      if (name == "home") {
        return "Chủ đề chung";
      }
      if (name == "mypage") {
        return "Nơi bạn ghi lại cho riêng bạn";
      }
      return name;
    }
  },
  mounted() {
    firebase
      .firestore()
      .collection("topic")
      .get()
      .then(documentSnapshots => {
        // Get the last visible document
        // last = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        // Construct a new query starting at this document,
        // get the next 25 cities.
        documentSnapshots.forEach(doc => {
          if (!this.full) {
            if (doc.data().name == "home" || doc.data().name == "mypage")
              return;
          }
          let tag = { id: doc.id, ...doc.data() };
          this.tags.push(tag);
        });
      });
  },
  props: ["dialogTag", "full"],
  watch: {
    dialogTag(val) {
      this.dialogTag1 = val;
    }
  }
};
</script>