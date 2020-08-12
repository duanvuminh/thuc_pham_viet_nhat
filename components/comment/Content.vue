<template>
  <v-row>
    <v-col cols="12" class="mb-2 pb-0 pt-0">
      <v-hover v-slot:default="{ hover }">
        <v-card class="mx-auto">
          <v-card-text>
            <div class="d-flex justify-start">
              <template>
                <avartar :size="size" :email="content.creator"></avartar>
                <div class="ml-1 flex-grow-1">
                  <article style="overflow: hidden;">
                    <header>
                      <b>{{content.userName}}</b>
                      <small>{{timeText}}</small>
                    </header>
                    <HtmlParser :content="$md.render(content.content)"></HtmlParser>
                  </article>
                  <Tooltip
                    :show="show"
                    :id="content.id"
                    @open-dialog="dialog=true"
                    @delete-article="deleteArticle"
                    ref="tooltip"
                    :editable="show"
                  ></Tooltip>
                </div>
              </template>
            </div>
          </v-card-text>
        </v-card>
      </v-hover>
    </v-col>
    <v-col cols="12" class="mb-0 py-0 pr-3">
      <v-dialog v-model="dialog" fullscreen>
        <v-card>
          <v-container>
            <v-textarea auto-grow v-model="commentText" hide-details dense></v-textarea>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="dialog = false">Close</v-btn>
              <v-btn color="primary" text @click="save" :disabled="checkLength">Thêm</v-btn>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>
<script>
import firebase from "firebase/app";
import "firebase/auth";
//const avartar = () => import("./Avartar");
import avartar from "./Avartar";
//const Tooltip = () => import("./Tooltip");
import Tooltip from "./Tooltip";
//const HtmlParser = () => import("@/components/HtmlParser");
import HtmlParser from "@/components/HtmlParser";

export default {
  components: {
    avartar,
    HtmlParser,
    Tooltip,
  },
  computed: {
    checkLength() {
      if (!this.commentText) {
        return true;
      } else {
        return !(this.commentText.length > 10);
      }
    },
    timeText() {
      var seconds = Math.floor((this.now - this.content.time) / 1000);

      var interval = Math.floor(seconds / 31536000);

      if (interval > 1) {
        return this.formatDate(this.content.time);
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
        return this.formatDate(this.content.time);
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
        return this.formatDate(this.content.time);
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
        return interval + " giờ trước";
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
        return interval + " phút trước";
      }
      return (
        (Math.floor(seconds) > 0 ? Math.floor(seconds) : 1) + " giây trước"
      );
    },
    show() {
      if (this.content.creator != this.$store.state.user.email) {
        return false;
      } else {
        return true;
      }
    },
  },
  data() {
    return {
      dislike: "",
      email: this.$store.state.user.email,
      liked: "",
      now: Date.now(),
      size: 40,
      showAdd: false,
      value: true,
      from: "",
      dialog: false,
      commentText: "",
    };
  },
  created() {
    setInterval(() => {
      this.now = Date.now();
    }, 30000);
  },
  async mounted() {
    let { name, email, photoURL } = await this.$axios
      .get(`/api/user?id=${this.content.creator}`)
      .then((r) => {
        return r.data;
      });
    this.content.userName = name;
  },
  methods: {
    formatDate(date) {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      let strTime = hours + ":" + minutes + " " + ampm;
      return (
        date.getMonth() +
        1 +
        "/" +
        date.getDate() +
        "/" +
        date.getFullYear() +
        "  " +
        strTime
      );
    },
    deleteArticle() {
      firebase
        .firestore()
        .collection("forum")
        .doc(this.content.id)
        .delete()
        .then((result) => {
          // has parent?
          this.$emit("deleteArticle", this.content.id);
        });
    },
    save() {
      firebase.firestore().collection("forum").doc(this.content.id).update({
        content: this.commentText,
      });
      this.content.content = this.commentText;
      this.dialog = false;
      // has parent?
      this.$emit("edit", this.commentText, this.content.id);
    },
  },
  props: ["content"],
  watch: {
    dialog(val) {
      this.commentText = this.content.content;
    },
  },
};
</script>
