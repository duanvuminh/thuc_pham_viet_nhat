<template>
  <v-card elevation="0">
    <v-container>
      <radio-svg-map v-model="selectedLocationLocal" :map="Japan" />
      <v-text-field
        v-model="selectedLocationLocal"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        dense
      ></v-text-field>
      <v-data-table
        @click:row="handleClick"
        :items="areaArrTsble"
        :search="selectedLocationLocal"
        :headers="headers"
        hide-default-header
        :items-per-page="3"
        :footer-props="{
        'items-per-page-options':[3,6,9,-1]}"
      ></v-data-table>
      <v-row id="ken">
        <v-col v-for="(n,index) in imgArr" :key="index" class="d-flex child-flex" cols="4" sm="2">
          <v-card flat tile :to="`${$route.path}/${n.areaName}`">
            <v-card-text>
              <v-img
                :src="`https://ctplanner.jp/ctp5/${n.areaName}/${n.picfile}`"
                :lazy-src="`https://ctplanner.jp/ctp5/${n.areaName}/${n.picfile}`"
                aspect-ratio="1"
                class="grey lighten-2"
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-card-text>
            <v-card-actions>
              <v-btn small text>{{n.name}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { RadioSvgMap } from "vue-svg-map";
import Japan from "@svg-maps/japan";
import { mapState } from "vuex";

export default {
  name: "MyMap",
  components: {
    RadioSvgMap,
  },
  computed: {
    ...mapState(["selectedLocation"]),
    areaArrTsble() {
      return this.areaArr.map((x) => {
        return {
          ...x,
          full: `Vùng: ${x.region},Tỉnh/thành phố: ${x.relatedSec},Địa điểm: ${x.areaName}`,
        };
      });
    },
  },
  data() {
    return {
      Japan,
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
      headers: [{ text: "Địa điểm", value: "full" }],
      imgArr: null,
      resultArr: null,
      selectedLocationLocal: this.selectedLocation,
    };
  },
  methods: {
    handleClick(val) {
      this.$router.push(`${this.$route.path}/${val.areaName}`)
    },
  },
  mounted() {
    this.selectedLocationLocal = this.selectedLocation;
  },
  watch: {
    selectedLocationLocal(val) {
      this.$store.commit("setSelectedLocation", val);
      this.imgArr = [];
      let filter = this.areaArr.filter((x) => x.relatedSec == val);
      for (let i = 0; i < filter.length; i++) {
        this.$axios
          .get("/api/9gag", {
            params: {
              id: `https://ctplanner.jp/ctp5/${filter[i].areaName}/profile.json`,
            },
          })
          .then((response) => {
            if (response.data.profile) {
              this.imgArr.push({
                ...response.data.profile[0],
                areaName: filter[i].areaName,
              });
              this.$nextTick(() => {
                this.$vuetify.goTo("#ken");
              });
            }
          });
      }
    },
  },
};
</script>

<style src="vue-svg-map/dist/index.css">
</style>

<style>
.svg-map__location[aria-checked="true"] {
  fill: #f4bc44 !important;
}

path#hokkaido {
  fill: rgb(93, 163, 255);
}

path#aomori {
  fill: rgb(0, 158, 197);
}
path#akita {
  fill: rgb(0, 158, 197);
}
path#iwate {
  fill: rgb(0, 158, 197);
}
path#yamagata {
  fill: rgb(0, 158, 197);
}
path#miyagi {
  fill: rgb(0, 158, 197);
}
path#fukushima {
  fill: rgb(0, 158, 197);
}

path#tokyo {
  fill: rgb(255, 0, 212);
}
path#gunma {
  fill: rgb(255, 0, 212);
}
path#tochigi {
  fill: rgb(255, 0, 212);
}
path#ibaraki {
  fill: rgb(255, 0, 212);
}
path#saitama {
  fill: rgb(255, 0, 212);
}
path#chiba {
  fill: rgb(255, 0, 212);
}
path#kanagawa {
  fill: rgb(255, 0, 212);
}

path#kyoto {
  fill: red;
}
path#nara {
  fill: red;
}
path#mie {
  fill: red;
}
path#shiga {
  fill: red;
}
path#wakayama {
  fill: red;
}
path#osaka {
  fill: red;
}
path#hyogo {
  fill: red;
}

path#tottori {
  fill: pink;
}
path#shimane {
  fill: pink;
}
path#yamaguchi {
  fill: pink;
}
path#okayama {
  fill: pink;
}
path#hiroshima {
  fill: pink;
}

path#kagawa {
  fill: blue;
}
path#kagawa {
  fill: blue;
}
path#ehime {
  fill: blue;
}
path#tokushima {
  fill: blue;
}
path#kochi {
  fill: blue;
}

path#oita {
  fill: orange;
}
path#fukuoka {
  fill: orange;
}
path#saga {
  fill: orange;
}
path#nagasaki {
  fill: orange;
}
path#kumamoto {
  fill: orange;
}
path#miyazaki {
  fill: orange;
}
path#kagoshima {
  fill: orange;
}
path#okinawa {
  fill: orange;
}
</style>