<template>
  <v-row justify="center">
    <Search />
    <v-col cols="12">
      <HtmlParser :content="$md.render(introdue)"/>
    </v-col>
  </v-row>
</template>
<script>
const Search =()=> import("@/components/nihongo/Search");
const HtmlParser =()=> import("@/components/HtmlParser");
export default {
  components: {
    Search,
    HtmlParser
  },
  data() {
    return {
      introdue: `
## Kanji ngẫu nhiên ”必”
#### かなら.ず ヒツ 必 - TẤT
##### 心 TÂM 丿 PHIỆT, TRIỆT
1. Tâm
2. Chia 

trong tình yêu **tất nhiên** phải có sóng gió, chia rẽ nhưng quan trong là cách chúng ta vượt qua.

## Oboe awesome
* [Kanji Primitive Elements](/main)
* [awesome 日本語](/awesome)
* [markdown](https://lithong.com/howto)
* [Gõ tiếng Nhật](https://typing.lithong.com/)
      `
    };
  },
  layout: "oboe",
  methods: {
    
  },
  mounted() {
  }
};
</script>