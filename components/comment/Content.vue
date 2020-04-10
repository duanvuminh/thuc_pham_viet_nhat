<template>
  <v-row>
    <v-col cols="12" class="mb-0 pb-0 pt-0">
      <div class="d-flex justify-start">
        <template>
          <avartar :size="size" :email="content.creator"></avartar>
          <div class="ml-1 flex-grow-1">
            <article style="overflow: hidden;">
              <header>
                <b>{{content.userName}}</b>
                <small>
                  {{timeText}}
                  <nuxt-link :to="`/articles/${content.id}`" v-if="!$route.params.id">Chi tiết</nuxt-link>
                </small>
                <v-btn small fab text @click="dialog=true" v-if="show">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </header>
              <HtmlParser :content="$md.render(content.content)"></HtmlParser>
            </article>
          </div>
        </template>
      </div>
    </v-col>
    <client-only>
      <v-col cols="12" class="mb-0 py-0 pr-3">
        <v-dialog v-model="dialog" fullscreen>
          <v-card>
            <vue-simplemde v-model="commentText" />

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="save">Save</v-btn>
              <v-btn text @click="dialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </client-only>
  </v-row>
</template>
<script>
import firebase from "firebase/app";
import "firebase/auth";
const avartar = () => import("./Avartar");
const HtmlParser=()=>import("@/components/HtmlParser")

export default {
  components: {
    avartar,
    HtmlParser
  },
  computed: {
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
      if (!this.$route.params.id) {
        return false;
      } else if (this.content.creator != this.$store.state.user.email) {
        return false;
      } else {
        return true;
      }
    }
  },
  data() {
    return {
      commentText: "",
      dislike: "",
      dialog: false,
      email: this.$store.state.user.email,
      liked: "",
      now: Date.now(),
      size: 40,
      showAdd: false,
      value: true,
      from: "",
      dialog: false
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
      .then(r => {
        return r.data;
      });
    this.content.userName = name;
    this.commentText = this.content.content;
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
    save() {
      this.$emit("edit", this.commentText, this.content.id);
      this.commentText = "";
      this.dialog = false;
    }
  },
  props: ["content"],
  watch: {}
};
</script>
