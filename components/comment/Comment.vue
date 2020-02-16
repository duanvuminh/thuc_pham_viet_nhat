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
                <small>{{comment.time}}</small>
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
      return false;
    }
  },
  data() {
    return {
      action: null,
      email: this.$store.state.user.email,
      size: 40,
      showAdd: false,
      showComment: false,
      value: true,
      from: ""
    };
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
      this.$emit("add", comment);
    },
    setShowAdd(val) {
      this.showAdd = val;
    },
    setShowEdit(val) {
      this.action = null;
    }
  },
  props: ["comment","isRoot"],
  watch: {
    action(val) {
      if (val == "delete") {
        this.$emit("deleteComment", this.comment);
      }
    }
  }
};
</script>