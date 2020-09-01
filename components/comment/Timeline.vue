<template>
  <v-card>
    <v-container>
      <v-timeline align-top :dense="$vuetify.breakpoint.smAndDown">
        <TimelineItem
          v-for="(item, i) in itemLocals"
          :key="i"
          :item="item"
          @add="add(i)"
          @edit="edit(i)"
          @xoa="xoa(i)"
          :controller="true"
        ></TimelineItem>
      </v-timeline>
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
    TimelineItem: () => import("@/components/comment/TimelineItem"),
  },
  data: () => ({
    itemLocals: null
  }),
  mounted(){
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
      console.log(this.items);
    },
  },
  props:["items"]
};
</script>