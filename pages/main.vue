<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-card>
        <v-card-title>
          Kanji: Primitive Elements
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="desserts" :search="search">
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>
                  <v-img
                    :src=" item.url"
                    aspect-ratio="1"
                    class="grey lighten-2"
                    max-width="100"
                    max-height="100"
                  ></v-img>
                </td>
                <td>{{ item.en }}</td>
                <td>
                  <div v-html="$md.render(item.vi)"></div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import firebase from "firebase";

export default {
  async asyncData({ params, store }) {
    let desserts = [];
    await firebase
      .app()
      .firestore()
      .collection("kanjicore")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          desserts.push({ id: doc.id, ...doc.data() });
        });
      });
    return { desserts };
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Bộ",
          align: "center",
          sortable: false,
          value: "url"
        },
        {
          text: "Nghĩa tiếng Anh",
          align: "left",
          sortable: false,
          value: "en"
        },
        {
          text: "Nghĩa tiếng Việt",
          align: "left",
          sortable: false,
          value: "vi"
        }
      ],
      desserts: []
    };
  },
  head() {
    return {
      titleTemplate: `%s - Danh sách các nét cơ bản của Kanji`
    };
  },
  layout: "oboe",
  methods: {}
};
</script>