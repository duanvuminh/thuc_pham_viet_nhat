<template>
  <v-row>
    <v-col cols="12">
      <h1>{{commentCount}} bình luận</h1>
    </v-col>
    <v-col cols="12">
      <add :size="40" :rows="3" :never_hide="true" @add="addRoot"></add>
    </v-col>
    <v-col cols="12">
      <comment v-for="(item,index) in comments" :key="index" :comment="item" @add="add" :isRoot="true" :rootId="item.id">
        <v-col cols="12" class="mt-0 pt-0">
          <div class="d-flex justify-start">
            <div class="ml-9 flex-grow-1">
              <comment
                v-for="(item_sub,index_sub) in item.commentSub"
                :key="index_sub"
                :comment="item_sub"
                @add="add"
                :isRoot="false"
                :rootId="item.id"
              ></comment>
            </div>
          </div>
        </v-col>
      </comment>
    </v-col>
  </v-row>
</template>
<script>
const comment = () => import("./Comment");
const add = () => import("./Add");

export default {
  components: {
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
          id:1,
          userEmail: "duanvuminh@gmail.com",
          time: new Date(),
          comment: "Ghét nhất bọn azumi",
          liked: 3,
          dislike: 1,
          for:null,
          commentSub: [
            {
              id:2,
              userEmail: "tes2@gmail.com",
              time: new Date(),
              comment: "Ghét nhất bọn azumi",
              liked: 3,
              dislike: 1,
              for:null
            },
            {
              id:3,
              userEmail: "tes3@gmail.com",
              time: new Date(),
              comment: "Ghét nhất bọn azumi",
              for: "duanvuminh@gmail.com",
              liked: 3,
              dislike: 1,
            }
          ]
        },
        {
          id:4,
          userEmail: "tes4@gmail.com",
          time: new Date(),
          comment: "Ghét nhất đội thám tử nhí chưa gì đã ra kết luận",
          liked: 3,
          dislike: 1,
          for:null,
          commentSub:[]
        }
      ]
    };
  },
  methods:{
    add(comment){
      this.comments.forEach((item,index)=>{
        if(item.id == comment.rootId){
          if(comment.for == item.userEmail){
            comment.for = ""    
          }
          this.comments[index].commentSub.unshift(comment)
        }
      })
    },
    addRoot(comment){
      comment.commentSub = [];
      comment.for = null;
      this.comments.unshift(comment);
    }
  }
};
</script>
