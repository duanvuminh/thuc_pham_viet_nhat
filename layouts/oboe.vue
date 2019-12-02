<template>
  <v-app light>
    <v-app-bar flat app color="transparent">
      <v-container>
        <v-layout>
          <v-spacer />
          <v-btn v-if="loggedIn" text to="/logout" class="align-self-center">Logout</v-btn>
          <v-btn v-else text to="/login" class="align-self-center">Login</v-btn>
        </v-layout>
      </v-container>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template> 

<script>
export default {
  data() {
    return {};
  },
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    }
  }
};
</script>
