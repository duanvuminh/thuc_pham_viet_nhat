<template>
  <div>
    <v-row class="d-flex flex-nowrap">
      <v-col class="flex-grow-0 flex-shrink-1">
        <v-avatar size="100" v-if="photoURL" class="ma-2">
          <img :src="url" :alt="name" />
        </v-avatar>
        <v-avatar size="100" v-else color="indigo">
          <span class="white--text headline">{{name[0]}}</span>
        </v-avatar>
      </v-col>
      <v-col class="flex-grow-1">
        <p>{{name}}</p>
        <p>{{email}}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-btn text color="orange" @click="getNew" class="ma-3">Tạo mới</v-btn>
    </v-row>
    <v-row class="d-flex flex-wrap align-center justify-space-around">
      <v-card v-for="(random,i) in randoms" :key="i" class="ma-3">
        <v-img
          class="orange--text align-end"
          height="200px"
          width="300px"
          :src="random.url"
          contain
        >
          <v-card-title>Nghĩa của kanji này là gì</v-card-title>
        </v-img>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>show</v-expansion-panel-header>
            <v-expansion-panel-content>
              <HtmlParser :content="$md.render(random.vi)"/>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-row>
  </div>
</template>
<script>
import firebase from "firebase/app";
import "firebase/auth";
import HtmlParser from "@/components/HtmlParser";

export default {
  async asyncData({ params, store, $axios }) {
    let randoms = await $axios.$get("/api/get_random_primatives").then();
    return { randoms };
  },
  components: {
    HtmlParser
  },
  computed: {
    url() {
      return this.photoURL + "";
    }
  },
  data() {
    return {
      name: "",
      email: "",
      photoURL: ""
    };
  },
  layout: "oboe",
  methods: {
    async getNew() {
      this.randoms = await this.$axios
        .$get("/api/get_random_primatives")
        .then();
    }
  },
  async mounted() {
    var user = await firebase.auth().currentUser;
    if (user != null) {
      this.name = user.displayName
        ? user.displayName
        : user.providerData[0].displayName;
      this.email = user.email ? user.email : user.providerData[0].email;
      if (!this.name) {
        this.name = this.email.split("@")[0];
      }
      this.photoURL = user.photoURL
        ? user.photoURL
        : user.providerData[0].photoURL;
      console.log(this.photoURL);
    }
  }
};
</script>