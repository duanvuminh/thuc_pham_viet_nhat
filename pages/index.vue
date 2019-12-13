<template>
  <v-row justify="center">
    <Search />
    <v-col cols="12">
      <div v-html="$md.render(introdue)"></div>
    </v-col>
  </v-row>
</template>
<script>
import Search from "@/components/Search";
export default {
  components: {
    Search
  },
  data() {
    return {
      introdue: `
## Cách sử dụng
Nhập từ kanji mà bạn muốn xem. Ví dụ "四".
* Trên điện thoại các bạn thêm vào màn hình chính để dùng khi offline nhé
## Các nguồn khác
* Best recommended input extension
[Google input tool](https://www.google.com/inputtools/chrome/)
* Join oboe Team
[Online support](https://lovejapanworkspace.slack.com)
* How to edit with markdown
[markdown](https://lithong.com/howto)
* Hỗ trợ đánh tiếng nhật online
[Gõ tiếng Nhật](https://typing.lithong.com/)
* Q&A
Comming soon...
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