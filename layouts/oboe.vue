<template>
  <v-app light>
    <v-app-bar flat app color="transparent" dense>
      <v-container>
        <v-row>
          <v-btn text to="/oboe" class="align-self-center">Home</v-btn>
          <v-btn text class="align-self-center" @click="openBo">Bộ</v-btn>
          <v-spacer />
          <v-btn v-if="loggedIn" text to="/logout" class="align-self-center">Logout</v-btn>
          <v-btn v-else text to="/login" class="align-self-center">Login</v-btn>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-dialog v-model="dialog" scrollable max-width="300px">
      <v-card>
        <v-card-text>
          <v-row class="d-flex justify-space-around">
            <v-col v-for="(item,i) in items" class="flex-grow-0 flex-shrink-1" :key="i">
              <h1 class="display-4 nihongo">{{item.id}}</h1>
              <v-card-subtitle>{{item.content}}</v-card-subtitle>
            </v-col>
            
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template> 

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      dialog: false,
      items:[]
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    }
  },
  methods: {
    openBo() {
      this.items=[]
      this.dialog = true;
      firebase
        .app()
        .firestore()
        .collection("kanjicore")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc=> {
            // doc.data() is never undefined for query doc snapshots
            this.items.push({id:doc.id,...doc.data()})
          });
        });
    }
  }
};
</script>
