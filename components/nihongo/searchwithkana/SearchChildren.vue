<template>
  <div>
    <v-text-field
      solo
      label="Search"
      prepend-inner-icon="mdi-magnify"
      clearable
      @blur="search"
      @keypress="search1"
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
        <v-btn class="mt-2 mb-2" color="cyan" icon @click="openImage">
          <v-icon dark>mdi-camera</v-icon>
          <input @change="onFileChange" ref="file" type="file" style="display: none" />
        </v-btn>
      </template>
    </v-text-field>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Privacy Policy</v-card-title>

        <v-card-text>Hãy đăng nhập để dùng chức năng này</v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center" height="300px">
        <Handwriting @handwriting="handwriting" />
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
// import Handwriting from "@/components/Handwriting";
const Handwriting = () => import("@/components/Handwriting");
export default {
  components: {
    Handwriting
  },
  props: ["text", "active"],
  data() {
    return {
      sheet: false,
      loading: false,
      textModel: "",
      dialog: false,
      files: []
    };
  },
  computed: {
    disabled() {
      return this.sheet;
    }
  },
  methods: {
    emitActive() {
      this.$emit("active", !this.active);
    },
    handwriting(value) {
      this.textModel = this.textModel ? this.text : "";
      this.textModel += value;
      this.sheet = false;
    },
    openImage() {
      if (!this.$store.state.loggedIn) {
        this.dialog = true;
      } else {
        this.$refs.file.click();
      }
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      Promise.all(
        // Array of "Promises"
        [files[0]].map(item => {
          var ref = firebase
            .storage()
            .ref("vision/" + this.$store.state.user.email + "/visionimg");
          return ref.put(item).then(r => {
            return ref.getDownloadURL();
          });
        })
      ).then(url => {
        //console.log(encodeURI(url[0]))
        this.$store.commit("setVision", url[0]);
        this.$router.push("/auth/vision");
      });
    },
    search(e) {
      this.$emit("keydown", e);
      if (!this.textModel) return;
      this.textModel = this.textModel.replace(/(\r\n|\n|\r)/gm, "").trim();
      if (this.textModel && this.$route.params.id != this.textModel) {
        this.loading = true;
        this.$router.push(`/show/${this.textModel.toLowerCase()}`);
      }
    },
    search1(e) {
      this.$emit("keydown", e);
      if (!this.textModel) return;
      this.textModel = this.textModel.replace(/(\r\n|\n|\r)/gm, "").trim();
      if (
        e.key == "Enter" &&
        this.textModel &&
        this.$route.params.id != this.textModel
      ) {
        this.loading = true;
        this.$router.push(`/show/${this.textModel.toLowerCase()}`);
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