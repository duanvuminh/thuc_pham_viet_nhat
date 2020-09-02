<template>
  <v-timeline align-top :dense="$vuetify.breakpoint.xs">
    <TimelineItem
      :controller="index>=0"
      v-for="(item, i) in itemLocals"
      :key="i"
      :item="item"
      :creator="creator"
      @add="add(i)"
      @edit="edit(i,...arguments)"
      @xoa="xoa(i)"
    ></TimelineItem>
  </v-timeline>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
export default {
  components: {
    TimelineItem: () => import("@/components/comment/content/TimelineItem"),
  },
  data: () => ({
    itemLocals: null,
  }),
  mounted() {
    this.itemLocals = this.items;
  },
  methods: {
    add(index) {
      this.$store.commit("pushData", {
        index: this.index,
        index1: index,
        val: {
          color: "#000000",
          icon: "mdi-plus",
        },
      });
      let data = this.$store.state.contents[this.index].data;
      firebase.firestore().collection("forum").doc(this.id).set({
        data: data,
      },{merge: true});
    },
    xoa(index) {
      this.$store.commit("spliceData", {
        index: this.index,
        index1: index,
      });
      let data = this.$store.state.contents[this.index].data;
      firebase.firestore().collection("forum").doc(this.id).set({
        data: data,
      },{merge: true});
    },
    edit(index,data) {
      this.$store.commit("editData", {
        index: this.index,
        index1: index,
        val:data
      });
      let data1 = this.$store.state.contents[this.index].data;
      firebase.firestore().collection("forum").doc(this.id).set({
        data: data1,
      },{merge: true});
      // has parent?
    },
  },
  props: ["items", "id", "index","creator"],
};
</script>