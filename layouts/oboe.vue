<template>
  <v-app light>
    <v-app-bar flat app dense>
      <v-container>
        <v-row>
          <v-btn text to="/" class="align-self-center">Home</v-btn>
          <v-btn text class="align-self-center" @click="openBo">Bộ con</v-btn>
          <v-spacer />
          <v-btn text to="/howto" class="align-self-center">How</v-btn>
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
              <v-card>
                <div class="display-3 nihongo">{{item.id}}</div>
                <v-card-actions>
                  <v-spacer />
                  <v-menu left bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>

                    <!-- <v-list>
                      <v-list-item>
                        <v-list-item-content>{{item.content}}</v-list-item-content>
                      </v-list-item>
                    </v-list>-->
                    <v-card>
                      <v-card-text>{{item.content}}</v-card-text>
                    </v-card>
                  </v-menu>
                </v-card-actions>
              </v-card>
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
      items: []
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    }
  },
  methods: {
    openBo() {
      this.items = [];
      this.dialog = true;
      firebase
        .app()
        .firestore()
        .collection("kanjicore")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            // doc.data() is never undefined for query doc snapshots
            this.items.push({ id: doc.id, ...doc.data() });
          });
        });
    }
  }
};
</script>
<style>
.display-4.nihongo {
  font-family: Hiragino Mincho Pro, ヒラギノ明朝 Pro W3, ＭＳ 明朝, ＭＳ Ｐ明朝,
    serif !important;
}
</style>
