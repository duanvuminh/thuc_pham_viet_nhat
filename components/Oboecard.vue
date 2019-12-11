<template>
  <v-card class="mx-auto">
    <v-card-text class="pb-0">
      <div v-html="$md.render(item.vi)"></div>
    </v-card-text>

    <v-card-actions class="pt-0">
      <v-btn v-if="item.id=='duanvuminh@gmail.com'" text color="deep-purple accent-4">
        <v-icon left>mdi-star-outline</v-icon>Offical
      </v-btn>
      <v-btn v-else color="orange" text dark>{{item.id}}</v-btn>
      <v-spacer></v-spacer>
      <!-- color="blue lighten-2" -->
      <social-sharing
        :url="`https://oboe.lithong.com${$route.path}`"
        :quote="$md.render(item.vi).replace(/<[^>]*>?/gm, '')"
        inline-template
      >
        <div>
          <network network="facebook">share</network>
        </div>
      </social-sharing>
    </v-card-actions>
  </v-card>
</template>
<script>
import firebase from "firebase";
export default {
  props: ["item", "searchkey", "email"],
  data() {
    return {
    };
  },
  computed: {},
  methods: {
  },
  mounted() {
  
  }
};
</script>