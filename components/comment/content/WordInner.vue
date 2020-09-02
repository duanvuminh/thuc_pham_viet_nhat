<template>
  <v-container>
    <div class="d-flex">
      <v-btn v-if="show1All" text @click="show1All=false" small>hide all word</v-btn>
      <v-btn v-else text @click="show1All=true" small>show all word</v-btn>
      <v-btn v-if="show2All" text @click="show2All=false" small>hide all mean</v-btn>
      <v-btn v-else text @click="show2All=true" small>show all mean</v-btn>
    </div>
    <template>
      <WordItem
        :controller="index>=0"
        v-for="(item, i) in itemLocals"
        :key="key(i)"
        :item="item"
        :creator="creator"
        @add="add(i)"
        @edit="edit(i,...arguments)"
        @xoa="xoa(i)"
        :show1All="show1All"
        :show2All="show2All"
      ></WordItem>
    </template>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
export default {
  components: {
    WordItem: () => import("@/components/comment/content/WordItem"),
  },
  computed: {
    state() {
      return `${this.show1All ? "1" : "-1"}${this.show2All ? "1" : "-1"}`;
    },
  },
  data: () => ({
    itemLocals: null,
    show1All: true,
    show2All: true,
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
          color: "#FF00FF",
          icon: "mdi-plus",
        },
      });
      let data = this.$store.state.contents[this.index].data;
      firebase.firestore().collection("forum").doc(this.id).set(
        {
          data: data,
        },
        { merge: true }
      );
    },
    xoa(index) {
      this.$store.commit("spliceData", {
        index: this.index,
        index1: index,
      });
      let data = this.$store.state.contents[this.index].data;
      firebase.firestore().collection("forum").doc(this.id).set(
        {
          data: data,
        },
        { merge: true }
      );
    },
    key(i){
      return `${i}${this.state}`
    },
    edit(index, data) {
      this.$store.commit("editData", {
        index: this.index,
        index1: index,
        val: data,
      });
      let data1 = this.$store.state.contents[this.index].data;
      firebase.firestore().collection("forum").doc(this.id).set(
        {
          data: data1,
        },
        { merge: true }
      );
      // has parent?
    },
  },
  props: ["items", "id", "index", "creator"],
};
</script>