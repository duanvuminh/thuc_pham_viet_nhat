<template>
  <v-layout column wrap class="my-12" align-center>
    <v-flex xs12 sm4 class="my-4">
      <div class="text-center">
        <h2 class="headline">Các bạn có thể bán trực tiếp cho cửa hàng</h2>
        <span class="subheading">Hoặc đăng nhập và giao bán</span>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
import firebase from "firebase";

export default {
  async asyncData({ params }) {
  },
  beforeCreate() {},
  computed: {

  },
  data() {
    return {
      tab: -1,
      checkbox: true,
    };
  },
  methods: {
  },
  mounted() {
    // console.log(this.items);
  }
};
</script>