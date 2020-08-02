<template>
  <div>
    <v-navigation-drawer v-model="drawerSelf" app width="350">
      <v-row class="fill-height" no-gutters>
        <v-navigation-drawer dark mini-variant mini-variant-width="80" v-model="drawerSelf">
          <v-list-item-group v-model="item" color="white">
            <Topic v-for="item in tags" :key="item.id" :item="item" @setLevel1="setLevel1"></Topic>
            <v-list-item class="px-2" disabled>
              <v-list-item-avatar color="pink">
                <v-icon>mdi-plus</v-icon>
              </v-list-item-avatar>
            </v-list-item>
          </v-list-item-group>
        </v-navigation-drawer>
        <v-list class="grow">
          <nuxt-link to="/" class="nuxt-link-logo">
            <v-img :src="require('@/assets/logo2.png')" contain position="left" width="100"></v-img>
          </nuxt-link>
          <v-list-item-group v-model="item1" color="white">
            <v-subheader>
              Thêm Channels
              <v-spacer></v-spacer>
              <v-btn icon @click="addChanel">
                <v-icon color="grey darken-1" small>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </v-subheader>
            <Topic1
              v-for="(item,key) in topic1"
              :key="item.id"
              :item0="key"
              :item="item"
              :level1="level1"
              @selecTopic1="selecTopic1"
              @selecTopic="selecTopic"
              @selecItem1="val=>{item1=val}"
            ></Topic1>
          </v-list-item-group>
        </v-list>
      </v-row>
    </v-navigation-drawer>
    <v-dialog v-model="dialogTag1" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="teal lighten-3" dark dense>
          <v-btn icon dark @click="$emit('setDialogTag', false); dialogTag1=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Chọn chủ đề</v-toolbar-title>
        </v-toolbar>
        <!-- <v-col cols="12">
        <v-text-field label="Tìm kiếm" outlined dense hide-details></v-text-field>
        </v-col>-->
        <div class="text-left">
          <v-chip
            v-for="item in tags"
            :key="item.id"
            class="ma-2"
            :color="item.name=='home'||item.name=='mypage'?'red':''"
            outlined
            @click="selectTopic(item.name)"
          >{{rename(item.name)}}</v-chip>
        </div>
      </v-card>
    </v-dialog>
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
  </div>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
import Topic from "./Topic";
import Topic1 from "./Topic1";

export default {
  async mounted() {},
  computed: {},
  components: {
    Topic,
    Topic1,
  },
  data() {
    return {
      dialog: false,
      dialogTag1: false,
      //form
      full_name: "",
      valid: false,
      //end form
      tags: [],
      topic1: [],
      drawerSelf: this.drawer,
      level1: null,
      item: null,
      item1: null,
    };
  },
  methods: {
    addChanel() {
      this.dialog = true;
    },
    setLevel1(val) {
      this.level1 = val;
    },
    selectTopic(topic) {
      this.$emit("setDialogTag", false);
      this.dialogTag1 = false;
      this.$emit("setTagName", topic);
    },
    selecTopic1(level1, topic, topic1) {
      this.$emit("selecTopic1", level1, topic, topic1);
    },
    selecTopic(level1, topic) {
      this.$emit("selecTopic", level1, topic);
    },
    rename(name) {
      if (name == "home") {
        return "Chủ đề chung";
      }
      if (name == "mypage") {
        return "Nơi bạn ghi lại cho riêng bạn";
      }
      return name;
    },
    validate() {
      this.$refs.form.validate();
      if (this.valid) {
        if (this.level1 == "4PisKFBkxDzV7voklXYA") {
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
        this.item = 1;
      });
  },
  props: ["dialogTag", "full", "drawer"],
  watch: {
    dialogTag(val) {
      this.dialogTag1 = val;
    },
    drawerSelf(val) {
      this.$emit("setDrawer", val);
    },
    level1(val) {
      this.topic1 = [];
      if (this.level1 == "4PisKFBkxDzV7voklXYA") {
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
  },
};
</script>