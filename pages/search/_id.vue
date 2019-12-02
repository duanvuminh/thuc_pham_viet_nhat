<template>
  <v-row justify="center">
    <v-col cols="12" sm="9">
      <v-text-field
        solo
        label="Search"
        prepend-inner-icon="mdi-magnify"
        clearable
        @keypress="search"
        v-model="searchkey"
        hide-details
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-row class="d-flex flex-nowrap">
        <v-col class="flex-grow-0 flex-shrink-1">
          <h1 class="display-4">{{searchkey}}</h1>
        </v-col>
        <v-col class="flex-grow-1">
          <v-textarea
            label="Thêm cách nhớ của bạn"
            auto-grow
            v-model="comment"
            :readonly="readonly"
            :placeholder="placeholder"
            :loading="loading"
            hide-details
            dense
            @focus="show = true"
            @blur="show = false"
          />
        </v-col>
      </v-row>
      <v-row v-show="show">
        <v-spacer />
        <v-btn class="ma-2" color="success" @click="save">Lưu</v-btn>
        <v-btn class="ma-2" text>Huỷ</v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import firebase from "firebase";
export default {
  async asyncData({ params }) {
    let item = firebase
      .app()
      .firestore()
      .collection("kanji")
      .doc(params.id[0])
      .collection("oboe");
      let searchkey = params.id[0];
      return{searchkey}
  },
  computed: {
    readonly() {
      return !this.$store.state.loggedIn;
    },
    placeholder() {
      return this.$store.state.loggedIn ? "" : "Đăng nhập để chỉnh sửa";
    },
    avartar() {
      return this.user.email ? this.user.email[0] : "^.^";
    }
  },
  data() {
    return {
      searchkey: "",
      comment: "",
      loading: false,
      show: false,
      searchkeyBk:""
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
    },
    save() {
      firebase
        .app()
        .firestore()
        .collection("kanji")
        .doc(this.searchkey);
    }
  },
  mounted() {}
};
</script>