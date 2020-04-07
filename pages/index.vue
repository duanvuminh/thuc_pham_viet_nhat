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
## Các tài liệu học tiếng nhật từ web này
* Các nét kanji cơ bản
[Kanji Primitive Elements](/main)
* Tổng hợp các nguồn học tiếng nhật
[awesome](/awesome)
## Các nguồn khác
* Hỗ trợ đánh tiếng nhật online
[Gõ tiếng Nhật](https://typing.lithong.com/)
* Cách sử dụng markdown để viết bài
[markdown](https://lithong.com/howto)
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