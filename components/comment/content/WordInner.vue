<template>
  <v-container>
    <div class="d-flex">
      <v-spacer></v-spacer>
      <v-btn icon @click="show1All=!show1All">
        <v-icon small v-if="show1All">mdi-eye-check-outline</v-icon>
        <v-icon small v-else>mdi-eye-off-outline</v-icon>
      </v-btn>
      <v-btn icon @click="show2All=!show2All">
        <v-icon small v-if="show2All">mdi-eye-check-outline</v-icon>
        <v-icon small v-else>mdi-eye-off-outline</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
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
    key(i) {
      return `${i}${this.state}`;
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