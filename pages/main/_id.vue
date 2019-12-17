<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-card>
        <v-card-subtitle>Kanji: Primitive Elements</v-card-subtitle>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          dense
          :headers="headers"
          :items="desserts"
          :search="search"
          :items-per-page="10"
          :footer-props="footer"
          hide-default-header
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>
                  <v-img
                    :src=" item.url"
                    aspect-ratio="1"
                    class="grey lighten-2"
                    width="50"
                    height="50"
                  ></v-img>
                </td>
                <td>
                  <div v-html="$md.render(item.en)"></div>
                </td>
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
export default {
  async asyncData({ params, store, $axios }) {
    let desserts = [];
    desserts = await $axios
      .$get("/api/get_all_primatives", {
        firstName: "Fred",
        lastName: "Flintstone"
      })
      .then();
    return { desserts };
  },
  data() {
    return {
      search: this.$route.params.id,
      footer: {
        itemsPerPageText: ""
      },
      headers: [
        {
          text: "Bộ",
          align: "center",
          sortable: false,
          value: "url"
        },
        {
          text: "Key",
          align: "start",
          value: "en"
        },
        {
          text: "Nghĩa tiếng Việt",
          align: "start",
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