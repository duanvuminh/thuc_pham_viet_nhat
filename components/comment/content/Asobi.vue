<template>
  <v-card>
    <v-container>
      <v-card-text>Không cần làm gì</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('close-timeline')">Close</v-btn>
        <v-btn color="primary" text @click="$emit('extension',{data:items})">Thêm</v-btn>
      </v-card-actions>
    </v-container>
  </v-card>
</template>

<script>
import { SvgMap } from "vue-svg-map";
import Japan from "@svg-maps/japan";

export default {
  name: "MyMap",
  components: {
    SvgMap,
  },
  data() {
    return {
      Japan,
    };
  },
};
</script>

<style src="vue-svg-map/dist/index.css"></style>