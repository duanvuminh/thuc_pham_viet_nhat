<template>
  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
    <v-row align="center" justify="center">
      <v-card
        v-for="(post,index) in posts"
        style="margin-bottom: 2rem;"
        data-aos="slide-up"
        data-aos-offset="100"
        data-aos-easing="ease-out-back"
        :key="index"
        class="ma-2"
      >
        <v-card-title v-show="post.title" v-html="post.title"></v-card-title>
        <v-img class="orange--text align-end" :src="post.images.image700.url" contain></v-img>
      </v-card>
    </v-row>
  </div>
</template>
<script>
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
export default {
  layout: "oboe",
  beforeCreate() {},
  data() {
    return {
      posts: [],
      next: "",
      limit: 10,
      busy: false,
      url:''
    };
  },
  methods: {
   loadMore() {
      this.busy = true;
      this.$axios
        .get(
            `${this.url}${this.next}`
        )
        .then(response => {
          let data = response.data.data.posts;
          // data.map( x=>  {
          //      this.translate(x.title).then(
          //        r=> x.title_vi = r
          //      )
          // })
          this.posts = this.posts.concat(data);
          this.busy = false;
          this.next = response.data.data.nextCursor;
        });
    },
    // translate(title) {
    //   return this.$axios
    //     .$post(
    //       "https://translation.googleapis.com/language/translate/v2?key=AIzaSyCgybxabzEcfCXOeZHVrwVenvrtY7OkV3M",
    //       {
    //         q: title,
    //         source: "en",
    //         target: "vi",
    //         format: "text"
    //       }
    //     )
    //     .then(r => {
    //      return r.data.translations[0].translatedText;
    //     });
    // }
  },
  created() {
    this.loadMore();
  },
  mounted() {
    this.url = [
      "https://cors-anywhere.herokuapp.com/https://m.9gag.com/v1/group-posts/group/japan/type/hot?",
      "https://cors-anywhere.herokuapp.com/https://m.9gag.com/v1/group-posts/group/animewallpaper/type/hot?",
      "https://cors-anywhere.herokuapp.com/https://m.9gag.com/v1/group-posts/group/anime-manga/type/hot?",
      "https://cors-anywhere.herokuapp.com/https://m.9gag.com/v1/group-posts/group/animewaifu/type/hot?",
    ][Math.floor(Math.random() * 4)]
    AOS.init();
  }
};
</script>