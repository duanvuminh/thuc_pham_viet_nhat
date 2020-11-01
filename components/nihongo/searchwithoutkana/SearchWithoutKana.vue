<template>
  <div>
    <v-text-field
      solo
      label="Search"
      prepend-inner-icon="mdi-magnify"
      clearable
      v-model="text"
      :disabled="disabled"
      hide-details
      :items="items"
      :search-input.sync="search2"
      hide-no-data
      item-text="name"
      item-value="key"
      @keydown="search1"
      placeholder="Nhập kanji"
    >
      <template slot="append">
        <!-- <v-btn class="mt-2 mb-2" :color="active?'cyan':'black'" icon @click="emitActive">あ</v-btn> -->
        <v-btn class="mt-2 mb-2" color="cyan" icon @click="sheet = !sheet">
          <v-icon dark>mdi-pencil</v-icon>
        </v-btn>
        <v-btn class="mt-2 mb-2" color="cyan" icon @click="openImage">
          <v-icon dark>mdi-camera</v-icon>
          <input
            @change="onFileChange"
            ref="file"
            type="file"
            style="display: none"
          />
        </v-btn>
      </template>
      <!-- <template v-slot:item="data">
        <v-list-item @click="search3(data.item)">
        <v-list-item-content>
          <v-list-item-title v-text="data.item.name"></v-list-item-title>
          <v-list-item-subtitle v-text="data.item.label"></v-list-item-subtitle>
        </v-list-item-content>
        </v-list-item>
      </template> -->
    </v-text-field>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title
          >Privacy Policy</v-card-title
        >

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

import Handwriting from "@/components/Handwriting";
//const Handwriting = () => import("@/components/Handwriting");
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
      dialog: false,
      files: [],
      sheet: false,
      text: "",
      items: [],
      search2: null
    };
  },
  methods: {
    emitActive() {
      this.$emit("active", !this.active);
    },
    handwriting(value) {
      this.search2 = this.search2 ? this.search2 : "";
      this.search2 += value;
      this.sheet = false;
       this.text=2;
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
    search1(e) {
      if (e.key == "Enter") {
              this.$router.push(`/show/${this.text.trim()[0]}`);

      }
    },
    search3(item) {
        item.key == 2
          ? this.$router.push(`/mean/${item.name}`)
          : this.$router.push(`/show/${item.name}`);
    }
  },
  mounted() {
    let id = this.$route.params.id;
    this.text = id;
    // let path = this.$route.path;
    // if (id) {
    //   if (id.trim().length == 1) {
    //     this.items = [
    //       { name: this.search2, key: 1, label: "Cách nhớ" },
    //       { name: this.search2, key: 2, label: "Tra từ" }
    //     ];
    //     if (path.includes("mean")) {
    //       this.text = 2;
    //     } else {
    //       this.text = 1;
    //     }
    //   } else if (id.trim().length > 1) {
    //     this.items = [{ name: this.search2, key: 2, label: "Tra từ" }];
    //     this.text = 2;
    //   }
    // }
  },
  props: ["active"],
  watch: {
    search2(val) {
      if (val) {
        if (val.trim().length == 1) {
          this.items = [
            { name: val, key: 1, label: "Cách nhớ" },
            { name: val, key: 2, label: "Tra từ" }
          ];
        } else if (val.trim().length > 1) {
          this.items = [{ name: val, key: 2, label: "Tra từ" }];
        }
      }
    }
  }
};
</script>