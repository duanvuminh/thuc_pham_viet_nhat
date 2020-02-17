<template>
  <v-row>
    <v-col cols="12" class="mb-0 pb-0">
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
                {{comment.comment}}
              </div>
              <footer></footer>
            </article>

            <div class="d-flex justify-start align-center">
              <v-btn text icon>
                <v-icon small>mdi-thumb-up</v-icon>
              </v-btn>
              <span>{{comment.liked}}</span>
              <v-btn text icon>
                <v-icon small>mdi-thumb-down</v-icon>
              </v-btn>
              <span>{{comment.dislike}}</span>
              <v-btn text @click="showAdd=!showAdd" small>Trả lời</v-btn>
              <v-btn
                text
                v-if="comment.commentSub&&comment.commentSub.length>0"
                small
                @click="showComment=!showComment"
                fab
              >
                <v-icon dark>{{showComment?"mdi-menu-up":" mdi-menu-down"}}</v-icon>
              </v-btn>
            </div>
            <add
              :size="30"
              :rows="1"
              v-if="showAdd"
              @setShowAdd="setShowAdd"
              @add="add"
              :isRoot="isRoot"
              :from="comment.userName"
            ></add>
          </div>
        </template>
      </div>
    </v-col>
    <slot v-if="showComment"></slot>
  </v-row>
</template>
<script>
import firebase from "firebase/app";
import "firebase/auth";
const avartar = () => import("./Avartar");
const add = () => import("./Add");

export default {
  components: {
    avartar,
    add
  },
  computed: {
    editMode() {
      if (this.action == "edit") {
        return true;
      }
    },
    timeText(){
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
      return (Math.floor(seconds)>0 ? Math.floor(seconds) : 1) + " giây trước";
   }
  },
  data() {
    return {
      action: null,
      email: this.$store.state.user.email,
      now: Date.now(),
      size: 40,
      showAdd: false,
      showComment: false,
      value: true,
      from: ""
    };
  },
  created(){
   setInterval(()=> {
         this.now = Date.now()
      }, 30000)
  },
  async mounted() {
    if (this.comment.for) {
      let { name, email, photoURL } = await this.$axios
        .get(`/api/user?id=${this.comment.for}`)
        .then(r => {
          return r.data;
        });
      this.from = name;
    }
    let { name, email, photoURL } = await this.$axios
      .get(`/api/user?id=${this.comment.userEmail}`)
      .then(r => {
        return r.data;
      });
    this.comment.userName = name;
    if (!this.comment.isRoot) {
      this.size = 30;
    }
  },
  methods: {
    add(comment) {
      comment.rootId = this.rootId;
      comment.for = this.comment.userEmail;
      this.$emit("add", comment);
      this.showComment = true;
    },
    formatDate(date) {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      let strTime = hours + ':' + minutes + ' ' + ampm;
      return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    },
    setShowAdd(val) {
      this.showAdd = val;
    },
    setShowEdit(val) {
      this.action = null;
    }
  },
  props: ["comment","isRoot","rootId"],
  watch: {
    action(val) {
      if (val == "delete") {
        this.$emit("deleteComment", this.comment);
      }
    }
  }
};
</script>
