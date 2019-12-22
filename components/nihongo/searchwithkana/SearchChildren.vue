<template>
  <div>
    <v-text-field
      solo
      label="Search"
      prepend-inner-icon="mdi-magnify"
      clearable
      @keydown="search"
      v-model="textModel"
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
  props: ["text", "active"],
  data() {
    return {
      sheet: false,
      loading: false,
      textModel: ""
    };
  },
  computed: {
    disabled() {
      return this.sheet;
    }
  },
  methods: {
    emitActive(){
      this.$emit("active", !this.active);
    },
    handwriting(value) {
      this.textModel=this.textModel?this.text:"";
      this.textModel += value;
      this.sheet = false;
    },
    search(e) {
      this.$emit("keydown", e);
      if (!this.textModel) return;
      this.textModel = this.textModel.replace(/(\r\n|\n|\r)/gm, "").trim();
      if (
        e.key == "Enter" &&
        this.textModel &&
        this.$route.params.id != this.textModel
      ) {
        this.loading = true;
        this.$router.push(`/search/${this.textModel.toLowerCase()}`);
      }
    }
  },
  mounted() {
    this.textModel = this.$route.params.id;
  },
  watch: {
    textModel(value) {
      this.$emit("inputText", value);
    },
    text(value) {
      this.textModel = value;
    }
  }
};
</script>