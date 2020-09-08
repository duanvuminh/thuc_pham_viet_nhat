<template>
  <div>
    <v-navigation-drawer v-model="drawer" app width="310">
      <v-row class="fill-height" no-gutters>
        <v-navigation-drawer dark mini-variant mini-variant-width="50" v-model="drawer">
          <v-list-item-group v-model="item" color="white" active-class="duan">
            <Topic v-for="item in tags" :key="item.id" :item="item" @set-level1="setLevel1"></Topic>
          </v-list-item-group>
        </v-navigation-drawer>
        <v-list class="grow">
          <nuxt-link to="/" class="nuxt-link-logo">
            <v-img :src="require('@/assets/logo2.png')" contain position="left" width="100"></v-img>
          </nuxt-link>
          <v-list-item-group v-model="item1" color="white">
            <v-subheader class="d-none d-md-flex">
              Thêm Channels
              <v-spacer></v-spacer>
              <v-btn icon @click="addChanel">
                <v-icon color="grey darken-1" small>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </v-subheader>
            <template v-if="mypave_save">
              <v-list-item @click="openTopic('save')" dense>
                <v-list-item-title>💾 Đã lưu</v-list-item-title>
              </v-list-item>
            </template>
            <Topic1 v-for="item in topic1" :key="item.id" :item="item" :level1="level1"></Topic1>
          </v-list-item-group>
        </v-list>
      </v-row>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-form ref="form" v-model="valid" lazy-validation onsubmit="return false;">
          <v-card>
            <v-card-title>
              <span class="headline">Thêm chủ đề</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="full_name"
                      label="Tên chủ đề"
                      :rules="[v => !!v || 'Tên không được trống']"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <small>*Thêm topic để thảo luận</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
              <v-btn color="blue darken-1" text @click="validate">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-navigation-drawer>
    <v-btn v-if="!drawer" color="pink" dark fixed bottom left fab @click="drawer=true">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </div>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
import { mapState } from "vuex";
import Topic from "./Topic";
import Topic1 from "./Topic1";

export default {
  async mounted() {},
  computed: {
    ...mapState(["mypage"]),
    mypave_save() {
      return this.level1 == this.mypage ? true : false;
    },
  },
  components: {
    Topic,
    Topic1,
  },
  data() {
    return {
      dialog: false,
      //form
      full_name: "",
      valid: false,
      //end form
      tags: [],
      topic1: [],
      drawer: true,
      level1: null,
      item: 0,
      item1: null,
    };
  },
  methods: {
    addChanel() {
      this.dialog = true;
    },
    openTopic(item) {
      if (item == this.topic) return;
      this.$store.commit("setTopic", item);
      this.$store.commit("setContent", []);
      this.$store.commit("setDate", null);
      this.$router.push("/forum");
    },
    setLevel1(val) {
      this.level1 = val;
    },
    validate() {
      this.$refs.form.validate();
      if (this.valid) {
        if (this.level1 == this.mypage) {
          firebase
            .firestore()
            .collection("topic")
            .doc(this.level1)
            .collection("users")
            .doc(this.$store.state.user.email)
            .collection("subtopic")
            .add({
              isShow: true,
              full_name: this.full_name,
            })
            .then((doc) => {
              let topic = {
                id: doc.id,
                full_name: this.full_name,
                isShow: true,
              };
              this.topic1.unshift(topic);
              this.dialog = false;
            });
        } else {
          firebase
            .firestore()
            .collection("topic")
            .doc(this.level1)
            .collection("subtopic")
            .add({
              isShow: true,
              full_name: this.full_name,
            })
            .then((doc) => {
              let topic = {
                id: doc.id,
                full_name: this.full_name,
                isShow: true,
              };
              this.topic1.unshift(topic);
              this.dialog = false;
            });
        }
      }
    },
  },
  mounted() {
    if (this.$route.name == "articles-id") {
      this.$nextTick(() => {
        this.drawer = false;
      });
    }
    firebase
      .firestore()
      .collection("topic")
      .orderBy("order")
      .get()
      .then((documentSnapshots) => {
        // Get the last visible document
        // last = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        // Construct a new query starting at this document,
        // get the next 25 cities.
        documentSnapshots.forEach((doc) => {
          if (doc.data().isShow) {
            let tag = { id: doc.id, ...doc.data() };
            this.tags.push(tag);
          }
        });
        this.level1 = this.tags[0].id;
      });
  },
  props: [],
  watch: {
    level1(val) {
      this.topic1 = [];
      this.item1 = null;
      if (this.level1 == this.mypage) {
        firebase
          .firestore()
          .collection("topic")
          .doc(val)
          .collection("users")
          .doc(this.$store.state.user.email)
          .collection("subtopic")
          .get()
          .then((documentSnapshots) => {
            documentSnapshots.forEach((doc) => {
              if (doc.data().isShow) {
                let topic = { id: doc.id, ...doc.data() };
                this.topic1.push(topic);
              }
            });
          });
      } else {
        firebase
          .firestore()
          .collection("topic")
          .doc(val)
          .collection("subtopic")
          .get()
          .then((documentSnapshots) => {
            documentSnapshots.forEach((doc) => {
              if (doc.data().isShow) {
                let topic = { id: doc.id, ...doc.data() };
                this.topic1.push(topic);
              }
            });
          });
      }
    },
    $route(to, from) {
      if (to.name == "articles-id") {
        this.drawer = false;
      } else {
        if (
          this.$vuetify.breakpoint.name != "xs" &&
          this.$vuetify.breakpoint.name != "sm"
        ) {
          this.drawer = true;
        }
      }
    },
  },
};
</script>