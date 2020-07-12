<template>
  <v-row>
    <v-col cols="12" class="mb-1 py-0 pr-3">
      <v-textarea
        :placeholder="`${email?'Bạn hãy viết gì đó':'Đăng nhập'}`"
        :rows="rows"
        auto-grow
        v-model="commentText"
        :hide-details="!from"
        @click="showAction=true"
        :hint="`Trả lời ${from}`"
        persistent-hint
        :readonly= "!email"
      >
        <div slot="prepend">
          <avartar :size="size" :email="email"></avartar>
        </div>
      </v-textarea>
    </v-col>
    <v-col cols="12" class="d-flex ma-0 pa-0 pr-3" v-if="never_hide">
      <template v-if="showAction && email">
        <v-spacer></v-spacer>
        <v-btn text small @click="reset">Huỷ</v-btn>
        <v-btn color="primary" small @click="$emit('add',messageAdd);commentText='';" :disabled="!commentText">Thêm</v-btn>
      </template>
    </v-col>
    <v-col cols="12" class="d-flex ma-0 pa-0 pr-3" v-else>
      <v-spacer></v-spacer>
      <v-btn text small @click="$emit('setShowAdd', false);commentText='';">Huỷ</v-btn>
      <v-btn color="primary" small @click="$emit('add', messageAdd);commentText='';$emit('setShowAdd', false);" :disabled="!commentText">Thêm</v-btn>
    </v-col>
  </v-row>
</template>
<script>
//const avartar = () => import("./Avartar");
import avartar from "./Avartar";
export default {
  components: {
    avartar
  },
  data() {
    return {
      show: true,
      email: this.$store.state.user.email,
      showAction: false,
      commentText: ""
    };
  },
  methods: {
    reset() {
      this.commentText = "";
      this.showAction = false;
    },
    blur(){
      console.log(11111);
    }
  },
  mounted() {
    this.commentText = this.text;
    // if (!this.isRoot) {
    //   this.text = this.from ? `**${this.from}**` : "";
    // }
  },
  props: ["size", "rows", "never_hide", "isRoot", "from", "text"],
  computed: {
    messageAdd() {
      return {
        userEmail: this.email,
        time: new Date(),
        comment: this.commentText,
        for: this.from,
        liked: 0,
        dislike: 0,
      };
    }
  }
};
</script>
