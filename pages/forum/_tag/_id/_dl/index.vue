<template>
  <div class="ma-3">
    <v-app-bar elevation="0" color="transparent" dense fixed>
      <v-spacer></v-spacer>
      <v-btn fab small to="/forum">
        <v-icon>{{ mdiHome }}</v-icon>
      </v-btn>
      <v-btn fab small @click="closeDialog">
        <v-icon>{{ mdiClose }}</v-icon>
      </v-btn>
    </v-app-bar>
    <client-only>
      <GmapMap
        :center="center"
        :zoom="17"
        map-type-id="terrain"
        style="width: 100%; height: 70vh"
      >
        <gmap-info-window
          v-if="position"
          :options="infoOptions"
          :position="position"
          :opened="infoWinOpen"
          @closeclick="closeClick"
        ></gmap-info-window>
        <GmapMarker
          :key="index"
          v-for="(m, index) in resultArr"
          :position="{ lat: m.lat, lng: m.lng }"
          :clickable="true"
          :draggable="false"
          @click="showinfo(m, index)"
        />
      </GmapMap>
    </client-only>
    <v-card>
      <v-card-title>{{ place.areaName }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-checkbox v-model="kan" label="館" dense></v-checkbox>
          <v-checkbox v-model="jinja" label="神" dense></v-checkbox>
          <v-checkbox v-model="koen" label="公園" dense></v-checkbox>
        </v-row>
      </v-card-text>
      <v-card-text class="d-flex flex-wrap justify-center">
        <template v-for="(item, index) in resultArr">
          <v-card max-width="310" class="ma-3" :key="index">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="headline">{{
                  item.name
                }}</v-list-item-title>
                <span style="max-width: 100%">{{ item.officialURL }}</span>
              </v-list-item-content>
            </v-list-item>

            <v-img
              :src="`https://ctplanner.jp/ctp5/${item.photoURL}`"
              height="120"
              contain
            ></v-img>

            <v-card-text>{{ item.description }}</v-card-text>
            <v-row align="center" class="mx-0">
              <v-rating
                :value="item.score / 5"
                color="amber"
                dense
                half-increments
                readonly
                size="14"
              ></v-rating>
            </v-row>
          </v-card>
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { mdiHome, mdiClose } from "@mdi/js";
// import HtmlParser from "@/components/HtmlParser";
import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCniellt7ZkxGUk6r3ISo476bkwc0ya3OA",
    // libraries: 'drawing', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    //// If you want to set the version, you can do so:
    // v: '3.26',
  },

  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  // autobindAllEvents: false,

  //// If you want to manually install components, e.g.
  //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  //// Vue.component('GmapMarker', GmapMarker)
  //// then set installComponents to 'false'.
  //// If you want to automatically install all the components this property must be set to 'true':
  installComponents: true,
});

