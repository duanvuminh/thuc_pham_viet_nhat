<template>
  <v-row class="d-flex flex-nowrap">
    <v-col class="flex-grow-0 flex-shrink-1">
      <v-avatar size="100" v-if="!url">
        <img :src="url" :alt="name" />
      </v-avatar>
       <v-avatar size="100" v-else color="indigo">
        <span class="white--text headline">{{name[0]}}</span>
      </v-avatar>
    </v-col>
    <v-col class="flex-grow-1"></v-col>
  </v-row>
</template>
<script>
import firebase from "firebase";
export default {
  computed: {
    url() {
      return this.photoURL+"";
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