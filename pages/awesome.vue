<template>
  <v-row justify="center">
    <v-col cols="12">
      <div v-html="$md.render(introdue)"></div>
    </v-col>
  </v-row>
</template>
<script>
export default {
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
* Trang web của NHK với video
[NHK](https://www.nhk.or.jp/lesson/vietnamese/)
## Đọc báo
* New Easy
[New Easy](https://www3.nhk.or.jp/news/easy/)
      `
    };
  },
  head() {
    return {
      titleTemplate: `%s - Tổng hợp tài liệu học tiếng Nhật`
    };
  },
  layout: "oboe",
  methods: {
    
  },
  mounted() {
  }
};
</script>