<template>
  <v-container>
    <v-row justify="space-around">
      <v-spacer></v-spacer>
      <v-icon @click="dialog=true">mdi-pencil-circle-outline</v-icon>
    </v-row>
    <v-tabs dark background-color="teal darken-3" show-arrows v-model="tab">
      <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
      <v-tab v-for="(item,i) in itemsImg" :key="i" :href="'#tab-' + i">page {{ i }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="(item,i) in itemsImg" :key="i" :value="'tab-' + i">
        <v-img width="100%" :src="item" contain></v-img>
      </v-tab-item>
    </v-tabs-items>
    <v-dialog v-model="dialog" fullscreen>
      <v-card>
        <v-container>
          <v-textarea auto-grow v-model="itemLocals" hide-details dense></v-textarea>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialog = false">Close</v-btn>
            <v-btn color="primary" text @click="edit(index,itemLocals)">Thêm</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
export default {
  components: {},
  computed: {
    itemsImg() {
      return this.items.split(/\r?\n/);
    },
  },
  data: () => ({
    model: 0,
    dialog: false,
    itemLocals: null,
    tab: null,
  }),
  mounted() {
    this.itemLocals = this.items;
  },
  methods: {
    edit(index, data) {
      this.$store.commit("editData1", {
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
      this.dialog = false;
    },
  },
  props: ["items", "id", "index", "creator"],
};
</script>