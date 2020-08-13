<template>
  <div
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="20"
    style="max-width:600px;width:100%"
  >
    <v-row align="start" justify="center">
      <v-col cols="12">
        <template v-for="(post,index) in posts">
          <v-card style="margin-bottom: 2rem;" class="ma-1" elevation="0" :key="index">
            <v-card-title v-show="post.title" v-html="post.title"></v-card-title>
            <v-card-text>
              <v-img class="orange--text align-end" :src="post.url" contain></v-img>
            </v-card-text>
          </v-card>
        </template>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  async asyncData({ params, store, $axios }) {
    let posts = [];
    let next = "";
    let url = [
      "https://m.9gag.com/v1/group-posts/group/japan/type/hot?",
      "https://m.9gag.com/v1/group-posts/group/animewallpaper/type/hot?",
      "https://m.9gag.com/v1/group-posts/group/anime-manga/type/hot?",
      "https://m.9gag.com/v1/group-posts/group/animewaifu/type/hot?",
    ][Math.floor(Math.random() * 4)];
    // await $axios.get(`${url}${next}`).then(response => {
    //   let data = response.data.data.posts;
    //   data = data.map(x => {
    //     return { title: x.title, url: x.images.image700.url };
    //   });
    //   posts = posts.concat(data);
    //   next = response.data.data.nextCursor;
    // });
    try {
      await $axios
        .get("/api/9gag", {
          params: {
            id: `${url}${next}`,
          },
        })
        .then((response) => {
          let data = response.data.data.posts;
          data = data.map((x) => {
            return { title: x.title, url: x.images.image700.url };
          });
          // data.map( x=>  {
          //      this.translate(x.title).then(
          //        r=> x.title_vi = r
          //      )
          // })
          posts = posts.concat(data);
          next = response.data.data.nextCursor;
        });
    } catch (err) {
      // console.log(err);
    }
    return { posts, next, url };
  },
  layout: "oboesub",
  beforeCreate() {},
  data() {
    return {
      posts: [],
      next: "",
      limit: 10,
      busy: false,
      url: "",
    };
  },
  head() {
    return {
      titleTemplate: `%s - japan, animewallpaper,animewaifu,anime-manga`,
    };
  },
  methods: {
    loadMore() {
      this.busy = true;
      this.$axios
        .get("/api/9gag", {
          params: {
            id: `${this.url}${this.next}`,
          },
        })
        .then((response) => {
          let data = response.data.data.posts;
          data = data.map((x) => {
            return { title: x.title, url: x.images.image700.url };
          });
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
  created() {},
  mounted() {},
};
</script>