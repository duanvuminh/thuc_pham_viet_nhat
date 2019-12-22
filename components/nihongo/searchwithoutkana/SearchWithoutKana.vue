<template>
  <div>
    <v-text-field
      solo
      label="Search"
      prepend-inner-icon="mdi-magnify"
      clearable
      @keypress="search"
      v-model="text"
      :loading="loading"
      :disabled="disabled"
      hide-details
    >
      <template slot="append">
        <v-btn class="mt-2 mb-2" :color="active?'cyan':'black'" icon @click="emitActive">あ</v-btn>
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
  </div>
</template>
<script>
import Handwriting from "@/components/Handwriting";
export default {
  components: {
    Handwriting
  },
  computed: {
    disabled() {
      return this.sheet;
    }
  },
  data() {
    return {
      sheet: false,
      text: "",
      loading: false
    };
  },
  methods: {
    emitActive() {
      this.$emit("active", !this.active);
    },
    handwriting(value) {
      this.text=this.text?this.text:"";
      this.text += value;
      this.sheet = false;
    },
    search(e) {
      if (!this.text) return;
      this.text = this.text.replace(/(\r\n|\n|\r)/gm, "").trim();
      if (e.key == "Enter" && this.text && this.$route.params.id != this.text) {
        this.loading = true;
        this.$router.push(`/search/${this.text.toLowerCase()}`);
      }
    }
  },
  mounted() {
    this.text = this.$route.params.id;
  },
  props: ["active"],
  watch: {}
};
</script>