export default {
  async asyncData({ params, store, $axios, $fire }) {
    await $fire.firestoreReady();
    let resultArr = [];
    let center = null;
    await $axios
      .get("/api/9gag", {
        params: {
          id: `https://ctplanner.jp/ctp5/${params.dl}/POI_jp.json`,
        },
      })
      .then((response) => {
        resultArr = response.data.map((x) => {
          return { ...x, score: x.score.reduce((a, b) => a + b) };
        });
        resultArr = resultArr.filter((x) => x.score > 0);
      });
    center = { lat: resultArr[0].lat, lng: resultArr[0].lng };

    return { origin: resultArr, center };
  },
  beforeCreate() {},
  components: {},
  created() {},
  computed: {
    place() {
      return this.areaArr.filter((x) => x.areaName == this.$route.params.dl)[0];
    },
    resultArr() {
      let myplace = this.origin;
      if (!this.kan) {
        myplace = myplace.filter((x) => !x.name.includes("館"));
      }
      if (!this.koen) {
        myplace = myplace.filter((x) => !x.name.includes("公園"));
      }
      if (!this.jinja) {
        myplace = myplace.filter((x) => !x.name.includes("神"));
      }
      return myplace;
    },
  },
  data() {
    return {
      areaArr: [
        //hokkaido
        { areaName: "sapporo", relatedSec: "hokkaido", region: "hokkaido" },
        { areaName: "otaru", relatedSec: "hokkaido", region: "hokkaido" },
        { areaName: "hakodate", relatedSec: "hokkaido", region: "hokkaido" },
        //tohoku
        { areaName: "shonai", relatedSec: "yamagata", region: "tohoku" },
        { areaName: "sendai", relatedSec: "miyagi", region: "tohoku" },
        { areaName: "shiogama2", relatedSec: "miyagi", region: "tohoku" },
        { areaName: "yonezawa", relatedSec: "yamagata", region: "tohoku" },
        { areaName: "aizuwakamatsu", relatedSec: "tohoku", region: "tohoku" },
        { areaName: "kitakata", relatedSec: "fukushima", region: "tohoku" },
        { areaName: "aomori", relatedSec: "aomori", region: "tohoku" },
        { areaName: "iwate", relatedSec: "iwate", region: "tohoku" },
        { areaName: "akita", relatedSec: "akita", region: "tohoku" },
        { areaName: "miyagi", relatedSec: "miyagi", region: "tohoku" },
        { areaName: "yamagata", relatedSec: "yamagata", region: "tohoku" },
        { areaName: "fukushima", relatedSec: "fukushima", region: "tohoku" },
        //kanto
        { areaName: "mito", relatedSec: "ibaraki", region: "kanto" },
        { areaName: "asakusa", relatedSec: "tokyo", region: "kanto" },
        { areaName: "uenoakiba", relatedSec: "tokyo", region: "kanto" },
        { areaName: "ginza", relatedSec: "tokyo", region: "kanto" },
        { areaName: "tokyo_rinkai", relatedSec: "tokyo", region: "kanto" },
        { areaName: "shibuya", relatedSec: "tokyo", region: "kanto" },
        { areaName: "shinjuku", relatedSec: "tokyo", region: "kanto" },
        { areaName: "ikebukuro", relatedSec: "tokyo", region: "kanto" },
        { areaName: "waseda", relatedSec: "tokyo", region: "kanto" },
        { areaName: "bunkyoku", relatedSec: "tokyo", region: "kanto" },
        { areaName: "u-tokyo", relatedSec: "tokyo", region: "kanto" },
        { areaName: "yokohama", relatedSec: "kanagawa", region: "kanto" },
        { areaName: "kamakura", relatedSec: "kanagawa", region: "kanto" },
        { areaName: "chigasaki", relatedSec: "kanagawa", region: "kanto" },
        { areaName: "odawara", relatedSec: "kanagawa", region: "kanto" },
        { areaName: "hakone", relatedSec: "kanagawa", region: "kanto" },
        { areaName: "saitama", relatedSec: "saitama", region: "kanto" },
        { areaName: "kawagoe", relatedSec: "saitama", region: "kanto" },
        { areaName: "chiba", relatedSec: "chiba", region: "kanto" },
        { areaName: "nikko", relatedSec: "tochigi", region: "kanto" },
        { areaName: "tomioka", relatedSec: "gunma", region: "kanto" },
        { areaName: "ikaho", relatedSec: "gunma", region: "kanto" },
        { areaName: "shikine", relatedSec: "tokyo", region: "kanto" },
        { areaName: "niijima", relatedSec: "tokyo", region: "kanto" },
        { areaName: "kozushima", relatedSec: "tokyo", region: "kanto" },
        { areaName: "hachijojima", relatedSec: "tokyo", region: "kanto" },
        { areaName: "chichijima", relatedSec: "tokyo", region: "kanto" },
        //chubu
        { areaName: "nagoya", relatedSec: "aichi", region: "chubu" },
        { areaName: "toyohashi", relatedSec: "aichi", region: "chubu" },
        { areaName: "gifu", relatedSec: "gifu", region: "chubu" },
        { areaName: "takayama", relatedSec: "gifu", region: "chubu" },
        { areaName: "kanazawa", relatedSec: "ishikawa", region: "chubu" },
        { areaName: "shizuoka", relatedSec: "shizuoka", region: "chubu" },
        { areaName: "mishima", relatedSec: "shizuoka", region: "chubu" },
        { areaName: "atami", relatedSec: "shizuoka", region: "chubu" },
        { areaName: "shimoda", relatedSec: "shizuoka", region: "chubu" },
        { areaName: "hamamatsu", relatedSec: "shizuoka", region: "chubu" },
        { areaName: "kofu", relatedSec: "yamanashi", region: "chubu" },
        { areaName: "fujigoko", relatedSec: "yamanashi", region: "chubu" },
        { areaName: "suwa", relatedSec: "nagano", region: "chubu" },
        { areaName: "matsumoto", relatedSec: "nagano", region: "chubu" },
        { areaName: "niigata", relatedSec: "niigata", region: "chubu" },
        //kansai
        { areaName: "osaka", relatedSec: "osaka", region: "kansai" },
        { areaName: "kobe", relatedSec: "hyogo", region: "kansai" },
        { areaName: "nagahama", relatedSec: "shiga", region: "kansai" },
        { areaName: "kyoto_downtown", relatedSec: "kyoto", region: "kansai" },
        { areaName: "kyoto_kitayama", relatedSec: "kyoto", region: "kansai" },
        { areaName: "kyoto_arashiyama", relatedSec: "kyoto", region: "kansai" },
        {
          areaName: "kyoto_higashiyama",
          relatedSec: "kyoto",
          region: "kansai",
        },
        { areaName: "kyoto_uji", relatedSec: "kyoto", region: "kansai" },
        { areaName: "nara", relatedSec: "nara", region: "kansai" },
        { areaName: "asuka", relatedSec: "nara", region: "kansai" },
        { areaName: "ise", relatedSec: "mie", region: "kansai" },
        //chugoku
        { areaName: "hiroshima", relatedSec: "hiroshima", region: "chugoku" },
        { areaName: "okayama", relatedSec: "okayama", region: "chugoku" },
        { areaName: "izumo", relatedSec: "shimane", region: "chugoku" },
        { areaName: "hagi", relatedSec: "yamaguchi", region: "chugoku" },
        { areaName: "shimonoseki", relatedSec: "yamaguchi", region: "chugoku" },
        { areaName: "tottori", relatedSec: "tottori" },
        //shikoku
        { areaName: "matsuyama", relatedSec: "ehime", region: "shikoku" },
        { areaName: "takamatsu", relatedSec: "kagawa", region: "shikoku" },
        { areaName: "kotohira", relatedSec: "kagawa", region: "shikoku" },
        //kyusyu
        { areaName: "fukuoka", relatedSec: "fukuoka", region: "kyusyu" },
        { areaName: "kitakyushu", relatedSec: "fukuoka", region: "kyusyu" },
        { areaName: "nagasaki", relatedSec: "nagasaki", region: "kyusyu" },
        { areaName: "kumamoto", relatedSec: "kumamoto", region: "kyusyu" },
        { areaName: "kagoshima", relatedSec: "kagoshima", region: "kyusyu" },
        { areaName: "tanegashima", relatedSec: "kagoshima", region: "kyusyu" },
        { areaName: "naha", relatedSec: "okinawa", region: "kyusyu" },
      ],
      currentMidx: null,
      infoWinOpen: false,
      infoOptions: {
        content: "",
        //optional: offset infowindow so it visually sits nicely on top of our marker
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      jinja: false,
      kan: false,
      koen: false,
      mdiHome,
      mdiClose,
      position: null,
    };
  },
  head() {
    return {
      titleTemplate: `%s - Forum`,
      // title: `Oboe - cách học kanji với cách nhớ đơn giản`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Forum hỏi đáp về tiếng nhật và cuộc sống ở nhật",
        },
      ],
    };
  },
  layout: "noheader",
  methods: {
    closeDialog() {
      let paths = this.$route.path;
      var the_arr = paths.split("/");
      the_arr.pop();
      this.$router.push(the_arr.join("/"));
    },
    showinfo(m, index) {
      this.position = { lat: m.lat, lng: m.lng };
      this.infoOptions.content = `<div class="g-map">
<h3>${m.name}</h3>
<h4>${m.officialURL}</h4>
<img
    height="120"
    src="https://ctplanner.jp/ctp5/${m.photoURL}"
  >
<p>${m.description}</p>
</div>`;
      if (this.currentMidx == index) {
        this.infoWinOpen = !this.infoWinOpen;
        this.currentMidx = null;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = index;
      }
    },
    closeClick() {
      this.infoWinOpen = false;
    },
  },
  mounted() {},
};
</script>
<style>
.g-map {
  color: black;
}
</style>