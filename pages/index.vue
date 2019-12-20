<template>
  <v-row justify="center">
    <Search />
    <v-col cols="12">
      <HtmlParser :content="$md.render(introdue)"/>
    </v-col>
  </v-row>
</template>
<script>
import Search from "@/components/nihongo/Search";
import HtmlParser from "@/components/HtmlParser";
export default {
  components: {
    Search,
    HtmlParser
  },
  data() {
    return {
      introdue: `
## Cách sử dụng
* Nhập từ kanji mà bạn muốn xem. Ví dụ "四".
Trên điện thoại các bạn thêm vào màn hình chính để dùng khi offline nhé
* Cách sử dụng markdown để viết bài
[markdown](https://lithong.com/howto)
## Các tài liệu học tiếng nhật từ web này
* Các nét kanji cơ bản
[Kanji Primitive Elements](/main)
* Tổng hợp các nguồn học tiếng nhật
[awesome](/awesome)
## Các nguồn khác
* Chát online với oboe
[Online support](https://lovejapanworkspace.slack.com)
* Hỗ trợ đánh tiếng nhật online
[Gõ tiếng Nhật](https://typing.lithong.com/)
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