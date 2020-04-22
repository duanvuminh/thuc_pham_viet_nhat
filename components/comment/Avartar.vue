<template>
  <div>
    <v-avatar :size="size" v-if="photoURL" class="ma-2">
      <img :src="photoURL" :alt="name" />
    </v-avatar>
    <v-avatar :size="size" v-else-if="name" color="indigo" class="ma-2">
      <span class="white--text headline">{{name?name.split("")[0]:"^_^"}}</span>
    </v-avatar>
  </div>
</template>
<script>
import firebase from "firebase/app";
import "firebase/auth";
export default {
  async mounted() {
    let {name,email,photoURL} = await this.$axios.get(`/api/user?id=${this.email}`,{ useCache: true }).then(r=>{ return r.data})
    this.name = name
    this.photoURL = photoURL
  },
  data() {
    return {
      name: "",
      photoURL: ""
    };
  },
  props: ["size","email"]
};
</script>
