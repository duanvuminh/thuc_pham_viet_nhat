<template>
  <v-row justify="center">
    <NihonTyping />
    <v-col cols="12">
      <div v-html="$md.render(introdue)"></div>
    </v-col>
  </v-row>
</template>
<script>
import NihonTyping from "@/components/NihonTyping";
export default {
  components: {
    NihonTyping
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