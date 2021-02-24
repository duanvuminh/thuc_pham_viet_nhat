<template>
  <div class="ma-2 pa-2">
    <v-row class="justify-center">
      <v-col cols="auto" v-for="(item, i) in tags" :key="i">
        <v-card :color="item.color" dark>
          <div class="d-flex flex-no-wrap justify-space-between">
            <v-card
              :color="item.color"
              dark
              :to="`/forum/${item.id}`"
              elevation="0"
              class="d-flex flex-no-wrap justify-space-between"
            >
                  <v-list-item three-line selectable style="width:160px">
                    <v-list-item-content class="align-start" @v-on:click.prevent>
                      <v-list-item-title v-text="item.full_name" class="headline"></v-list-item-title>
                      <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                <template v-if="item.name=='mypage'">
                  <avartar size="50" :email="$store.state.user.email" class="ma-3 mr-1"></avartar>
                </template>
                <template v-else>
                  <v-avatar v-if="item.src" class="ma-3 mr-1" size="100" tile>
                    <v-img :src="item.src" contain></v-img>
                  </v-avatar>
                </template>
            </v-card>
            <v-spacer></v-spacer>
            <ActionPure
              v-if="editable(item)"
              :_add="false"
              :_edit="true"
              :_delete="true"
              @edit="edit(item,i)"
            ></ActionPure>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" fullscreen>
      <v-card>
        <v-container>
          <v-text-field auto-grow v-model="item.full_name" dense label="Tên chủ đề"></v-text-field>
          <v-textarea auto-grow v-model="item.description" dense label="Miêu tả" outlined></v-textarea>
          <v-color-picker v-model="item.color" hide-inputs width="150"></v-color-picker>
          <v-avatar v-if="url" class="ma-3" size="125" tile>
            <v-img :src="url" contain></v-img>
          </v-avatar>
          <v-text-field auto-grow dense v-model="item.src" label="link ảnh" outlined></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialog = false">Close</v-btn>
            <v-btn color="primary" text @click="save">Thêm</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import ActionPure from "@/components/comment/ActionPure";
import avartar from "@/components/comment/Avartar";
const isImageUrl = require("is-image-url");

export default {
  async asyncData({ params, store, $axios,$fire }) {
    await $fire.firestoreReady()
    let tags = [];
    await $fire
      .firestore
      .collection("topic")
      .orderBy("order")
      .get()
      .then((documentSnapshots) => {
        documentSnapshots.forEach((doc) => {
          if (doc.data().isShow) {
            let tag = { id: doc.id, ...doc.data() };
            if (store.state.user.email) {
              tags.push(tag);
            } else {
              if (doc.data().name != "mypage") {
                tags.push(tag);
              }
            }
          }
        });
      });
    return { tags };
  },
  components: {
    ActionPure,
    avartar,
  },
  computed: {
    url() {
      if (this.item.src) {
        let split = this.item.src.split("/");
        let imgname = split[split.length - 1];
        if (imgname.indexOf(".") == -1) {
          this.item.src += ".png";
        }
        if (!isImageUrl(this.item.src)) {
          this.item.src = null;
        }
      }
      return this.item.src;
    },
  },
  data: () => ({
    dialog: false,
    item: {},
  }),
  layout: "simple",
  mounted() {},
  methods: {
    editable(item) {
      if (item.creator != this.$store.state.user.email) {
        return false;
      } else {
        return true;
      }
    },
    edit(topic, index) {
      this.dialog = true;
      this.item = { ...topic, index: index };
      if (!this.item.color) {
        this.item.color = "#1F7087";
      }
    },
    save() {
      this.tags[this.item.index] = this.item;
      this.$fire
        .firestore
        .collection("topic")
        .doc(this.item.id)
        .set(
          {
            full_name: this.item.full_name ? this.item.full_name : null,
            description: this.item.description ? this.item.description : null,
            color: this.item.color,
            src: this.item.src ? this.item.src : null,
            creator: this.$store.state.user.email,
          },
          { merge: true }
        );
      this.dialog = false;
    },
  },
};
</script>