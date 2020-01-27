<template>
  <v-row>
    <v-col cols="12">
      <h1>{{commentCount}} bình luận</h1>
    </v-col>
    <v-col cols="12">
      <add :size="40" :rows="3" :never_hide="true"></add>
    </v-col>
    <v-col cols="12">
      <comment v-for="(item,index) in comments" :key="index" :comment="item"></comment>
    </v-col>
  </v-row>
</template>
<script>
const avartar = () => import("./Avartar");
const comment = () => import("./Comment");
const add = () => import("./Add");

export default {
  components: {
    avartar,
    comment,
    add
  },
  data() {
    return {
      commentCount: 28,
      size: 50,
      email: this.$store.state.user.email,
      comments: [
        {
          userEmail: "duanvuminh@gmail.com",
          comment: "Ghét nhất bọn azumi",
          liked: 3,
          dislike: 1,
          commentSub: [
            {
              userEmail: "tes2@gmail.com",
              comment: "Ghét nhất bọn azumi",
              liked: 3,
              dislike: 1
            },
            {
              userEmail: "tes3@gmail.com",
              comment: "Ghét nhất bọn azumi",
              for: "tes2@gmail.com",
              liked: 3,
              dislike: 1
            }
          ]
        },
        {
          userEmail: "tes4@gmail.com",
          comment: "Ghét nhất đội thám tử nhí chưa gì đã ra kết luận",
          liked: 3,
          dislike: 1
        }
      ]
    };
  }
};
</script>