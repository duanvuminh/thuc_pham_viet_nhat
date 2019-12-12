<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-card>
        <v-card-actions v-for="(item, index) in items" :key="index">
          <v-btn :to="`/auth/request/${item.id}`" class="display-1 d-flex" text>{{item.id}}</v-btn>
          <v-spacer />
          <v-checkbox v-model="item.done" label="Đã kiểm tra xong" @change="commit(item)"></v-checkbox>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import firebase from "firebase";
export default {
  async asyncData({ params, store }) {},
  data() {
    return {
      items: []
    };
  },
  layout: "oboe",
  methods: {
    commit(item) {
      firebase
        .app()
        .firestore()
        .collection("kanji")
        .doc(item.id)
        .set(
          {
            hasRequest: !item.done
          },
          { merge: true }
        );
    }
  },
  async mounted() {
    // i dont known why but it dont work in server side render
    let items = [];
    await firebase
      .app()
      .firestore()
      .collection("kanji")
      .where("hasRequest", "==", true)
      .limit(10)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          items.push({ id: doc.id, ...doc.data() });
        });
      });
    this.items = items;
  }
};
</script>