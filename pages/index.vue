<template>
  <v-layout column wrap class="my-12" align-center>
    <v-flex xs12 sm4 class="my-4">
      <div class="text-center">
        <h2 class="headline">Các bạn có thể bán trực tiếp cho cửa hàng</h2>
        <span class="subheading">Hoặc đăng nhập và giao bán</span>
      </div>
    </v-flex>
    <v-flex xs12 sm4 class="my-4">
      <div class="text-center">
        <h2 class="headline">Các tin nổi bật gần đây</h2>
        <span class="subheading">Nguồn: Google trending</span>
      </div>
    </v-flex>
    <v-flex xs12>
      <v-container grid-list-xl>
        <v-layout row wrap align-center>
          <v-flex xs12 md4 v-for="(item,i) in items" :key="i" class="align-self-start">
            <v-card color="#1F7087" dark :href="item.url">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="headline" v-html="item.title"></v-card-title>

                  <v-card-subtitle v-html="item.snippet"></v-card-subtitle>
                </div>
                <v-avatar class="ma-3" size="100" tile v-if="item.image">
                  <v-img :src="item.image.imageUrl"></v-img>
                </v-avatar>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import firebase from "firebase";
const googleTrends = require("google-trends-api");

export default {
  async asyncData({ params }) {
    let items = [];
    //console.log(result)
    try {
      let gg = await googleTrends.dailyTrends({ keyword: "", geo: "VN" });
      gg = JSON.parse(gg);
      // console.log(gg.default.trendingSearchesDays[0].trendingSearches.map(x => x.articles[0]));
      let trendToday = gg.default.trendingSearchesDays[0]
        ? gg.default.trendingSearchesDays[0].trendingSearches.map(
            x => x.articles[0]
          )
        : [];
      let trendYestoday = gg.default.trendingSearchesDays[1]
        ? gg.default.trendingSearchesDays[1].trendingSearches.map(
            x => x.articles[0]
          )
        : [];

      let trending = trendToday.concat(trendYestoday);
      if (trending.length > 3) {
        trending = trending.slice(0, 3);
      }
      items = trending;
      // console.log(items);
    } catch (err) {
      console.log(err);
    }
    return { items };
  },
  beforeCreate() {},
  computed: {

  },
  data() {
    return {
      tab: -1,
      checkbox: true,
    };
  },
  methods: {
    iso8601Time(timestamp) {
      // console.log(timestamp);
      return new Date(timestamp.seconds * 1e3).toISOString().slice(0, -5);
    },
    nonAccentVietnamese(text) {
      return getAppRoutes.nonAccentVietnamese(text);
    }
  },
  mounted() {
    // console.log(this.items);
  }
};
</script>