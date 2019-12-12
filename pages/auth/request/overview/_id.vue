<template>
  <v-row justify="center">
    <v-col cols="12" class="d-flex flex-wrap align-center justify-space-around">
      <v-card v-for="(item, index) in items" :key="index" width="300" class="ma-4">
        <v-card-text>
          <div v-html="$md.render(item.vi)"></div>
        </v-card-text>
        <v-card-actions>
          <v-switch v-model="item.display" label="Hiển thị" class="mr-1" @change="commit(item)"></v-switch>
          <v-checkbox v-model="item.done" label="Đã kiểm tra" @change="commit(item)"></v-checkbox>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import firebase from "firebase";
export default {
  async asyncData({ params, store }) {
    return { params };
  },
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
        .doc(this.params.id)
        .collection("oboe")
        .doc(item.id)
        .set(
          {
            request: !item.done,
            display: item.display
          },
          { merge: true }
        );
    }
  },
  async mounted() {
    console.log(this.params);
    let items = [];
    await firebase
      .app()
      .firestore()
      .collection("kanji")
      .doc(this.params.id)
      .collection("oboe")
      .where("display", "==", true)
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