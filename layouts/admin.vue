<template>
  <v-app light>
    <v-app-bar color="black accent-3" dark app>
      <v-btn icon href="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn text href="/auth">View</v-btn>
      <v-btn text href="/auth/create">Tạo mới</v-btn>
      <v-spacer />
      <v-btn text href="/logout">Logout</v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template> 

<script>
import firebase from "firebase";
export default {
  data() {
    return {
    };
  },
  mounted() {}
};
</script>
