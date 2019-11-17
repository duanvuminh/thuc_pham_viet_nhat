<template>
  <v-row align="center" justify="center" v-if="email=='duanvuminh@gmail.com'">
    <v-select :items="items" label="Solo field" solo v-model="type"></v-select>
    <v-btn color="green" dark @click="getEvent">
      <v-icon>mdi-cached</v-icon>Đồng bộ dữ liệu
    </v-btn>
  </v-row>
</template> 
<script>
import firebase from "firebase";
const algoliasearch = require("algoliasearch");

const client = algoliasearch("N7UFARQ48L", "8d219c45506c851ab82563e0297891dd");
const indexAlgolia = client.initIndex("GaoNhat_algolia");
// Imports the Google Cloud client library
// const { Translate } = require("@google-cloud/translate").v3;

// Instantiates a client
// const translate = new Translate({projectId: "gaonhat-1b0c8"});

export default {
  beforeCreate() {
    // ここでローディングのインジケータアニメーションを表示すると良い
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.commit("setLoginState", true);
        this.email = user.email;
      } else {
        this.$store.commit("setLoginState", false);
        this.$router.push("/login");
      }
    });
  },
  data() {
    return {
      email: "",
      type: "",
      items: [
        // "山岳",
        // "高原",
        // "湖沼",
        // "河川景観",
        // "海岸景観",
        // "海中公園",
        // "その他（特殊地形）",
        // "自然現象",
        // "町並み",
        // "郷土景観",
        // "展望施設",
        // "公園",
        // "庭園",
        // "動物",
        // "植物",
        // "城郭",
        // "旧街道",
        // "史跡",
        // "歴史的建造物",
        "近代的建造物",
        "博物館",
        "美術館",
        "動・植物園",
        "水族館",
        "産業観光施設",
        "道の駅（見る）",
        "神社・仏閣等",
        "地域風俗",
        "アニメ・音楽舞台",
        "映画・ドラマロケ地",
        "その他（名所）",
        "行事・祭事",
        // "花見",
        // "花火大会",
        "郷土芸能",
        "その他（イベント）",
        "センター施設",
        "道の駅（遊ぶ）",
        "スポーツ・リゾート施設",
        "サイクリングセンター",
        "キャンプ場",
        "フィールド・アスレチック",
        "フィールド・アーチェリー場",
        // "スケート場",
        // "スキー場",
        "マリーナ・ヨットハーバー",
        "サイクリングコース",
        "ハイキングコース",
        "自然歩道・自然研究路",
        "オリエンテーリング・パーマネントコース",
        "海水浴場",
        // "観光農林業（体験含む）",
        // "観光牧場（体験含む）",
        // "観光漁業（体験含む）",
        "テーマパーク・レジャーランド",
        // "温泉",
        "その他（遊ぶ）",
        "ショッピング店",
        "伝統工芸技術",
        "その他（買う）",
        "郷土料理店",
        "その他（食べる）",
        "観光タクシー・ハイヤー・レンタカー",
        "ケーブルカー・ロープウェイ",
        "レンタサイクル",
        // "遊覧船",
        // "遊覧飛行機",
        // "観光列車",
        // "観光周遊バス",
        "その他（乗り物）",
        "旅館",
        "シティホテル",
        "ビジネスホテル",
        "リゾートホテル",
        "その他（ホテル）",
        "民宿",
        "ペンション",
        "その他（泊まる）",
        "その他（その他）"
      ]
    };
  },
  methods: {
    getAll(queryText, startRow, allResult) {
      let allResults = allResult || [];
      // return this.$axios.$get("/v001/kanko/%E5%B1%B1%E5%B2%B3/json?limit=1").then(
      return this.$axios.$get(`${queryText}&skip=${startRow}`).then(r => {
        if (r.tourspots.length > 0) {
          allResults = allResults.concat(r.tourspots);
          startRow = startRow + r.tourspots.length;
          return this.getAll(queryText, startRow, allResults);
        } else {
          return allResults;
        }
      });
    },
    getEvent() {
      // this.$axios
      //   .$post(
      //     "https://translation.googleapis.com/language/translate/v2?key=AIzaSyCgybxabzEcfCXOeZHVrwVenvrtY7OkV3M",
      //     {
      //       q:
      //         "The Great Pyramid of Giza (also known as the Pyramid of Khufu or the Pyramid of Cheops) is the oldest and largest of the three pyramids in the Giza pyramid complex.",
      //       source: "ja",
      //       target: "vi",
      //       format: "text"
      //     }
      //   )
      //   .then(r => console.log(r));
      const ip = this.getAll(`/${this.type}/json?limit=50`, 0, []);
      ip.then(r => {
        let results = r.map(x => {
          x.imgUrl1 = x.views?`https://www.chiikinogennki.soumu.go.jp/k-cloud-api/v001/kanko/view/${x.mng.refbase}/${x.views[0].fid}`:"";
          if (x.views && x.views.length > 1) {
            x.imgUrl2 = `https://www.chiikinogennki.soumu.go.jp/k-cloud-api/v001/kanko/view/${x.mng.refbase}/${x.views[1].fid}`;
          } else {
            x.imgUrl2 = "";
          }
          if (x.views && x.views.length > 2) {
            x.imgUrl3 = `https://www.chiikinogennki.soumu.go.jp/k-cloud-api/v001/kanko/view/${x.mng.refbase}/${x.views[2].fid}`;
          } else {
            x.imgUrl3 = "";
          }
          // console.log(x);
          x.description = "";
          if (x.descs) {
            for (let i = 0; i < x.descs.length; i++) {
              x.description += x.descs[i].body + "  \n";
            }
          }
          this.$axios
            .$post(
              "https://translation.googleapis.com/language/translate/v2?key=AIzaSyCgybxabzEcfCXOeZHVrwVenvrtY7OkV3M",
              {
                q: [x.description, (x.visit&&x.visit.guide&&x.visit.guide.note)?x.visit.guide.note:""],
                source: "ja",
                target: "vi",
                format: "text"
              }
            )
            .then(r => {
              let saveObj = {
                address: `${x.place.pref?x.place.pref.written:''}${x.place.city?x.place.city.written:''}${x.place.street?x.place.street.written:''}`,
                creator_id: this.email,
                date_create: new Date(),
                date_edit: new Date(),
                description: `
${x.name.name1.written}
===
**#${x.name.name1.spoken}**
${x.description}  
${x.visit&&x.visit.guide?x.visit.guide.note:""} 
# Tiếng việt
${r.data.translations[0].translatedText}  
${r.data.translations[1].translatedText}
# Các thông tin khác
## Bãi đỗ xe
${x.parkings&&x.parkings[0].name?x.parkings[0].name:''}  
${x.parkings&&x.parkings[0].info?'Thông tin: '+x.parkings[0].info:''}  
${x.parkings&&x.parkings[0].free_or_pay?'Có phí/ không: '+x.parkings[0].free_or_pay:''}
## Trang web
${x.place&&x.place.url?x.place.url:''}
              `,
                image_url1: x.imgUrl1,
                image_url2: x.imgUrl2,
                image_url3: x.imgUrl3,
                name: x.name.name1.written,
                type: "Trải nghiệm ngư nghiệp",
                seo: "Đi chơi ở Nhật, Địa điểm đi chơi ở Nhật, Trải nghiệm ngư nghiệp"
              };
              firebase
                .firestore()
                .collection("Goods")
                .add(saveObj)
                .then(r => {
                  saveObj.id = r.id;
                  const objects = [saveObj];

                  indexAlgolia.addObjects(objects, (err, content) => {
                    // console.log(content);
                  });
                });
            });
        });
      });
    }
  },
  mounted() {
    this.$store.commit("setshowPlus", true);
  }
};
</script>