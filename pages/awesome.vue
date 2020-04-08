<template>
  <v-row justify="center">
    <v-col cols="12">
      <HtmlParser :content="$md.render(introdue)"></HtmlParser>
    </v-col>
  </v-row>
</template>
<script>
//import HtmlParser from "@/components/HtmlParser";
const HtmlParser = ()=>import("@/components/HtmlParser")

const nhk="https://www.nhk.or.jp/lesson/vietnamese/learn/list/";

export default {
  components: {
    HtmlParser
  },
  data() {
    return {
      introdue: `
## Kênh youtube
* Phim hoạt hình maruko
[ちびまる子ちゃんねる](https://www.youtube.com/channel/UCBqA04GYbwNh_oP6tJEvYuw)
* PAPAKEN-family Cuộc sống ở Nhật
[PAPAKEN](https://www.youtube.com/channel/UCKcULYIUSFpGv_IlkfUX2jg)
## Trang web học tiếng Nhật
* Từ điển Mazzi
[Mazzi](https://mazii.net/)
* Trang web của NHK với video(dành cho các bạn mới bắt đầu n5)
[NHK](https://www.nhk.or.jp/lesson/vietnamese/)

|||||||||
|:---|:---|:---|:---|:---|:---|:---|:---|
| [1](${nhk}/1.html) | [2](${nhk}/2.html) | [3](${nhk}/3.html) | [4](${nhk}/4.html) | [5](${nhk}/5.html) | [6](${nhk}/6.html) | [7](${nhk}/7.html) | [8](${nhk}/8.html) |
| [9](${nhk}/9.html) | [10](${nhk}/10.html) | [11](${nhk}/11.html) | [12](${nhk}/12.html) | [13](${nhk}/13.html) | [14](${nhk}/14.html) | [15](${nhk}/15.html) | [16](${nhk}/16.html) |
| [17](${nhk}/17.html) | [18](${nhk}/18.html) | [19](${nhk}/19.html) | [20](${nhk}/20.html) | [21](${nhk}/21.html) | [22](${nhk}/22.html) | [23](${nhk}/23.html) | [24](${nhk}/24.html) |
| [25](${nhk}/25.html) | [26](${nhk}/26.html) | [27](${nhk}/27.html) | [28](${nhk}/28.html) | [29](${nhk}/29.html) | [30](${nhk}/30.html) | [31](${nhk}/31.html) | [32](${nhk}/32.html) |
| [33](${nhk}/33.html) | [34](${nhk}/34.html) | [35](${nhk}/35.html) | [36](${nhk}/36.html) | [37](${nhk}/37.html) | [38](${nhk}/38.html) | [39](${nhk}/39.html) | [40](${nhk}/40.html) |
| [41](${nhk}/41.html) | [42](${nhk}/42.html) | [43](${nhk}/43.html) | [44](${nhk}/44.html) | [45](${nhk}/45.html) | [46](${nhk}/46.html) | [47](${nhk}/47.html) | [48](${nhk}/48.html) |
## Đọc báo
* New Easy
[New Easy](https://www3.nhk.or.jp/news/easy/)
## Khác
* Rèn nói chuyện
Bạn tìm câu tiếng nhật bạn thích học thuộc lòng và cố đọc nhanh nhất có thể
      `
    };
  },
  head() {
    return {
      titleTemplate: `%s - Tổng hợp tài liệu học tiếng Nhật`
    };
  },
  layout: "forum",
  methods: {
    
  },
  mounted() {
  }
};
</script>