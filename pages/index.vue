<template>
  <v-layout row wrap align-center class="pa-4">
    <v-flex xs12 md4 v-for="(item,i) in cards" :key="i" class="justify-content alined ">
      <v-card
        flat
        class="transparent"
        :href="`/detail/${nonAccentVietnamese(item.name)}-${item.id}`"
      >
        <v-card-title primary-title class="layout justify-center">
          <div class="headline text-center">{{item.name}}</div>
        </v-card-title>
        <v-img
          :src="item.image_url1"
          aspect-ratio="1"
          class="grey lighten-2"
          max-width="100%"
          max-height="100%"
        ></v-img>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import firebase from "firebase";
import getAppRoutes from "~/utils/getRoutes.js";

export default {
  async asyncData({ params }) {
    let item = await firebase
      .app()
      .firestore()
      .collection("dulich")
      .where("display", "==", true)
      .orderBy("date_edit")
      .limit(3)
      .get();
    //console.log(item)
    let cards = item.docs.map(x => {
      return { id: x.id, ...x.data() };
    });
    return { cards };
  },
  beforeCreate() {},
  computed: {},
  data() {
    return {
      items: []
    };
  },
  methods: {
    nonAccentVietnamese(text) {
      return getAppRoutes.nonAccentVietnamese(text);
    }
  },
  mounted() {}
};
</script>