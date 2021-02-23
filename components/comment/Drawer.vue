<template>
  <div>
    <v-navigation-drawer v-model="drawer" app :width="width">
      <v-row class="fill-height" no-gutters>
        <v-navigation-drawer dark mini-variant mini-variant-width="30" v-model="drawer">
          <v-list-item-group v-model="item" color="transparent">
            <v-list-item class="px-2" to="/forum">
              <v-icon to>mdi-chevron-left</v-icon>
            </v-list-item>
            <v-list-item class="px-2" to="/">
              <v-icon to>mdi-home</v-icon>
            </v-list-item>
          </v-list-item-group>
        </v-navigation-drawer>
        <v-list class="grow">
          <v-list-item v-if="logo">
            <v-card class="mx-auto ma-1" elevation="0" max-width="200" :to="`/forum/${$route.params.tag}`">
              <v-img :src="logo" contain></v-img>
            </v-card>
          </v-list-item>
          <v-list-item-group v-model="item1" color="white">
            <v-subheader v-show="show">
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
            <Topic1
              v-for="item in topic1"
              :key="item.id"
              :item="item"
              :level1="level1"
              :url="`/forum/${$route.params.tag}`"
              :showAction="show"
            ></Topic1>
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
                    <v-text-field v-model="order" label="Thứ tự"></v-text-field>
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
import { mapState } from "vuex";
import Topic1 from "./Topic1";

export default {
  mounted() {},
  computed: {
    ...mapState(["mypage", "tags"]),
    mypave_save() {
      return this.level1 == this.mypage ? true : false;
    },
    width() {
      if (this.$vuetify.breakpoint.name == "xs") {
        return "90%";
      } else {
        return 310;
      }
    },
  },
  components: {
    Topic1,
  },
  created() {
    this.level1 = this.$route.params.tag;
    this.$fire
      .firestore
      .collection("topic")
      .doc(this.level1)
      .get()
      .then((doc) => {
        if (doc.data().creator == this.$store.state.user.email) {
          this.show = true;
        }
        this.logo = doc.data().src;
      });
    if (this.level1 == this.mypage) {
      this.$fire
        .firestore
        .collection("topic")
        .doc(this.level1)
        .collection("users")
        .doc(this.$store.state.user.email)
        .collection("subtopic")
        .orderBy("order")
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
      this.$fire
        .firestore
        .collection("topic")
        .doc(this.level1)
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
  data() {
    return {
      description: null,
      dialog: false,
      //form
      full_name: "",
      order: null,
      valid: false,
      //end form
      topic1: [],
      drawer: true,
      level1: null,
      item: null,
      item1: null,
      //logo
      logo: null,
      show: false,
    };
  },
  methods: {
    addChanel() {
      this.dialog = true;
    },
    openTopic() {
      this.$router.push(`/forum/${this.mypage}/save`);
    },
    setLevel1(val) {
      this.level1 = val.level1;
      this.description = val.description;
    },
    validate() {
      this.$refs.form.validate();
      if (this.valid) {
        if (this.level1 == this.mypage) {
          this.$fire
            .firestore
            .collection("topic")
            .doc(this.level1)
            .collection("users")
            .doc(this.$store.state.user.email)
            .collection("subtopic")
            .add({
              isShow: true,
              full_name: this.full_name,
              order: this.order,
            })
            .then((doc) => {
              let topic = {
                id: doc.id,
                full_name: this.full_name,
                isShow: true,
                order: this.order,
              };
              this.topic1.unshift(topic);
              this.dialog = false;
            });
        } else {
          this.$fire
            .firestore
            .collection("topic")
            .doc(this.level1)
            .collection("subtopic")
            .add({
              isShow: true,
              full_name: this.full_name,
              order: this.order,
            })
            .then((doc) => {
              let topic = {
                id: doc.id,
                full_name: this.full_name,
                order: this.order,
                isShow: true,
              };
              this.topic1.unshift(topic);
              this.dialog = false;
            });
        }
      }
    },
  },
  mounted() {},
  props: [],
  watch: {
    $route(to, from) {
      this.$store.commit("setContent", []);
    },
  },
};
</script>