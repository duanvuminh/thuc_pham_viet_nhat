<template>
  <v-layout column wrap class="my-12" align-center>
    <v-flex xs12 sm4 class="my-4">
      <div class="text-center">
        <h2 class="headline">Các bạn có thể bán trực tiếp cho cửa hàng</h2>
        <span class="subheading">Hoặc đăng nhập và giao bán</span>
      </div>
    </v-flex>
    <v-flex xs12>
      <v-container grid-list-xl>
        <v-layout row wrap align-center>
          <v-flex xs12 md4 v-for="(item,i) in cards" :key="i">
            <v-card flat class="transparent" :href="`/detail/${nonAccentVietnamese(item.name)}-${item.id}`">
              <v-card-title primary-title class="layout justify-center">
                <div class="headline text-center">{{item.name}}</div>
              </v-card-title>
              <v-card-text>{{item.description}}</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
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
import getAppRoutes from '~/utils/getRoutes.js';
const googleTrends = require("google-trends-api");

export default {
  async asyncData({ params }) {
    // <v-sheet height="50" tile>
    //             <v-row class="fill-height" align="center" justify="center">
    //               <div class="display-3">{{ item.title }}</div>
    //               <div class="display-4">{{ item.snippet }}</div>
    //             </v-row>
    //           </v-sheet>
    let item = await firebase
      .app()
      .firestore()
      .collection("muaban_phuquoc")
      .where("display", "==", true)
      .orderBy("date_edit")
      .limit(3)
      .get();
    //console.log(item)
    let cards = item.docs.map(x => {
      return { id: x.id, ...x.data() };
    });
    let items = [];
    //console.log(result)
    try {
      let gg = await googleTrends.dailyTrends({ keyword: "", geo: "VN" });
      gg = JSON.parse(gg);
      // console.log(gg.default.trendingSearchesDays[1].trendingSearches.map(x => x.articles[0]));
      let trendToday = gg.default.trendingSearchesDays[0].trendingSearches.map(
        x => x.articles[0]
      );
      let trendYestoday = gg.default.trendingSearchesDays[1].trendingSearches.map(
        x => x.articles[0]
      );
      let trending = trendToday.concat(trendYestoday);
      if (trending.length > 9) {
        trending = trending.slice(0, 9);
      }
      items = trending;
      // console.log(items);
    } catch (err) {
      console.log(err);
    }
    return { cards, items };
  },
  beforeCreate() {
  },
  computed: {
    arrayImage() {
      let ar = [];
      if (this.card.image_url1) {
        ar = [this.card.image_url1];
      }
      if (this.card.image_url2) {
        ar = [this.card.image_url1, this.card.image_url2];
      }
      if (this.card.image_url3) {
        ar = [this.card.image_url1, this.card.image_url2, this.card.image_url3];
      }
      return ar;
    }
  },
  data() {
    return {
      tab: -1,
      checkbox: true,
      card: {}
    };
  },
  methods: {
    iso8601Time(timestamp) {
      // console.log(timestamp);
      return new Date(timestamp.seconds * 1e3).toISOString().slice(0, -5);
    },
    nonAccentVietnamese(text){
      return getAppRoutes.nonAccentVietnamese(text);
    }
  },
  mounted() {
    // console.log(this.items);
  }
};
</script>