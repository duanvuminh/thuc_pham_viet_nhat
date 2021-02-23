<template>
  <v-row>
    <v-col cols="12" class="mb-0 pb-0 pt-0" v-show="show">
      <div class="d-flex justify-start">
        <template>
          <avartar :size="size" :email="comment.userEmail"></avartar>
          <div class="ml-1 flex-grow-1">
            <article>
              <header>
                <b>{{comment.userName}}</b>
                <small>{{timeText}}</small>
              </header>
              <div>
                <v-chip small color="red" text-color="white" v-if="comment.for">{{from}}</v-chip>
                <HtmlParser :content="$md.render(comment.comment)"></HtmlParser>
              </div>
              <footer></footer>
            </article>

            <div class="d-flex justify-start align-center">
              <Like icon="mdi-thumb-up" :path="path" name="liked"></Like>
              <v-btn text @click="showAdd=!showAdd" x-small fab>
                <v-icon dark x-small>mdi-message-reply-text</v-icon>
              </v-btn>
              <v-btn
                text
                v-if="comment.commentSub&&comment.commentSub.length>0"
                small
                @click="showComment=!showComment"
                color="primary"
              >
                <v-icon dark>{{showComment?"mdi-menu-up":" mdi-menu-down"}}</v-icon>
                <small>{{showComment?"Ẩn trả lời":"Hiện trả lời"}}</small>
              </v-btn>
              <v-spacer></v-spacer>
              <ActionPure
                v-if="showAction"
                :_add="false"
                :_edit="true"
                :_delete="true"
                @edit="dialog=true"
                @delete="deleteComment"
              ></ActionPure>
            </div>
            <add
              :size="30"
              :rows="1"
              v-if="showAdd"
              @set-show-add="setShowAdd"
              @add="add"
              :isRoot="isRoot"
              :from="replyFrom"
            ></add>
          </div>
        </template>
      </div>
    </v-col>
    <slot v-if="showComment"></slot>
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
  </v-row>
</template>
<script>
//const avartar = () => import("./Avartar");
import avartar from "./Avartar";
//const add = () => import("./Add");
import add from "./Add";
import Like from "@/components/comment/Like";
import ActionPure from "./ActionPure";
import HtmlParser from "@/components/HtmlParser";

export default {
  components: {
    avartar,
    add,
    Like,
    ActionPure,
    HtmlParser,
  },
  computed: {
    checkLength() {
      if (!this.commentText) {
        return true;
      } else {
        return !(this.commentText.trim().length > 0);
      }
    },
    timeText() {
      var seconds = Math.floor((this.now - this.comment.time) / 1000);

      var interval = Math.floor(seconds / 31536000);

      if (interval > 1) {
        return this.formatDate(this.comment.time);
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
        return this.formatDate(this.comment.time);
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
        return this.formatDate(this.comment.time);
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
    replyFrom() {
      // console.log(this.rootEmail);
      // console.log(this.$store.state.user.email);
      return this.rootEmail != this.$store.state.user.email
        ? this.comment.userName
        : "chính mình";
    },
  },
  data() {
    return {
      commentText: null,
      dialog: false,
      email: this.$store.state.user.email,
      now: Date.now(),
      size: 30,
      showAdd: false,
      showComment: false,
      value: true,
      from: "",
      show: true,
      showAction: false,
    };
  },
  created() {
    setInterval(() => {
      this.now = Date.now();
    }, 30000);
  },
  async mounted() {
    if (this.comment.userEmail == this.$store.state.user.email) {
      this.showAction = true;
    }
    if (this.comment.for) {
      let { name, email, photoURL } = await this.$axios
        .get(`/api/user?id=${this.comment.for}`)
        .then((r) => {
          return r.data;
        });
      this.from = name;
    }
    let { name, email, photoURL } = await this.$axios
      .get(`/api/user?id=${this.comment.userEmail}`)
      .then((r) => {
        return r.data;
      });
    this.comment.userName = name;
    if (this.comment.isRoot) {
      this.size = 40;
    }
  },
  methods: {
    add(comment) {
      comment.rootId = this.rootId;
      comment.for = this.comment.userEmail;
      this.$emit("add", comment);
      this.showComment = true;
    },
    deleteComment() {
      this.$fire
        .firestore
        .doc(this.path)
        .delete()
        .then((result) => {
          // has parent?
          // this.$emit("deleteComment", this.comment.id);
          this.show = false;
        });
    },
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
      this.$fire.firestore.doc(this.path).update({
        comment: this.commentText,
      });
      this.comment.comment = this.commentText;
      this.dialog = false;
      // has parent?
      // this.$emit("edit", this.commentText, this.content.id);
    },
    setShowAdd(val) {
      this.showAdd = val;
    },
    setShowEdit(val) {
      this.action = null;
    },
  },
  props: ["comment", "isRoot", "rootId", "rootEmail", "path"],
  watch: {
    dialog(val) {
      this.commentText = this.comment.comment;
    },
  },
};
</script>
