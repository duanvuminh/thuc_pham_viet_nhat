<template>
  <v-col cols="12">
    <v-text-field
      solo
      label="Search"
      prepend-inner-icon="mdi-magnify"
      clearable
      @keypress="search"
      @blur="search1"
      v-model="text"
      :loading="loading"
      :disabled="disabled"
    >
      <template slot="append">
        <v-btn class="mt-2 mb-2" :color="active?'cyan':'black'" icon @click="active=!active">あ</v-btn>
        <v-btn class="mt-2 mb-2" color="cyan" icon @click="sheet=!sheet">
          <v-icon dark>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-text-field>
    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center" height="300px">
        <Handwriting @handwriting="handwriting" />
      </v-sheet>
    </v-bottom-sheet>
  </v-col>
</template>
<script>
import Handwriting from "./Handwriting";
export default {
  components: {
    Handwriting
  },
  props:["text","active"],
  data() {
    return {
      sheet: false,
      loading: false
    };
  },
  computed: {
    disabled() {
      return this.sheet;
    }
  },
  methods: {
    handwriting(value) {
      this.text = value;
      this.sheet = false;
      this.search1();
    },
    search1(e) {
      this.$emit("blur",e);
      if (!this.text) return;
      this.text = this.text.replace(/(\r\n|\n|\r)/gm, "").trim();
      if (this.text && this.$route.params.id != this.text) {
        this.loading = true;
        this.$router.push(`/search/${this.text}`);
      }
    },
    search(e) {
      this.$emit("keydown",e);
      if (!this.text) return;
      this.text = this.text.replace(/(\r\n|\n|\r)/gm, "").trim();
      if (e.key == "Enter" && this.text && this.$route.params.id != this.text) {
        this.loading = true;
        this.$router.push(`/search/${this.text}`);
      }
    }
  },
  mounted() {
    this.text = this.$route.params.id;
  },
  watch: {
    text(value) {
      this.$emit("inputText", value);
    }
  }
};
</script>