<template>
  <v-card>
    <v-container>
      <WordItem
        v-for="(item, i) in itemLocals"
        :key="i"
        :item="item"
        @add="add(i)"
        @edit="edit(i)"
        @xoa="xoa(i)"
        :controller="true"
      ></WordItem>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('close-timeline')">Close</v-btn>
        <v-btn color="primary" text @click="$emit('extension',{data:items})">Thêm</v-btn>
      </v-card-actions>
    </v-container>
  </v-card>
</template>

<script>
export default {
  components: {
    WordItem: () => import("@/components/comment/content/WordItem"),
  },
  data: () => ({
    itemLocals: null,
  }),
  mounted() {
    this.itemLocals = this.items;
  },
  methods: {
    add(index) {
      this.itemLocals.splice(index, 0, {
        color: "#FF00FF",
        icon: "mdi-plus",
      });
    },
    xoa(index) {
      this.itemLocals.splice(index, 1);
    },
    edit(index) {
      //console.log(this.items);
    },
  },
  props: ["items"],
};
</script>