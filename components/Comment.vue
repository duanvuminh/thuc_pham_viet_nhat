<template>
  <v-row>
    <v-col cols="12" class="pt-0 pb-0">
      <div class="d-flex flex-no-wrap">
        <v-avatar :color="color" class="ma-1" size="48">
          <span class="white--text headline">{{avartar}}</span>
        </v-avatar>
        <div class="flex-grow-1">
          <div>
            <span>
              <b>{{item.email}}</b>
            </span>
            <small>{{iso8601Time(item.date_edit)}}</small>
          </div>
          <v-textarea
            :value="item.text"
            auto-grow
            hide-details
            dense
            flat
            solo
            readonly
            no-resize
            rows="2"
            v-on:mouseleave.native="show = false"
            v-on:mouseover.native="show = true"
          >
            <template slot="append-outer">
              <v-menu left bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" v-if="show">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                  <v-btn icon v-on="on" v-else disabled></v-btn>
                </template>

                <v-list v-if="control.length>0">
                  <v-list-item v-for="(option,i) in control" :key="i" @click="() => {}">
                    <v-list-item-title>Option {{ n }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-textarea>
        </div>
      </div>
    </v-col>
    <v-col cols="11" offset="1" class="pt-0">
      <v-row class="d-flex flex-no-wrap pt-0">
        <v-btn text icon>
          <v-icon>mdi-thumb-up</v-icon>
        </v-btn>
        <v-btn text icon @click="notify">
          <v-icon>mdi-message</v-icon>
        </v-btn>
        <v-col class="flex-grow-1" v-if="showComment">
          <v-textarea
            hide-details
            dense
            label="Comment"
            auto-grow
            :rows="rows"
            @keypress="addComment"
            v-model="comment"
            :readonly="readonly"
            :placeholder="placeholder"
          >
            <template slot="append-outer">
              <v-btn text @click="showComment=false">Huỷ</v-btn>
            </template>
          </v-textarea>
        </v-col>
      </v-row>
    </v-col>
    <slot></slot>
  </v-row>
</template>
<script>
export default {
  props: ["item", "parentCommentId", "forCommentId","showname"],
  data() {
    return {
      show: false,
      showComment: false,
      rows: 1,
      comment: ""
    };
  },
  computed: {
    control() {
      return [];
    },
    avartar() {
      return this.item.email ? this.item.email[0] : "^.^";
    },
    color() {
      return this.$store.state.user.email == this.item.email ? "teal" : "red";
    },
    readonly() {
      return !this.$store.state.loggedIn;
    },
    placeholder() {
      return this.$store.state.loggedIn ? "" : "Login to comment";
    }
  },
  methods: {
    notify(){
      this.showComment=true;
      console.log(this.parentCommentId)
      if(this.showname){
        this.comment = `@${this.item.email.split('@')[0]}`
      }
    },
    iso8601Time(timestamp) {
      // console.log(timestamp);
      // console.log(timestamp);
      try {
        return new Date(timestamp.seconds * 1e3).toISOString().slice(0, -5);
      } catch (e) {
        return new Date(timestamp).toISOString().slice(0, -5);
      }
    },
    addComment(e) {
      if (!this.$store.state.loggedIn) {
        return;
      }
      if (
        e.key == "Enter" &&
        this.comment.replace(/(\r\n|\n|\r)/gm, "").trim()
      ) {
        // this.comments.unshift({
        //   text: this.comment,
        //   date_create: new Date(),
        //   date_edit: new Date(),
        //   ...this.user
        // });
        this.$emit("updateMe", {
          text: this.comment,
          date_create: new Date(),
          date_edit: new Date(),
          forCommentId: this.forCommentId,
          parentCommentId: this.parentCommentId,
          ...this.$store.state.user
        });
        setTimeout(() => {
          this.comment = "";
          this.rows = 1;
        }, 100);
        return;
        firebase
          .firestore()
          .collection("Comments")
          .doc(this.card)
          .collection("comments")
          .add({
            text: this.comment,
            date_create: new Date(),
            date_edit: new Date(),
            ...user
          })
          .then(r => {
            console.log("Document successfully written!");
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
      }
    }
  },
  mounted() {}
};
</script>