<template>
  <v-col cols="12">
    <SearchWithKana v-if="active" @active="emitActive" :active="active"></SearchWithKana>
    <SearchWithoutKana v-else @active="emitActive" :active="active"></SearchWithoutKana>
  </v-col>
</template>
<script>
import SearchWithoutKana from "./searchwithoutkana/SearchWithoutKana";
//const SearchWithoutKana = ()=> import("./searchwithoutkana/SearchWithoutKana")
import SearchWithKana from "./searchwithkana/SearchWithKana";
//const SearchWithKana = ()=> import("./searchwithkana/SearchWithKana")

import { mapState } from "vuex";

export default {
  components: {
    SearchWithoutKana,
    SearchWithKana
  },
  computed: mapState({ active: "japanesInput" }),
  data() {
    return {};
  },
  methods: {
    emitActive(value) {
      this.$store.commit("setJapanesInput", value);
    }
  }
};
</script>