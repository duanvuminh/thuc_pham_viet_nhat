<template>
  <v-app light>
    <v-app-bar color="black accent-3" dark app>
      <v-btn icon to="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn text to="/auth/items" icon><v-icon>mdi-magnify</v-icon></v-btn>
      <v-btn text to="/auth/create">Tạo mới</v-btn>
      <v-spacer />
      <v-btn text to="/logout">Logout</v-btn>
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
