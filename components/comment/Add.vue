<template>
  <v-row>
    <v-col cols="12" class="mb-1 py-0 pr-3">
      <v-textarea
        placeholder="Bạn hãy viết gì đó"
        :rows="rows"
        auto-grow
        v-model="commentText"
        :hide-details="!from"
        @click="showAction=true"
        :hint="`Trả lời ${from}`"
        persistent-hint
      >
        <div slot="prepend">
          <avartar :size="size" :email="email"></avartar>
        </div>
      </v-textarea>
    </v-col>
    <v-col cols="12" class="d-flex ma-0 pa-0 pr-3" v-if="never_hide">
      <template v-if="showAction">
        <v-spacer></v-spacer>
        <v-btn text small @click="reset">Huỷ</v-btn>
        <v-btn text small>Thêm</v-btn>
      </template>
    </v-col>
    <v-col cols="12" class="d-flex ma-0 pa-0 pr-3" v-else>
      <v-spacer></v-spacer>
      <v-btn text small @click="$emit('setShowAdd', false)">Huỷ</v-btn>
      <v-btn text small @click="$emit('add', messageAdd)">Thêm</v-btn>
    </v-col>
  </v-row>
</template>
<script>
const avartar = () => import("./Avartar");
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
      this.text = "";
      this.showAction = false;
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
        time: "vài giây trước",
        comment: this.commentText,
        for: this.from,
        liked: 0,
        dislike: 0,
      };
    }
  }
};
</script>