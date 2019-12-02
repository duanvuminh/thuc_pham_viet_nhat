<template>
  <v-row justify="center">
    <v-col cols="12" sm="6">
      <v-text-field
        solo
        label="Search"
        prepend-inner-icon="mdi-magnify"
        clearable
        @keypress="search"
        v-model="searchkey"
      ></v-text-field>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      searchkey: ""
    };
  },
  layout: "oboe",
  methods: {
    search(e) {
      if (
        e.key == "Enter" &&
        this.searchkey.replace(/(\r\n|\n|\r)/gm, "").trim()
      ) {
        this.$router.push(`/search/${this.searchkey}`);
      }
    }
  },
  mounted() {
    // this.$axios
    //   .$post(
    //     "https://translation.googleapis.com/language/translate/v2?key=AIzaSyCgybxabzEcfCXOeZHVrwVenvrtY7OkV3M",
    //     {
    //       q: "I've never seen a cow with human legs before!",
    //       source: "en",
    //       target: "vi",
    //       format: "text"
    //     }
    //   )
    //   .then(r => console.log(r));
  }
};
</script>