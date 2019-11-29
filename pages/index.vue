<template>
  <v-layout row wrap align-center class="pa-4">
    <v-flex xs12 md4 v-for="(item,i) in cards" :key="i" class="justify-content alined pa-1">
      <v-img
        :src="item.image_url1"
        aspect-ratio="2"
        class="grey lighten-2"
        max-width="100%"
        max-height="100%"
      >
        <v-row align="end" class="lightbox pa-2 fill-height">
          <v-col>
            <div class="body-1">
              <v-btn
                dark
                text
                :nuxt="false"
                :to="`/detail/${nonAccentVietnamese(item.name)}-${item.id}`"
              >{{item.name}}</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-img>
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